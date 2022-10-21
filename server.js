var express = require('express');
var router = express.Router();


const db = require('./database');
const app = express();

const cors = require('cors');
app.use(cors({
    origin: ['*']
}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const port = 5000;
// another routes also appear here
// this script to fetch data from MySQL databse table
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));


let initial_sql = 'SELECT * FROM each_bus_info';
var each_bus_info = null;

db.query(initial_sql, function (err, data) {
  if (err){
      console.log(err)
  }
  each_bus_info = data
  });


app.get('/api/database/test', function(req, res) {
  
    // console.log(data);
    res.send("Im here");
  
});

app.get('/api/database/bus_info/summaryTable', function(req, res) {
  
    console.log('Connected!');
    console.log(req)
    var sql='SELECT * FROM bus_info';
    db.query(sql, function (err, data) {
    if (err){
        console.log(err)
    }
    // console.log(data);
    res.send(data)
    });
  
});

app.get('/api/database/bus_info/summaryTable/:bus_id', function(req, res) {
  
  const found = each_bus_info.some(e => e.bus_id === parseInt(req.params.bus_id));

  if (found) {
    const id = parseInt(req.params.bus_id);
    // res.json(each_bus_info.filter(e => e.bus_id === parseInt(req.params.bus_id)));
    var sql=`SELECT * FROM each_bus_info WHERE bus_id = ${id} ORDER by location,schedule_date ASC`;
    db.query(sql, function (err, data) {
    if (err){
        console.log(err)
    }
    // console.log(data);
    res.send(data)
    });

  } else {

    res.sendStatus(400);

  }

});

app.get('/api/database/bus_info/summaryTable/sorted_schedule/:bus_id', function(req, res) {
  
  const found = each_bus_info.some(e => e.bus_id === parseInt(req.params.bus_id));

  if (found) {
    const id = parseInt(req.params.bus_id);
    // res.json(each_bus_info.filter(e => e.bus_id === parseInt(req.params.bus_id)));
    var sql=`SELECT * FROM each_bus_info WHERE bus_id = ${id} ORDER by schedule_date ASC`;
    db.query(sql, function (err, data) {
    if (err){
        console.log(err)
    }
    // console.log(data);
    res.send(data)
    });

  } else {

    res.sendStatus(400);

  }

});

app.get('/api/database/bus_info/summaryTable/sorted_location/:bus_id', function(req, res) {
  
  const found = each_bus_info.some(e => e.bus_id === parseInt(req.params.bus_id));

  if (found) {
    const id = parseInt(req.params.bus_id);
    // res.json(each_bus_info.filter(e => e.bus_id === parseInt(req.params.bus_id)));
    var sql=`SELECT * FROM each_bus_info WHERE bus_id = ${id} GROUP by location ASC`;
    db.query(sql, function (err, data) {
    if (err){
        console.log(err)
    }
    // console.log(data);
    res.send(data)
    });

  } else {

    res.sendStatus(400);

  }
});

let incomingData = ""
app.post('/api/database/magellan/sensor', (req, res) => {
  if (!res.body){
    incomingData = req.body;
    res.status(200).send(incomingData);
  }
});

app.get('/api/database/magellan/sensor', (req, res) => {
  if (!res.body){
    res.status(200).send(incomingData);
  }
});

app.listen(port, () => console.log("listening", port))

module.exports = app