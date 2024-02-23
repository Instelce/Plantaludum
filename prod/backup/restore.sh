#!/bin/sh

# get postgres-deployment name
postgresDeploymentName="postgres-deployment-$(kubectl get pods --no-headers -o custom-columns="NAME:.metadata.name" | grep -o -P '(?<=postgres-deployment-).*')"
echo "Postgres deployment pod found :" $postgresDeploymentName

backupFile=$(ls -1 ../../.backups/*.gz | sort -r | head -n 1)
echo "Restore" $backupFile

kubectl cp ../../.backups/$backupFile $postgresDeploymentName:backups/tmp/$backupFile

gunzip -c backups/tmp/$backupFile | psql -U postgres_user -d plantaludumdb

kubectl exec $postgresDeploymentName -- sh -c "rm /backups/tmp/*"
