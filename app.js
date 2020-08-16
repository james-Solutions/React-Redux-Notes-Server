const express = require("express");
const http = require("http");
var mysql = require('mysql');

function createMySqlCon() {
  return mysql.createConnection({
    host: "your_host",
    user: "your_user",
    password: "your_password",
    database: "your_database"
  });
}

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
  res.send({ response: "I am alive" }).status(200);
  next();
});

router.get("/note/read", (req, res) =>{
  var con = createMySqlCon();
  // We will read all of the notes in the database and return it to the user
  console.log('note read request');
  con.connect((err) => {
    if (err) {
      console.log(err);
      res.send({ response: 'failed to connecting to sql'})
    } else {
      // Connected to SQL
      con.query('SELECT * FROM noteStorage', (err, result, fields) => {
        if (err){
          console.log(err);
          console.log('failed to read all notes');
          res.send({ response: 'failed to read all notes' });
        } else {
          console.log('read all notes successfully');
          res.send({ response: result });          
        }
      })
      console.log('disconnected from sql server');
      con.end();
    }
  })
})

router.post("/note/insert", (req, res) => {
  var con = createMySqlCon();
  console.log('insert request');
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
          console.log('failed to insert note');
          res.send({ response: 'failed to insert note'});
        } else{
          console.log('inserted note successfully')
          res.send({ response: 'note inserted', key: result.insertId });
        }
      })
      console.log('disconnected from sql server');
      con.end();
    }
  })
})

router.post("/note/update", (req, res) => {
  var con = createMySqlCon();
  console.log('update request');
  const sqlStatement = `UPDATE noteStorage SET title='${req.body.title}', comment='${req.body.content}' WHERE noteID=${req.body.key}`;
  con.connect((err) => {
    if (err) {
      console.log(err);
      res.send({ response: 'failed connecting to sql'});
    } else {
      console.log("Connected to SQL Server");
      con.query(sqlStatement, (err, result, fields) => {
        if (err) {
          console.log(err);
          console.log('failed to update note');
          res.send({ response: 'failed to update note'});
        } else{
          console.log('note updated successfully');
          res.send({ response: 'note updated', key: result.insertId });
        }
      })
      console.log('disconnected from sql server');
      con.end();
    }
  })
})

router.post("/note/remove", (req, res) => {
  var con = createMySqlCon();
  console.log('remove request');
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
          console.log('failed to delete note');
          res.send({ response: 'failed to delete note'});
        } else{
          console.log('note deleted');
          res.send({ response: 'note deleted' });
        }
      })
      console.log('disconnected from sql server');
      con.end();
    }
  })
})

app.use("/", router);
app.use("/note/insert", router);
app.use("/note/remove", router);
app.use("/note/update", router);
app.use("/note/read", router);

module.exports = router;

const server = http.createServer(app);

server.listen(port, () => console.log(`Listening on port ${port}`));