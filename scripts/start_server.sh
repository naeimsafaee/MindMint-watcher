
#!/bin/bash

# add permision to folder
sudo chmod -R 777 /var/www/mindmint-watcher

# Go to app folder
cd /var/www/mindmint-watcher

# start again
echo "start all services"
pm2 start all