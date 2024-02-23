#!/bin/sh

# get postgres-deployment name
postgresDeploymentName="postgres-deployment-$(kubectl get pods --no-headers -o custom-columns="NAME:.metadata.name" | grep -o -P '(?<=postgres-deployment-).*')"
echo "Postgres deployment pod found :" $postgresDeploymentName

# create backup dir in the pod
kubectl exec $postgresDeploymentName -- sh -c "mkdir /backups"
kubectl exec $postgresDeploymentName -- sh -c "mkdir /backups/tmp"

# create backup dir in local storage
mkdir ../../.backups
