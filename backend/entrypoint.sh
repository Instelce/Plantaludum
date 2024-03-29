#!/bin/sh
if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
      echo "."
    done

    echo "PostgreSQL started"
fi

python manage.py collectstatic --noinput
python manage.py migrate --noinput
echo "from django.contrib.auth import get_user_model;
User = get_user_model();
User.objects.create_superuser('$DJANGO_ADMIN_USER', '$DJANGO_ADMIN_EMAIL', '$DJANGO_ADMIN_PASSWORD')" | python manage.py shell

ls static

exec "$@"