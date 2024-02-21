#!/bin/sh

echo "Front..."
sudo docker build -t instelce/react_dev_image:latest ./frontend/ --build-arg VITE_MODE=prod
sudo docker push instelce/react_dev_image:latest

# echo "Back..."
# sudo docker build -t instelce/django_dev_image:latest ../backend/
# sudo docker push -t instelce/django_dev_image:latest