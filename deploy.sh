#!/bin/sh

# Do not run this script !

kubectl apply -f k8s/app_secrets.yaml
kubectl apply -f k8s/app_variables.yaml

kubectl apply -f k8s/component_postgres.yaml

kubectl apply -f k8s/redis/deployment.yaml
kubectl apply -f k8s/redis/service.yaml

kubectl apply -f k8s/job_django.yaml

kubectl apply -f k8s/component_django.yaml
kubectl apply -f k8s/component_react.yaml

kubectl apply -f k8s/celery/worker-deployment.yaml
kubectl apply -f k8s/celery/beat-deployment.yaml

minikube addons enable ingress

kubectl apply -f k8s/ingress_service.yaml
