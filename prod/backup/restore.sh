#!/bin/sh

read -p "Are you sure you want to restore the database? (y/n) " -n 1 -r

# get postgres-deployment name
postgresDeploymentName="postgres-deployment-$(kubectl get pods --no-headers -o custom-columns="NAME:.metadata.name" | grep -o -P '(?<=postgres-deployment-).*')"
echo "Postgres deployment pod found :" $postgresDeploymentName

# get last backup file
backupFile=$(ls -1t .backups/*.gz | head -n 1 | xargs basename)
echo "Restore" $backupFile

# copy backup file to pod
kubectl cp .backups/$backupFile $postgresDeploymentName:backups/tmp/$backupFile

# drop existing database
kubectl exec $postgresDeploymentName -- sh -c "psql -U postgres_user -d template1 -c 'DROP DATABASE IF EXISTS plantaludumdb;'"

# recreate table
kubectl exec $postgresDeploymentName -- sh -c "psql -U postgres_user -d template1 -c 'CREATE DATABASE plantaludumdb;'"

# restore db
kubectl exec $postgresDeploymentName -- sh -c "gunzip -c backups/tmp/$backupFile | psql -U postgres_user -d plantaludumdb"

# remove backup file
kubectl exec $postgresDeploymentName -- sh -c "rm /backups/tmp/*"
