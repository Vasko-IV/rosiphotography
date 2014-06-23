// if on OpenShift, use OpenShift ip/port, else use your local ip/port
var ipAddress = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_PORT || 3030;

var express = require('express');
var static = require('node-static');

var env = process.env.NODE_ENV || 'development';

var app = express();
var config = require('./server/config/config')[env];

require('./server/config/express')(app, config);
require('./server/config/mongoose')(config);
require('./server/config/passport')();
require('./server/config/routes')(app);

app.listen(config.port);
console.log("Server running on port: " + config.port);

app.listen(port, ipAddress, function() {
  console.log('%s: Node server started on %s:%d ...',
                 new Date() ), ipAddress, port);
});