#!/bin/sh

ssh jowie@104.248.240.152 <<EOF
 cd ~/infoskjerm-api
 git pull
 npm install
 npm run build
 pm2 restart infoskjerm-api
 exit
EOF