#!/bin/bash

end=0
while [ $end -ne -1 ];
do
	count1=$(redis-cli -h 54.202.217.113 get server1)
	count2=$(redis-cli -h 54.202.217.113 get server2)

	if [ $count1 -gt $count2 ]; then
		if [ $((count1-count2)) -gt 5 ]; then
			echo More request were sent to original server
			echo Rolling back to original server
			echo Variational server no longer receives request
			echo Removing server 
			redis-cli -h 54.202.217.113 lpop ProductionQueue
			break
		fi
	else
		if [ $((count2-count1)) -gt 5 ]; then
			echo More request were sent to variational server
			echo More request were sent to original server
			echo Rolling back to original server
			echo Variational server no longer receives request
			echo Removing server
			redis-cli -h 54.202.217.113 rpop ProductionQueue
			break
		fi
	fi

    sleep 15

done
