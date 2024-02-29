
# Todo-List

This is the final project of the Backend with NodeJS course.

It is a CRUD project
Database: SQL with Sequelize.
Backend: NodeJS with Express.
Frontend: HTML, CSS and JavaScript.

It is a login with user authentication that at the moment of entering you can see an Todo list app.

In SQL you have to create a database called todolist:

1 CREATE DATABASE todolist;

You have to create an .env file and inside this file the following fields will be included

PORT = 3000
DB_HOST = 
DB_USER = 
DB_PASSWORD = 
DB_NAME = todolist // this is what your database should be called
JWT_SECRET = 

After following the steps of Run Locally it will automatically create the tables inside the database.

## Run Locally

Clone the project

```bash
  git clone git@github.com:DarioAlbertoSalazar/Todo-List-CRUD.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

Go to

```bash
  "http://localhost:3000/signup.html"
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Tech Stack

**Client:** HTML, CSS, JavaScript

**Server:** NodeJS, Express, SQL, Sequelize
