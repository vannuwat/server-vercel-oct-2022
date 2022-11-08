var express = require('express');
const app = express();

const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();
 
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: true,
    rejectUnauthorized: false,
})
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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


app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));
app.use(express.urlencoded({extended: false}))


let initial_sql = 'SELECT * FROM each_bus_info';
var each_bus_info = null;

pool.query(initial_sql, function (err, data) {
  if (err){
      console.log(err)
  }
  each_bus_info = data.rows
  });


app.get('/api/database/bus_info/summaryTable', function(req, res) {
  
    console.log('Connected!');
    console.log(req)
    var sql='SELECT * FROM bus_info';
    pool.query(sql, function (err, data) {
    if (err){
        console.log(err)
    }
    res.send(data.rows)
    });
  
});

app.get('/api/database/bus_info/now_data', function(req, res) {
  
  console.log('Connected!');
  console.log(req)
  var sql='SELECT  * FROM test_iot_info ORDER BY schedule_date DESC LIMIT 1;';
  pool.query(sql, function (err, data) {
  if (err){
      console.log(err)
  }
  res.send(data.rows)
  });

});

app.get('/api/database/bus_info/summaryTable/:bus_id', function(req, res) {
  
  const found = each_bus_info.some(e => e.bus_id === parseInt(req.params.bus_id));

  if (found) {
    const id = parseInt(req.params.bus_id);
    var sql=`SELECT * FROM each_bus_info WHERE bus_id = ${id} ORDER by location,schedule_date ASC`;
    pool.query(sql, function (err, data) {
    if (err){
        console.log(err)
    }
    res.send(data.rows)
    });

  } else {

    res.sendStatus(400);

  }

});

app.get('/api/database/bus_info/summaryTable/sorted_schedule/:bus_id', function(req, res) {
  
  const found = each_bus_info.some(e => e.bus_id === parseInt(req.params.bus_id));

  if (found) {
    const id = parseInt(req.params.bus_id);
    var sql=`SELECT * FROM each_bus_info WHERE bus_id = ${id} ORDER by schedule_date ASC`;
    pool.query(sql, function (err, data) {
    if (err){
        console.log(err)
    }
    res.send(data.rows)
    });

  } else {

    res.sendStatus(400);

  }

});

app.get('/api/database/bus_info/summaryTable/sorted_location/:bus_id', function(req, res) {
  
  const found = each_bus_info.some(e => e.bus_id === parseInt(req.params.bus_id));

  if (found) {
    const id = parseInt(req.params.bus_id);
    var sql=`SELECT DISTINCT "location" FROM each_bus_info where bus_id = ${id} order by "location" ;`;
    pool.query(sql, function (err, data) {
    if (err){
        console.log(err)
    }
    res.send(data.rows)
    });

  } else {

    res.sendStatus(400);

  }

});

let in_data = "";
app.post('/api/database/magellan/sensor', (req, res) => {
  ThingName = req.body.ThingInfo.ThingName;
  IMEI = req.body.ThingInfo.IMEI;
  Sensors = req.body.Sensors;
  total_pass = req.body.Sensors.TotalPassenger;
  in_pass = req.body.Sensors.InPassenger;
  out_pass = req.body.Sensors.OutPassenger;
  // lat = req.body.Sensors.Latitude;
  // log = req.body.Sensors.Logtitude;
  location = req.body.Sensors.Location;
  in_data = {ThingName, IMEI, Sensors}
  var sql= `INSERT INTO test_iot_info  (thing_name, IMEI, total_passenger, in_passenger, out_passenger, location , schedule_date) 
  VALUES 
 ('${ThingName}', '${IMEI}', ${total_pass}, ${in_pass}, ${out_pass}, '${location}', NOW());`;
    pool.query(sql, function (err, data) {
    if (err){
      res.status(400).send({msg : "error insert sql data"});
    }
    else{
      res.status(200).send({in_data});
    }
    });
});

app.get('/api/database/magellan/sensor', (req, res) => {

  res.status(200).send({in_data});
});



var port = process.env.PORT || 5000;
app.listen(port, () => console.log("listening", port))

module.exports = app
