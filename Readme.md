# Car-Sharing Refactoring


## Prerequisites

- There needs to be a running mysql DB accessible.
- [Node.js](https://nodejs.org) runtime installed

### Configuration

Create a [.env file](./.env) in the root directory of this project.
Here you can provide some configuration data like username and password of the database.
Have a look at the [.env.example file](./.env.example) which provides an example configuration.
For production, it is highly recommended to produce a random string with minimum 32 characters
for the SECRET variable. You can do that for example with the command `openssl rand -base64 40`
(produces string with length 40; openssl needs to be available on your system).

## Build, Run & Deploy

### The whole application deployment

If you want to deploy the whole application, have a look at the
[car-sharing deployment repository(https://code.fbi.h-da.de/stlsklei/car-sharing-deployment).

### For development

#### Install modules

- Install node modules: 
    ```bash
    npm install
    ```

#### Start Database

- If you have Docker installed and running, you can use the included docker-compose file in we3ve_database_dackend_dev  
Navigate to the folder and run 
    ```bash
    docker compose up
    ```
    
#### Start the server

- Run the server in development mode:
    ```bash
    npm run dev
    ```
- Watch and run in development mode (if you change a file, the server restarts automatically):
    ```bash
    npm run watch
    ```

#### Test and Liniting

To run the test, you have to create a [.env.test file](./.env.test) in the root directory of this project.
Here you configure the app for the testing environment.

- Run all tests:
    ```bash
    npm run test
    ```
- Run all tests and check the code coverage:
    ```bash
    npm run test-coverage
    ```
- To check if the linting rules have been followed:
    ```bash
    npm run lint
    ```

### For production

#### Build the app
```bash
npm run build
```

#### Run the app
```bash
npm start
```

## Major npm packages
- [typeorm](https://typeorm.io/): An [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping)
- [express](https://expressjs.com/): Web application framework
- [nodemailer](https://nodemailer.com/): SMTP Client to send emails
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme): Implementation of
[bcrypt](https://en.wikipedia.org/wiki/Bcrypt) hashing function.
- [class-validator](https://github.com/typestack/class-validator#readme): Provides decorators to validate
entity field values
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#readme): Implementation of
[JWT](https://datatracker.ietf.org/doc/html/rfc7519)

## Project structure

- [documents](./documents): Some documents for documentation purposes
- [postman](./postman): Contains a [postman collection](./postman/api_documentation.json)
and a related [postman environment](./postman/api_documentation_environment.json).
You can import this json files in the [postman application](https://www.postman.com/).
There you have a documentation to each API endpoint and can send requests to the backend.
- [we3ve_database_backend_dev](./we3ve_database_backend_dev/): Contains a docker-compose file that sets up a MySQL docker container, preconfigured to work with the backend. 
- [test](./test): The test folder contains all automated jest tests.
- [src](./src): This directory contains all the source code of this API.
  - [server.ts](./src/server.ts): This is the entrypoint of the backend.
  It's setting up the database connection and starts the server.
  - [app.ts](./src/app.ts): Here the configuration of [Express](https://expressjs.com/) takes place.
  - [app-data-source.ts](./src/app-data-source.ts): This file contains the [TypeORM](https://typeorm.io/) configuration.
  - [migrations](./src/migrations): This folder contains TypeORM migrations to migrate database structure changes.
  - [views](./src/views): Here are some html pages (in [ejs](https://ejs.co/) format)
  that the backend has to render on specific routes.
  - [entities](./src/entities): The TypeORM entities are located here.
  - [middleware](./src/middleware): Some middleware like error handler or authentication middleware.
  - [routers](./src/routers): A router defines, which method is handled by which URI and HTTP method.
  The index router decides, which one of the other routers has to handle the request.
  Each (relevant) entity is handled by another router.
  - [controllers](./src/controllers): The controller contains the logic.
  Each router has his controller with the handler functions for the routes.
