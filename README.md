### Start app containers

First of all, download this repository and open directory
```bash
$ git clone git@github.com:AlexSummers/mevn-test.git
$ cd mevn-test
```

Then start the `frontend`, `backend` and `db` containers using docker-compose

```	bash
$ docker-compose up -d
```
After finishing build containters you can create simple db data
```	bash
$ docker-compose exec -T db sh -c 'mongorestore --archive' < db.dump
```

Access the app from your browser at http://localhost:8080
