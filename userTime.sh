#!/bin/bash

end=0
while [ $end -ne -1 ];
do
	server1=$(redis-cli -h 54.187.14.98 lindex ProductionQueue 1)
	server2=$(redis-cli -h 54.187.14.98 lindex ProductionQueue 0)
	echo $server1
	echo $server2
	count1=$(redis-cli -h 54.187.14.98 get $server1)
	count2=$(redis-cli -h 54.187.14.98 get $server2)
	echo $count1
	echo $count2

	if [ $count1 -gt $count2 ]; then
		if [ $((count1-count2)) -gt 120000 ]; then
			echo Users spent more time on original server
			echo Rolling back to original server
			echo Variational server no longer receives request
			echo Removing server 
			redis-cli -h 54.187.14.98 lpop ProductionQueue
			break
		fi
	else
		if [ $((count2-count1)) -gt 120000 ]; then
			echo Users spent more time to variational server
			echo original server no longer receives request
			echo Removing server
			redis-cli -h 54.187.14.98 rpop ProductionQueue
			break
		fi
	fi

    sleep 15

done