const app = require('http').createServer();
const io = require('socket.io')(app);

app.listen(3000);
console.log('This server is listening port: 3000');
let socketMaps = {};
let existUserNames = [];
io.on('connection', function(socket){
    console.log('connect', socket.id);
    let userName = createNewName();
    socketMaps[socket.id] = {
        name: userName,
        competitor: ''        
    };
    socket.emit('userName', userName);
    io.emit('allUsers', getAllUsers());
    
    socket.on('setName', function(name){
        let user = socketMaps[socket.id];
        user.name = name;
        socketMaps[socket.id] = user;        
        io.emit('allUsers', getAllUsers());
    });
    socket.on('disconnect', function(){
        console.log('disconnect');
        delete socketMaps[socket.id];
    });
});

// 新用户连接时随机生成新的用户名
function createNewName() {
    let newName = 'user-' + parseInt(Math.random() * 10000 + 1, 10);
    while(existUserNames.includes(newName)) {
        newName = 'name' + parseInt(Math.random() * 10000 + 1, 10);
    }
    existUserNames.push(newName);
    return newName;
}

function getAllUsers() {
    let allUsers = [];
    for(let [key, value] of Object.entries(socketMaps)) {
        allUsers.push({
            id: key,
            ...value
        })
    }
    return allUsers;
}