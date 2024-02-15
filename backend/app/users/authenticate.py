
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from rest_framework.authentication import CSRFCheck
from rest_framework.exceptions import PermissionDenied


def enforce_csrf(request):
    check = CSRFCheck(request)
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    #print(reason)
    if reason:
        raise PermissionDenied(f'CSRF failed: {reason}')


class Authentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)

        if header is None:
            #print("cookie", request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE']))
            raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE']) or None
        else:
            raw_token = self.get_raw_token(header)
            #print("header", raw_token)

        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        #print("user", self.get_user(validated_token))
        enforce_csrf(request)
        return self.get_user(validated_token), validated_token
