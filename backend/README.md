# API de PlantaLudum

L'api à été conçu avec Django, Django Rest Framework.

## Pour commencer

### Prérequis

* télécharger [python](https://www.python.org/)

### Setup

1. Commencer par créer un dossier `Plantaludum` puis, dedans un dossier `API`.

```shell
mkdir Plantaludum
cd Plantaludum
mkdir API
cd API
```

2. Cloner le repo su la branche `api`

```shell
git clone -b api https://github.com/<Votre-Pseudo>/API.git .
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
