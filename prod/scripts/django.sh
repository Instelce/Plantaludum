#!/bin/sh

kubectl delete deployments.apps django-deployment
kubectl apply -f prod/component/django.yaml

kubectl delete deployments.apps celery-worker-deployment
kubectl apply -f prod/celery/worker-deployment.yaml

kubectl delete deployments.apps celery-beat-deployment
kubectl apply -f prod/celery/beat-deployment.yaml
