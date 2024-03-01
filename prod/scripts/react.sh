#!/bin/sh

sudo docker build -t instelce/react_dev_image:latest ./frontend/ --build-arg VITE_MODE=prod
sudo docker push instelce/react_dev_image:latest

kubectl delete deployments.apps react-deployment
kubectl apply -f prod/component/react.yaml
