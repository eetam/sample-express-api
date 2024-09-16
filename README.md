# sample-express-api

Repository contains simple REST API for managing an inventory of products. 

Implemented using **Express.js**.

Additionally used:
- **TypeScript** - JavaScript with syntax for types.
- **InversifyJS** - Inversion of control container.
- **Joi** - Validation library.
- **MongoDB** - Popular document database.
- **Mongoose**- MongoDB object modeling for Node.js

Solution contains simple CQRS implementation for logic separation and a few sample unit tests.

## What could be improved?
- increase unit test coverage,
- e2e tests to check endpoints to db interactions,
- expand CQRS concept to use separate DBs for read and writes,
- use docker and docker-compose for easier setup (to start db and api simultaneously),
- use transactions when modifying more than single db document as single action (e.g.: create new order endpoint),
- add swagger documentation for endpoints

## How to run?

Before start you need to run MongoDB instance locally.
Then in .env file you should pass connection info:
e.g:
```
DB_HOST=localhost
DB_PORT=27017
DB_NAME=ims
```
After DB is ready in terminal run command: ```npm run start```

In "sample-requests" directory there are some sample requests that can be used within REST Client for Visual Studio Code extension.
Open wanted request, than Ctrl+Shift+P and find "Rest Client: Send Request" and press enter. When necessary provide existing object Id.

To run tests in terminal run command: ```npm run test```

vishnucprasad/express_ts has been used as boilerplate.
