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
pm2 stop blog-ssr
pm2 delete blog-ssr
pm2 start npm --name blog-ssr -- run start
autoscript

echo 'done'