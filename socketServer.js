const app = require('http').createServer();
const io = require('socket.io')(app);

app.listen(3000);
console.log('This server is listening port: 3000');

io.on('connection', function(){
    console.log('connect');
});