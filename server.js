var spawn = require('child_process').spawn;

var restify = require('restify');

var serverOptions = {
  name: 'wkhtmltopfd-aas',
  version: '1.0.0'
};

var server = restify.createServer(serverOptions);

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
// server.use(restify.bodyParser());

server.get('/', function(req, res, next) {
  if (req.params.url === undefined)
    return next(new restify.MissingParameterError('url'));
  
  res.header('Content-Type', 'application/pdf');
  res.header('Content-Disposition', 'attachment; filename="print.pdf"');

  var cmd = 'wkhtmltopdf';
  var args = ['-q', req.params.url, '-'];

  var child = spawn(cmd, args);
  child.stdout.pipe(res, {end: false});

  child.on('exit', function(code) {
    if (code !== 0)
      return next(new restify.InternalError('wkhtmltopdf failed'));

    return res.end();
  });
});

server.listen(8000);