import datetime

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from django.middleware import csrf
from rest_framework import status
from rest_framework.exceptions import ParseError
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import OrderingFilter
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

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
                return Response({"detail": "Ce compte n'est pas activé"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"detail": "Email ou mot de passe invalide."}, status=status.HTTP_404_NOT_FOUND)


class CookieLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format="None"):
        refresh = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])

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


class UserRetrieveUpdateDestroyView(PermissionPolicyMixin, RetrieveUpdateDestroyAPIView):
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
