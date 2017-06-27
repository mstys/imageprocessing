/*
 * Inspired by: http://stackoverflow.com/questions/4360060/video-streaming-with-html-5-via-node-js
 */

var http = require('http'),
  webSocketServer = require('websocket').server,
  path = require('path'),
  chokidar = require('chokidar'),
  fs = require('fs'),
  util = require('util'),
  formidable = require('formidable'),
  mime = require('mime'),
  ffmpeg = require('fluent-ffmpeg'),
  url = require('url');

var events = require('events');
var eventEmitter = new events.EventEmitter();

// var watcher = chokidar.watch('./uploads/screens', {
//   ignored: /(^|[\/\\])\../,
//   persistent: true
// });


var globalImgName = {};
globalImgName.path = [];

chokidar.watch('./uploads/screens').on('add', (file) => {
  globalImgName.path.push(path.basename(file))
  // console.log(path.basename(a));
});

var server = http.createServer(function (req, res) {
  // var command = ffmpeg();
  var url_parts = url.parse(req.url, true);
  var req_parameters = url_parts.query;
  console.log("Req param: ", req_parameters, "Req URL: ", req.url);
  // console.log("url parts", url_parts);

  if (req.url == '/upload' && req.method.toLocaleLowerCase() == 'post') {

    var nameNEW = null;
    var form = new formidable.IncomingForm();

    form.uploadDir = __dirname + '/uploads';

    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.maxFields = 1000;
    form.multiples = false;


    form.parse(req, function (err, fields, files) {


      var file = util.inspect(files);
      // console.log("Files", file.split('path:')[1]);

      // pathNew = file.split('path:')[1].split('\',')[0].toString().replace(/\\/g, '/').replace(/\/\//g, '/').replace(/\'/, '');

      // console.log("File name", file.split('path:')[1].split('\',')[0].toString().replace(/\\/g, '/').replace(/\/\//g, '/').replace(/\'/, ''));



      res.writeHead(201, { 'content-type': 'text/html' });
      // res.writeHead(200, { 'content-type': 'application/json' });
      // res.write(JSON.stringify({
      //   'file': 'dupa'
      // }))
      res.end();
    });
    form.on('fileBegin', function (name, file) {
      file.name = "upload_" + Date.now();
      nameNEW = file.name;
      file.path = form.uploadDir + "/" + file.name + ".webm";
      // console.log('filebegin: ', name, " ", file);

    });

    form.on('end', function () {
      ffmpeg('./uploads/' + nameNEW + ".webm")
        .screenshots({
          timestamps: ['00:01', '00:03'],
          folder: './uploads/screens/',
          filename: 'screen_' + nameNEW + '-%s.png'
        });

      // fs.watch('./uploads/screens/', function (event, filename) {
      //   console.log('event is: ' + event);
      //   if (filename) {
      //     console.log('filename provided: ' + filename);
      //     globalImgName.path.push(filename)
      //     console.log("GLOBAL",globalImgName.path);
      //   }
      // });



      eventEmitter.emit('update');
      console.log('Done');
    })

    // var ffstream = command.pipe();

    // form.onPart = function (part) {
    //   part.addListener('data', function () {
    //     console.log("Listeb", part);


    //   });
    // }

    return;

  } else if (url_parts.pathname === '/uploads/screens' && req.method.toLocaleLowerCase() == 'get') {
    // var stat = fs.statSync(path);

    // var stat = fs.statSync(req_parameters[0]);
    var p = '.' + url_parts.path.replace('?', '/');

    var img = fs.readFileSync(p);
    res.writeHead(200, { 'Content-Type': 'image/gif' });
    res.end(img, 'binary');

  } else {

    var path = '';

    switch (req_parameters.movie) {
      case '1':
        path = 'video.mp4'
        break;
      case '2':
        path = 'video2.mp4'
        break;
      case '3':
        path = 'youtube.mp4'
        break;
      case '4':
        path = 'youtube_dash.mpd'
        break;
      default:
        path = 'video2.mp4';
    }


    var stat = fs.statSync(path);
    var total = fs.statSync(path).size;   //size in bytes    sample video 31,491,130 bytes

    // var total = stat.size;
    if (req.headers['range']) {
      //   var range = req.headers.range;
      //   console.log('Ran ', range);
      //   var parts = range.replace(/bytes=/, "").split("-");
      //   var partialstart = parts[0];
      //   var partialend = parts[1];

      var range = req.headers.range;
      console.log("Range", range);

      var splitq = range.split(/[-=]/);
      console.log('splitq', splitq);
      var start = +splitq[1];
      var end = splitq[2] ? splitq[2] : total - 1;  //if end not specified get (total - 1)  -- range is zero indexed
      console.log("Total, start, end ", total, "  ", start, "  ", end);
      var chunksize = end - start + 1;
      start = parseInt(start, 10);
      end = end ? parseInt(end, 10) : total - 1;
      chunksize = (end - start) + 1;
      console.log('RANGE: ' + end + ' - ' + start + ' = ' + chunksize);

      var file = fs.createReadStream(path, { start: start, end: end });
      res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4', 'Access-Control-Allow-Origin': '*' });
      file.pipe(res);
    } else {
      console.log('ALL: ' + total);
      res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
      fs.createReadStream(path).pipe(res);
    }
  }
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');


/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
  // WebSocket server is tied to a HTTP server. WebSocket
  // request is just an enhanced HTTP request. For more info 
  // http://tools.ietf.org/html/rfc6455#page-6
  httpServer: server
});

wsServer.on('request', function (request) {

  console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

  var connection = request.accept(null, request.origin);

  console.log((new Date()) + ' Connection accepted.');

  // user sent some message
  // connection.on('message', function (message) {

  eventEmitter.on('update', () => {
    // var obj = {};
    // obj.img = "dupa"
    connection.send(JSON.stringify(globalImgName));
    console.log("Sended");
  });




  // })
});

