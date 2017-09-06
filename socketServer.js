const app = require('http').createServer();
const io = require('socket.io')(app);

app.listen(3000);
console.log('This server is listening port: 3000');
let socketMaps = {};
let existUserNames = [];
io.on('connection', function (socket) {
    console.log('connect', socket.id);
    let userName = createNewName();
    socketMaps[socket.id] = {
        name: userName,
        competitor: '',
        currentStep: false,
        isBlack: false
    };
    socket.emit('userName', userName);
    io.emit('allUsers', getAllUsers());

    socket.on('setName', function (name) {
        let user = socketMaps[socket.id];
        user.name = name;
        socketMaps[socket.id] = user;
        io.emit('allUsers', getAllUsers());
    });

    socket.on('applyGame', function (competitorId) {
        let applyId = socket.id;
        socketMaps[applyId].competitor = competitorId;
        socketMaps[competitorId].competitor = applyId;

        if (parseInt(Math.random() * 100 + 1, 10) % 2 === 0) {
            socketMaps[applyId].currentStep = true;
            socketMaps[applyId].isBlack = true;
        } else {
            socketMaps[competitorId].currentStep = true;
            socketMaps[competitorId].isBlack = true;
        }
        io.to(applyId).emit('beginGame', socketMaps[applyId]);
        io.to(competitorId).emit('beginGame', socketMaps[competitorId]);
        io.emit('allUsers', getAllUsers());
    });

    socket.on('step', function(stepInfo) {
        let competitorId = socketMaps[socket.id].competitor;
        let competitor = socketMaps[competitorId];
        competitor.currentStep = true;
        io.to(competitorId).emit('competitorStep', {
            ownInfo: competitor,
            stepInfo: stepInfo
        })
    });

    socket.on('disconnect', function () {
        console.log('disconnect');
        delete socketMaps[socket.id];
    });
});

// 新用户连接时随机生成新的用户名
function createNewName() {
    let newName = 'user' + parseInt(Math.random() * 10000 + 1, 10);
    while (existUserNames.includes(newName)) {
        newName = 'name' + parseInt(Math.random() * 10000 + 1, 10);
    }
    existUserNames.push(newName);
    return newName;
}

function getAllUsers() {
    let allUsers = [];
    for (let [key, value] of Object.entries(socketMaps)) {
        allUsers.push({
            id: key,
            ...value
        })
    }
    return allUsers;
}