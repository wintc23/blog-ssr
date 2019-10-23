git add .
git commit -m push
git push
ssh root@wintc.top << autoscript
cd /home/lushg/blog-ssr
git pull origin master
yarn
yarn build
lsof -i:8000 | grep 8000 | awk '{ print \$2 }' | xargs kill -9
nohup yarn start &
exit
autoscript
echo 'done'