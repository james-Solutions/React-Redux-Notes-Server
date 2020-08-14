const express = require("express");
const http = require("http");
var mysql = require('mysql');

const port = process.env.PORT || 4002;
const router = express.Router();
const app = express();
app.use(express.json());
app.use(express.urlencoded());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get("/", (req, res, next) => {
  console.log('Alive request');
  res.send({ response: "I am aliveeeeeeeeeee" }).status(200);
  next();
});

router.post("/note/insert", (req, res) => {
  var con = mysql.createConnection({
    host: "host",
    user: "user",
    password: "password",
    database: "database_name"
  });
  console.log('insert request');
  console.log(req.body);
  const sqlStatement = `INSERT INTO noteStorage (title, comment) VALUES ('${req.body.title}', '${req.body.content}')`;
  con.connect((err) => {
    if (err) {
      console.log(err);
      res.send({ response: 'failed connecting to sql'});
    } else {
      console.log("Connected to SQL Server");
      con.query(sqlStatement, (err, result, fields) => {
        if (err) {
          console.log(err);
          res.send({ response: 'failed to insert note'});
        } else{
          console.log(result);
          res.send({ response: 'note inserted', key: result.insertId });
          console.log(fields);
        }
      })
      con.end();
    }
  })
})

router.post("/note/remove", (req, res) => {
  var con = mysql.createConnection({
    host: "host",
    user: "user",
    password: "password",
    database: "database_name"
  });
  console.log('remove request');
  console.log(req.body);
  const sqlStatement = `DELETE FROM noteStorage WHERE noteID='${req.body.key}'`;
  con.connect((err) => {
    if (err) {
      console.log(err);
      res.send({ response: 'failed connecting to sql'});
    } else {
      console.log("Connected to SQL Server");
      con.query(sqlStatement, (err, result, fields) => {
        if (err) {
          console.log(err);
          res.send({ response: 'failed to delete note'});
        } else{
          console.log(result);
          res.send({ response: 'note delete' });
          console.log(fields);
        }
      })
      con.end();
    }
  })
})

app.use("/", router);
app.use("/note/insert", router);
app.use("/note/remove", router);

module.exports = router;

const server = http.createServer(app);

server.listen(port, () => console.log(`Listening on port ${port}`));