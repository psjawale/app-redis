#!/bin/bash

printf "checking for autoscale \n"
end=0
while [ $end -ne -1 ]; 
do
        value=$(redis-cli -h 54.245.30.181 get alertKey)
        echo $value
        if [ "$value" = "true" ]; then
        echo spawn new instance
        node /Users/Pooja_Jawale/Devops/Milestone-3/aws-instance/aws_production.js
        echo deploying server on new instance
        sh deploy_server.sh
        sleep 5m
        fi 

        sleep 15

done
