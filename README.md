## Example template for Server ExpressJS

#### How to run ?

create a new environment file:

```
touch .env
```

edit file .env with script below:
```
PORT=3052 

NODE_ENV=dev //current running env

//you can change config with your mongodb settings
DEV_DB_HOST=localhost 
DEV_DB_PORT=27017
DEV_DB_NAME=shopDEV

PROD_DB_HOST=localhost
PROD_DB_PORT=27017
PROD_DB_NAME=shopPROD
```

run for dev:
```
npm run dev
```
run for prod:
```
npm run prod
```

