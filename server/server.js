var http = require('http');
    debug = require('debug')('SERVER'),
    express = require('express'),
    app = express(),
    server = http.createServer(app);
var port = 3333;

app.use(express.static(__dirname + '/public'));

server.listen(port);
debug('SERVER IS LISTENING ON PORT ' + port);
