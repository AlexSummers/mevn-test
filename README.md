### Start app containers

Start the `frontend`, `backend` and `db` containers using docker-compose

```	bash
$ docker-compose up -d
```
After finishing build containters you can create simple db data
```	bash
$ docker-compose exec -T db sh -c 'mongorestore --archive' < db.dump
```

Access the app from your browser at http://localhost:8080
