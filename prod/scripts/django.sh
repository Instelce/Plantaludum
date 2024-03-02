#!/bin/sh

sudo docker build -t instelce/django_dev_image:latest ./backend/
sudo docker push instelce/django_dev_image:latest

kubectl delete deployments.apps django-deployment
kubectl apply -f prod/component/django.yaml

# check if the celery parameter is present
if [ "$1" = "celery" ]; then
    kubectl delete deployments.apps celery-worker-deployment
    kubectl apply -f prod/celery/worker-deployment.yaml

    kubectl delete deployments.apps celery-beat-deployment
    kubectl apply -f prod/celery/beat-deployment.yaml
fi

