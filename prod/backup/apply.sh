#!/bin/sh

# get postgres-deployment name
postgresDeploymentName="postgres-deployment-$(kubectl get pods --no-headers -o custom-columns="NAME:.metadata.name" | grep -o -P '(?<=postgres-deployment-).*')"
echo "Postgres deployment pod found :" $postgresDeploymentName

# get backup name
backupFileName="$(date +%Y-%m-%d_%H%M%S)"
echo "Backup of" $backupFileName "is starting..."

# show backups that already exist in the pod
# echo "Backups that already exist"
# kubectl exec $postgresDeploymentName -- ls /backups/

# make backup
kubectl exec $postgresDeploymentName -- sh -c "pg_dump -U postgres_user -d plantaludumdb | gzip > /backups/$backupFileName.gz"

# copy backup file to local machine
kubectl cp $postgresDeploymentName:backups/$backupFileName.gz .backups/$backupFileName.gz

echo "Backup finished succesfully"