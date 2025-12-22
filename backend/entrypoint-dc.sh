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

backupFile=$(ls -1t ./backups/*.gz | head -n 1 | xargs basename)
gunzip -c ./backups/$backupFile | psql -U postgres_user -d plantaludumdb

exec "$@"