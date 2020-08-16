# React-Redux-Notes-Server
This is a Node JS Express server meant to interact with my React-Redux-Notes App. Currently it will Create and Delete notes from a MySQL Server.

## Todo:
Add Update and Read functionality

## Getting Started

To install all the modules and start the development server: <br />
```
npm i
node app.js
```

You will also need to update the parts of the code creating the MySQL Connection to your own.
```
var con = mysql.createConnection({
    host: "yourhost",
    user: "user",
    password: "pass",
    database: "database"
  });
```

The Database table noteStorage is formatted as such: <br />
```
CREATE TABLE `noteStorage` (
    `noteID` int IDENTITY(1,1) PRIMARY KEY,
    `title` varchar(255) NOT NULL,
    `comment` varchar(255) NOT NULL
);
```

### Links
[https://github.com/james-Solutions/React-Redux-Notes](https://github.com/james-Solutions/React-Redux-Notes)<br />
