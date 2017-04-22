/**
 * Created by alykoshin on 22.04.17.
 */
'use strict';

var express = require('express');
var path = require('path');
var app = express();

// Define the port to run on
app.set('port', 80);

app.use('/', express.static(path.join(__dirname, '.')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var addr = server.address();
  console.log('Server listening at ', addr);
});
