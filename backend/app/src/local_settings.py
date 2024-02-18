import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

#################################################################
##  Get Django environment set by docker (i.e either development or production), or else set it to local ##
#################################################################
try:
    DJANGO_ENV = os.environ.get("DJANGO_ENV")
except:
    DJANGO_ENV = "local"

#################################################################
##  If Django environement has been set by docker it would be either development or production otherwise it would be undefined or local ##
#################################################################
if DJANGO_ENV == "development" or DJANGO_ENV == "production":
    print(DJANGO_ENV)

    try:
        SECRET_KEY = os.environ.get("SECRET_KEY")
    except:
        SECRET_KEY = "localsecret"

    try:
        DEBUG = int(os.environ.get("DEBUG", default=0))
    except:
        DEBUG = False

    try:
        ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(" ")
    except:
        ALLOWED_HOSTS = ["127.0.0.1", "0.0.0.0", "localhost"]

    try:
        CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS").split(" ")
        CSRF_TRUSTED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS").split(" ")
    except:
        CORS_ORIGIN_ALLOW_ALL = True
        CSRF_COOKIE_SECURE = False
        CORS_ALLOWED_ORIGINS = ["http://127.0.0.1:5173", "http://localhost:5173", "http://127.0.0.1:3000"]
        CSRF_TRUSTED_ORIGINS = ["http://127.0.0.1:5173", "http://localhost:5173", "http://127.0.0.1:3000"]

    DATABASES = {
        "default": {
            "ENGINE": os.environ.get("DB_ENGINE", "django.db.backends.postgresql_psycopg2"),
            "NAME": os.environ.get("DB_NAME", "plantaludumdb"),
            "USER": os.environ.get("DB_USER", "user"),
            "PASSWORD": os.environ.get("DB_PASSWORD", "password"),
            "HOST": os.environ.get("DB_HOST", "localhost"),
            "PORT": os.environ.get("DB_PORT", "5432"),
        }
    }
else:
    SECRET_KEY = "localsecret"
    DEBUG = True
    ALLOWED_HOSTS = ["127.0.0.1", "0.0.0.0", "localhost"]
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql_psycopg2",
            "NAME": "plantaludumdb",
            "USER": "postgres_user",
            "PASSWORD": "postgres_password",
            "HOST": "127.0.0.1",
            "PORT": "5432",
        }
    }

#################################################################
##  (CORS) Cross-Origin Resource Sharing Settings ##
#################################################################
CORS_ORIGIN_ALLOW_ALL = True


#################################################################
##  STATIC FILES ROOT AND URL ##
#################################################################

STATIC_ROOT = os.path.join(BASE_DIR, "static")
STATIC_URL = "/static/"
