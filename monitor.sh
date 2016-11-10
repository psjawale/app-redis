#!/bin/bash

printf "Memory\t\tCPU\n"
end=0
while [ $end -ne -1 ]; 
do
        MEMORY=$(free -m | awk 'NR==2{printf "%.2f\t\t", $3*100/$2 }')

        CPU=$(top -bn1 | grep load | awk '{printf "%.2f\t\t\n", $(NF-2)*10}')

        echo "$MEMORY$CPU"

        if [ 1 -eq "$(echo "$MEMORY > 90.00" | bc)" ]; then
        echo memory usage is high. $MEMORY% | mail -s "High memory usage for $sysname" pooja.jawale@gmail.com
        nodejs /home/ubuntu/app/setAlertKey.js
        fi

        if [ 1 -eq "$(echo "$CPU > 1.00" | bc)" ]; then
        echo CPU usage is high. $CPU | mail -s "High CPU usage for $sysname" pooja.jawale@gmail.com
        nodejs /home/ubuntu/app/setAlertKey.js
        fi

        sleep 15

done