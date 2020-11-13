git add .
git commit -m push
git pull origin master
git push
ssh root@8.129.22.92 << autoscript
cd /home/lushg/blog-ssr
git clean -df
git pull origin master
yarn
yarn build
pm2 restart pm2.json
autoscript
echo 'done'