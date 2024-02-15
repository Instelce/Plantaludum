#!/bin/bash

function source_env() {
  export $(grep -v '^#' $1 | xargs -d '\n')
}

FLORE_API_PATH="$HOME/documents/lab/FloreAPI"
PLANTALUDUM_API_PATH="$HOME/documents/lab/Plantaludum/API"
ACTIVATION_SCRIPT="env/bin/activate"

cd $FLORE_API_PATH ; source $ACTIVATION_SCRIPT ; source_env .env ; python manage.py runserver 8001 &
cd $PLANTALUDUM_API_PATH ; source $ACTIVATION_SCRIPT; source_env .env ; python manage.py runserver 8000
