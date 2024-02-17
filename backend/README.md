# API de PlantaLudum

L'api à été conçu avec Django, Django Rest Framework.

## Pour commencer

### Prérequis

* télécharger [python](https://www.python.org/)

### Setup

1. Forker et cloner le repo

    ```shell
    git clone https://github.com/<Votre-Pseudo>/Plantaludum.git
    ```

2. Rendez-vous dans le dossier `app` dans `backend`.

    ```shell
    cd backend/app
    ```

3. Créer un environnement virtuel et activez le

    ```shell
    python -m venv env
    ./env/scripts/activate
    ```

4. Installer les dépendances

    ```shell
    pip install -r requirements.txt
    ```

5. Créer la bdd

    ```shell
    python ./manage.py migrate
    ```

6. Créer un super utilisateur

    ```shell
    python ./manage.py createsuperuser --username admin --email admin@example.com
    ```

7. Lancer le serveur de développement

    ```shell
    python ./manage.py runserver
    ```

8. (Optionel) Lancer celery et django-celery-beat

    ```shell
    celery -A src worker -l INFO
    ```

    Puis dans un autre terminal.

    ```shell
    celery -A src beat -l INFO --scheduler django_celery_beat.schedulers:DatabaseScheduler
    ```
