#!/usr/bin/env fish

#systemctl start postgresql

set FLORE_API_PATH "$HOME/documents/lab/FloreAPI"
set PLANTALUDUM_API_PATH "$HOME/documents/lab/Plantaludum/API"
set ACTIVATION_SCRIPT "env/bin/activate.fish"

# source_env : https://gist.github.com/nikoheikkila/dd4357a178c8679411566ba2ca280fcc#file-envsource-fish
cd $FLORE_API_PATH ; source $ACTIVATION_SCRIPT ; source_env .env ; python manage.py runserver 8001 &
cd $PLANTALUDUM_API_PATH ; source $ACTIVATION_SCRIPT; source_env .env ; python manage.py runserver 8000
