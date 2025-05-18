### Connect to server
```sh
ssh pwp-admin@172.201.17.30
<Enter Password>
```
### Restart compose and run population
```sh
sudo docker-compose down --volumes --remove-orphans
sudo docker-compose build --no-cache
sudo docker-compose up -d
sudo docker exec -it server npm run population
```
