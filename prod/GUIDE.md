# Guide to deploy

## Docker

Build and push backend and frontend images. (check `.env.prod` in frontend)

```shell
sudo docker build -t instelce/django_dev_image:latest ./backend/
sudo docker build -t instelce/react_dev_image:latest ./frontend/ --build-arg VITE_MODE=prod
sudo docker push instelce/django_dev_image:latest
sudo docker push instelce/react_dev_image:latest
```

## Change some infos

Create new `app_secrets.yaml`.

Change :

* `DJANGO_ALLOWED_HOSTS`
* `CORS_ALLOWED_ORIGINS`
* `SECRET_KEY`

Create namespace

```shell
kubectl create namespace plantaludum
```

## Launch to production

```shell
kubectl apply -f prod/app_secrets.yaml
kubectl apply -f prod/app_variables.yaml
```

Launch `create_node_static_storage_directories.sh`.

```shell
kubectl apply -f prod/daemonset_create_node_storage-directories.yaml

kubectl apply -f prod/component_postgres.yaml
... wait
kubectl apply -f prod/job_django.yaml
... wait
kubectl apply -f prod/redis/deployment.yaml
... wait
kubectl apply -f prod/redis/service.yaml

kubectl apply -f prod/component_static_assets.yaml
kubectl apply -f prod/component_django.yaml
kubectl apply -f prod/component_react.yaml

kubectl apply -f prod/celery/worker-deployment.yaml
kubectl apply -f prod/celery/beat-deployment.yaml
```

## Setup TLS

```shell
kubectl delete validatingwebhookconfigurations ingress-nginx-admission
```

Install Cert Manager

```shell
kubectl create -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.2/cert-manager.yaml --save-config
... wait
kubectl get pods -n cert-manager
```

```shell
kubectl apply -f prod/clusterissuer.yaml
kubectl apply -f prod/ingress_service.yaml
```

Check `Ready` state

```shell
kubectl get certificate -n plantaludum
```

Backupd the certificate (optional).

```shell
kubectl get -n plantaludum -o yaml secret plantaludum-tls > prod-plantaludum.org-cert.yaml
```
