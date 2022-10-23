var express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));
app.use(express.urlencoded({extended: false}))

let in_data = "";

app.post('/api/database/magellan/sensor', (req, res) => {
  in_data = req.body;
  res.status(200).send(in_data);
});

app.get('/api/database/magellan/sensor', (req, res) => {
  res.status(200).send({msg : in_data});
});




var port = process.env.PORT || 5000;
app.listen(port, () => console.log("listening", port))

module.exports = app