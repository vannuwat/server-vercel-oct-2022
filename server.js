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
    // console.log(data);
    res.send(data.rows)
    });
  
});

app.get('/api/database/bus_info/summaryTable/:bus_id', function(req, res) {
  
  const found = each_bus_info.some(e => e.bus_id === parseInt(req.params.bus_id));

  if (found) {
    const id = parseInt(req.params.bus_id);
    // res.json(each_bus_info.filter(e => e.bus_id === parseInt(req.params.bus_id)));
    var sql=`SELECT * FROM each_bus_info WHERE bus_id = ${id} ORDER by location,schedule_date ASC`;
    pool.query(sql, function (err, data) {
    if (err){
        console.log(err)
    }
    // console.log(data);
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
    // res.json(each_bus_info.filter(e => e.bus_id === parseInt(req.params.bus_id)));
    var sql=`SELECT * FROM each_bus_info WHERE bus_id = ${id} ORDER by schedule_date ASC`;
    pool.query(sql, function (err, data) {
    if (err){
        console.log(err)
    }
    // console.log(data);
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
    // res.json(each_bus_info.filter(e => e.bus_id === parseInt(req.params.bus_id)));
    // var sql=`SELECT * FROM each_bus_info WHERE bus_id = ${id} GROUP by location ASC`;
    var sql=`SELECT DISTINCT "location" FROM each_bus_info where bus_id = ${id} order by "location" ;`;
    pool.query(sql, function (err, data) {
    if (err){
        console.log(err)
    }
    // console.log(data);
    res.send(data.rows)
    });

  } else {

    res.sendStatus(400);

  }

});

var port = process.env.PORT || 5000;
app.listen(port, () => console.log("listening", port))

module.exports = app