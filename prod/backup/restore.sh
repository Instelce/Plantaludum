#!/bin/sh

# get postgres-deployment name
postgresDeploymentName="postgres-deployment-$(kubectl get pods --no-headers -o custom-columns="NAME:.metadata.name" | grep -o -P '(?<=postgres-deployment-).*')"
echo "Postgres deployment pod found :" $postgresDeploymentName

# get last backup file
backupFile=$(ls -1t ../../.backups/*.gz | head -n 1 | xargs basename)
echo "Restore" $backupFile

# copy backup file to pod
kubectl cp ../../.backups/$backupFile $postgresDeploymentName:backups/tmp/$backupFile

# restore db
kubectl exec $postgresDeploymentName -- sh -c "gunzip -c backups/tmp/$backupFile | psql -U postgres_user -d plantaludumdb"

# remove backup file
kubectl exec $postgresDeploymentName -- sh -c "rm /backups/tmp/*"
