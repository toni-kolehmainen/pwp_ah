# PWP SPRING 2025
# PROJECT NAME
# Group information
* Student 1. Kuosmanen Miiro Miiro.Kuosmanen@student.oulu.fi
* Student 2. Kolehmainen Toni Toni.Kolehmainen@student.oulu.fi
* Student 3. Islam Mobusshar 	Md.M.Islam@student.oulu.fi
* Student 4. Rehman Haseeb haseeb.rehman@student.oulu.fi


__Remember to include all required documentation and HOWTOs, including how to create and populate the database, how to run and test the API, the url to the entrypoint, instructions on how to setup and run the client, instructions on how to setup and run the axiliary service and instructions on how to deploy the api in a production environment__

## Table of Contents
- [Setup](#setup)
- [Dependencies](#dependencies)
- [Database](#database)
- [Usage](#usage)

## Setup
Setting up the project you need to follow next few steps:

1. Create node_modules folder
One way to do this is to run
```init
npm init
```
This creates the node_modules folder and package.json files these are the most important things.

2. You need to add all other files where your node_modules file is. For this you can look the project structure for help.

3. .env file contains all information that you want to use. It should be where your index.js file is
For setting up this correctly you need add information to .env file

PORT = server port number example 3001

DATABASE_URL = "http://localhost:5432"

NAME = Username in postgres

PASSWORD = Password in postgres

JWT="console.log(require('crypto').randomBytes(64).toString('hex'))"

EMAIL=(https://ethereal.email/)

PASSWORD_ETH=(https://ethereal.email/)

## Dependencies

Depencies are visible in package.json

Dependencies
```sh
npm install
```
Dev-Dependencies
```sh
npm install --save-dev
```

## Database
Postgresql V17

## Usage

1. Start the server:
    ```sh
    npm start
    ```
    Api is open in `http://localhost:3001`

2. Test the server:
    ```sh
    npm test
    ```
3. Development the server:
    ```sh
    npm dev
    ```

## Data Population
- Install Faker
```sh
npm install @faker-js/faker
```
- Populate the Database
The database is automatically populated with sample data when the server starts if the database is empty. To manually populate the database, run:
```sh
npm run population_dev
```

## Swagger Documentation
- Install Swagger
```sh
npm install swagger-ui-express swagger-jsdoc yamljs
```
- Run this for an updated bundle swagger documentation
```sh
npm run bundle-docs
```

## Aux service 
You need example account in https://ethereal.email/

Add the ethereal email account credentials to .env.

Then you can demo the aux service in ethereal email.
