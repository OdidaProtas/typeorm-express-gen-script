# typeorm-express-gen-script

### visit https://pro-type-express-gen.web.app/

JS Script for generating boilerplate Typeorm code
Configure app name in generator.js
cd into project
run npm i or yarn

add custom middleware in src\middleware\Middleware.apply()
update vars in .env
configure db in ormconfig.json

cd into helpers dir, configure TypeORM model /entity and node modelgenerator

make migrations: npm run mm
migrate: npm run mg

dev: npm run dev
build: npm run build

deploy on heroku
add procfile with ts-node\src\index

for heroku db, update ssl in config vars.

deploy

Happy Deployment 😊
