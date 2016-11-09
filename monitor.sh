#!/bin/bash

printf "Memory\t\tCPU\n"
end=0
while [ $end -ne -1 ]; 
do
        MEMORY=$(free -m | awk 'NR==2{printf "%d\t\t", $3*100/$2 }')

        CPU=$(top -bn1 | grep load | awk '{printf "%d\t\t\n", $(NF-2)}')
        echo "$MEMORY$CPU"
        if [ "$MEMORY" -gt "50" ]; then
        echo memory usage is high. $MEMORY% | mail -s "High memory usage for $sysname" pooja.jawale@gmail.com

        fi

        if [ "$CPU" -gt "60" ]; then

        echo CPU usage is high. $CPU% | mail -s "High CPU usage for $sysname" pooja.jawale@gmail.com

        fi
        sleep 60

done
