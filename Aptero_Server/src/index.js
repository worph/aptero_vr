var path = require('path');
var express = require('express');

var routes = require('./routes');
let cors = require('cors');

var app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.listen(6767);
console.log('Listening on 6767');