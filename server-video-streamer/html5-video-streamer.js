/*
 * Inspired by: http://stackoverflow.com/questions/4360060/video-streaming-with-html-5-via-node-js
 */

var http = require('http'),
  fs = require('fs'),
  util = require('util'),
  url = require('url');

http.createServer(function (req, res) {
  var url_parts = url.parse(req.url, true);
  var req_parameters = url_parts.query;
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
    console.log('splitq' , splitq);
    var start = +splitq[1];
    var end = splitq[2] ? splitq[2] : total - 1;  //if end not specified get (total - 1)  -- range is zero indexed
    console.log("Total, start, end ", total, "  ", start,"  " ,end);
    var chunksize = end - start + 1;
    start = parseInt(start, 10);
    end = end ? parseInt(end, 10) : total - 1;
    chunksize = (end - start) + 1;
    console.log('RANGE: ' + end + ' - ' + start + ' = ' + chunksize);

    var file = fs.createReadStream(path, { start: start, end: end });
    res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4','Access-Control-Allow-Origin':'*' });
    file.pipe(res);
  } else {
    console.log('ALL: ' + total);
    res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
    fs.createReadStream(path).pipe(res);
  }
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
