import datetime
import re

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from django.middleware import csrf
from rest_framework import status
from rest_framework.exceptions import ParseError
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView, \
    ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import OrderingFilter
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
import undetected_chromedriver as uc

from decks.mixins import PermissionPolicyMixin
from .models import User
from .pagination import UserInfinitePagination
from .serializers import RegisterSerializer, CookieTokenRefreshSerializer, \
    UserSerializer, LoginSerializer


def get_user_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access_token': str(refresh.access_token),
        'refresh_token': str(refresh)
    }


class RegisterView(CreateAPIView):
    model = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    authentication_classes = []


class CookieLoginView(APIView):
    authentication_classes = []

    def post(self, request, format=None):
        data = request.data
        response = Response()
        serializer = LoginSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = authenticate(email=email, password=password)

        if user is not None:
            if user.is_active:
                tokens = get_user_tokens(user)
                response.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                    value=tokens['access_token'],
                    expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                    secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
                response.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                    value=tokens['refresh_token'],
                    expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                    secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
                response.data = tokens
                response['X-CSRFToken'] = csrf.get_token(request)

                # update last login
                current_user = User.objects.get(id=user.id)
                update_last_login(None, current_user)

                return response
            else:
                return Response({"detail": "Ce compte n'est pas activé"},
                                status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"detail": "Email ou mot de passe invalide."},
                            status=status.HTTP_404_NOT_FOUND)


class CookieLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format="None"):
        refresh = request.COOKIES.get(
            settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])

        if refresh:
            token = RefreshToken(refresh)
            token.blacklist()

            response = Response()
            response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
            response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            response.delete_cookie("csrftoken")
            response["X-CSRFToken"] = None

            response.data = {'Logout successful'}

            return response
        else:
            raise ParseError("Invalid token")


class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=response.data['refresh'],
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
            del response.data['refresh']
        response['X-CSRFToken'] = request.COOKIES.get('csrftoken')
        return super().finalize_response(request, response, *args, **kwargs)


class CurrentUserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            user = User.objects.get(id=request.user.id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)


class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = UserInfinitePagination

    filter_backends = [OrderingFilter]
    ordering_fields = ['score', 'level', 'games_played']
    ordering = '-score'


class UserRetrieveUpdateDestroyView(PermissionPolicyMixin,
                                    RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes_per_method = {
        'retrieve': [AllowAny],
        'update': [IsAuthenticated],
        'destroy': [IsAuthenticated],
    }

    def retrieve(self, request, pk=None, *args, **kwargs):
        user = User.objects.get(id=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def update(self, request, pk=None, *args, **kwargs):
        if request.user.id != int(pk):
            return Response(status=status.HTTP_403_FORBIDDEN)
        print(request.data)
        user = User.objects.get(id=pk)
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def destroy(self, request, pk=None, *args, **kwargs):
        if request.user.id != int(pk):
            return Response(status=status.HTTP_403_FORBIDDEN)
        instance = User.objects.get(id=pk)
        self.perform_destroy(instance)

        return Response(status=status.HTTP_204_NO_CONTENT)


class ThePlantGameUserStatsScrapperView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        data = request.data

        if not data or not data.get('username') or not data.get('password'):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        login_url = "https://theplantgame.com/login/"
        target_url = "https://theplantgame.com/"
        username = data.get('username')
        password = data.get('password')

        chromeOptions = uc.ChromeOptions()
        chromeOptions.headless = True
        driver = uc.Chrome(use_subprocess=True, options=chromeOptions)

        driver.get(login_url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "login-form")))

        username_input = driver.find_element(By.ID, "id_username")
        username_input.send_keys(username)

        password_input = driver.find_element(By.ID, "id_password")
        password_input.send_keys(password)

        driver.find_element(By.TAG_NAME, "input").submit()

        try:
            error = driver.find_element(By.CLASS_NAME, "error")
        except NoSuchElementException:
            error = None

        if (error is None):
            driver.get(target_url)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "bottom")))

            points = driver.find_element(By.XPATH,
                                         "/html/body/div[3]/div[2]/div/div/div/div/div[1]").text
            identifications = driver.find_element(By.XPATH,
                                                  "/html/body/div[3]/div[2]/div/div/div/div/div[2]").text

            print(re.match(r'(.*) point', points).group(1))
            print(re.match(r'(.*) identification', identifications).group(1))

            res_status = status.HTTP_200_OK
            response = {
                "points": int(re.match(r'(.*) point', points).group(1)),
                "identifications": int(
                    re.match(r'(.*) identification', identifications).group(1))
            }
        else:
            res_status = status.HTTP_400_BAD_REQUEST
            response = {
                "error": error.text,
            }

        driver.close()
        return Response(data=response, status=res_status)
