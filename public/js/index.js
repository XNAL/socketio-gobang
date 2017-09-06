var CHESSBOARD_WIDTH = 450; // 棋盘大小
var CHESSBOARD_GRID = 30; // 棋盘每格大小
var CHESSBOARD_MARGIN = 15; // 棋盘内边距
var chessSize = 0; // 棋盘格数
var isBlack = true; // 是否黑棋
var isGameOver = false; // 游戏是否结束
var isCanStep = false; // 是否可以下棋（对手下棋时己方不能下棋）

// 设置canvas的content的
var ctx = null;

var socket = io('http://localhost:3000');
// 棋盘坐标数组
var arrPieces = new Array();

$(document).ready(function () {
    clientSocket(socket);
    bindChangeNameClick(socket);
    bindApplyGameClick(socket);

    drawChessBoard();
    chessClick();
});

// 画出棋盘
function drawChessBoard() {
    var canvas = document.getElementById('chessboard');
    canvas.width = CHESSBOARD_WIDTH;
    canvas.height = CHESSBOARD_WIDTH;
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;
    chessSize = Math.floor(CHESSBOARD_WIDTH / CHESSBOARD_GRID);

    for (var i = 0; i < chessSize; i++) {
        ctx.strokeStyle = '#444';
        ctx.moveTo(CHESSBOARD_MARGIN + CHESSBOARD_GRID * i, CHESSBOARD_MARGIN);
        ctx.lineTo(CHESSBOARD_MARGIN + CHESSBOARD_GRID * i, CHESSBOARD_WIDTH - CHESSBOARD_MARGIN);
        ctx.stroke();
        ctx.moveTo(CHESSBOARD_MARGIN, CHESSBOARD_MARGIN + CHESSBOARD_GRID * i);
        ctx.lineTo(CHESSBOARD_WIDTH - CHESSBOARD_MARGIN, CHESSBOARD_MARGIN + CHESSBOARD_GRID * i);
        ctx.stroke();

        arrPieces[i] = new Array();
        for (var j = 0; j < chessSize; j++) {
            arrPieces[i][j] = 0;
        }
    }
}

// 画出棋子
function drawPiece(i, j) {
    // 当前游戏未结束且当前节点未落子
    if (isCanStep && !isGameOver && arrPieces[i][j] === 0) {

        // 画一个新棋子
        drawNewPiece(i, j, isBlack);

        // 落下棋子后进行检查
        doCheck(i, j, isBlack);

        // 检查是否还有空位
        checkIsExistEmpty();

        stepPiece(i, j, isGameOver);
        // 黑白棋相互交换落子
        // isBlack = !isBlack;
    }
}

function drawNewPiece(i, j, isBlack) {
    var x = CHESSBOARD_MARGIN + i * CHESSBOARD_GRID + 1;
    var y = CHESSBOARD_MARGIN + j * CHESSBOARD_GRID + 1;
    ctx.beginPath();
    ctx.arc(x, y, Math.floor(CHESSBOARD_GRID / 2) - 2, 0, Math.PI * 2, true);
    ctx.closePath();
    var grd = ctx.createRadialGradient(x, y, Math.floor(CHESSBOARD_GRID / 3), x, y, Math.floor(CHESSBOARD_GRID / 10));
    if (isBlack) {
        grd.addColorStop(0, '#0A0A0A');
        grd.addColorStop(1, '#676767');
    } else {
        grd.addColorStop(0, '#D8D8D8');
        grd.addColorStop(1, '#F9F9F9');
    }
    ctx.fillStyle = grd;
    ctx.fill();

    // 记录坐标落子情况
    arrPieces[i][j] = isBlack ? 1 : 2;
}

// 点击棋盘进行落子
function chessClick() {
    $('#chessboard').click(function (e) {
        var x = Math.floor(e.offsetX / CHESSBOARD_GRID);
        var y = Math.floor(e.offsetY / CHESSBOARD_GRID);
        drawPiece(x, y);
    })
}

// 检查棋牌中是否还存在空位
function checkIsExistEmpty() {
    var isExistEmpty = false;
    for (var i = 0; i < chessSize; i++) {
        for (var j = 0; j < chessSize; j++) {
            if (arrPieces[i][j] === 0) {
                isExistEmpty = true;
                break;
            }
        }
    }
    if (!isExistEmpty) {
        setTimeout(function () {
            alert('平局!')
        }, 0);
    }
}
// 落下棋子后检查是否赢得比赛
function doCheck(x, y) {
    horizontalCheck(x, y);
    verticalCheck(x, y);
    downObliqueCheck(x, y);
    upObliqueCheck(x, y);
}

// 游戏结束
function isOver(x, y, sum) {
    if (sum === 5) {
        isGameOver = true;
        setTimeout(function () {
            alert('Game Over!')
        }, 0);
    }
}

// 横轴方向检测
function horizontalCheck(x, y) {
    var sum = -1;

    for (var i = x; i >= 0; i--) {
        if (arrPieces[i][y] === arrPieces[x][y]) {
            sum++;
        } else {
            i = -1;
            break;
        }
    }
    for (var i = x; i < chessSize; i++) {
        if (arrPieces[i][y] === arrPieces[x][y]) {
            sum++;
        } else {
            i = chessSize;
            break;
        }
    }
    isOver(x, y, sum);
}

// 竖轴方向检测
function verticalCheck(x, y) {
    var sum = -1;

    for (var j = y; j >= 0; j--) {
        if (arrPieces[x][j] === arrPieces[x][y]) {
            sum++;
        } else {
            j = -1;
            break;
        }
    }
    for (var j = y; j < chessSize; j++) {
        if (arrPieces[x][j] === arrPieces[x][y]) {
            sum++;
        } else {
            j = chessSize;
            break;
        }
    }
    isOver(x, y, sum);
}

// 下斜方向检测
function downObliqueCheck(x, y) {
    var sum = -1;

    for (var i = x, j = y; i >= 0 && y >= 0;) {
        if (arrPieces[i][j] === arrPieces[x][y]) {
            sum++;
        } else {
            j = i = -1;
            break;
        }
        i--;
        j--;
    }
    for (var i = x, j = y; i < chessSize && j < chessSize;) {
        if (arrPieces[i][j] === arrPieces[x][y]) {
            sum++;
        } else {
            j = i = chessSize;
            break;
        }
        i++;
        j++;
    }
    isOver(x, y, sum);
}

// 上斜方向检测
function upObliqueCheck(x, y) {
    var sum = -1;

    for (var i = x, j = y; i >= 0 && j < chessSize;) {
        if (arrPieces[i][j] === arrPieces[x][y]) {
            sum++;
        } else {
            j = chessSize;
            i = -1;
            break;
        }
        i--;
        j++;
    }
    for (var i = x, j = y; i < chessSize && j >= 0;) {
        if (arrPieces[i][j] === arrPieces[x][y]) {
            sum++;
        } else {
            i = chessSize;
            j = -1;
            break;
        }
        i++;
        j--;
    }
    isOver(x, y, sum);
}

function clientSocket(socket) {
    socket.on('userName', function (name) {
        $('#my_name').val(name).attr('data-oldvalue', name);
    });

    socket.on('allUsers', function (userList) {
        console.log(userList);
        handlebarsUserList(userList, socket.id, socket);
    });

    socket.on('beginGame', function (gameInfo) {
        isCanStep = gameInfo.currentStep;
        isBlack = gameInfo.isBlack;
    });

    socket.on('competitorStep', function (info) {
        var ownInfo = info.ownInfo,
            stepInfo = info.stepInfo;

        isCanStep = ownInfo.currentStep;
        console.log('!ownInfo.isBlack', !ownInfo.isBlack, isBlack);
        drawNewPiece(stepInfo.x, stepInfo.y, !ownInfo.isBlack);
        isGameOver = stepInfo.isGameOver;
        console.log('isGameOver', isGameOver);
        if(isGameOver) {
            setTimeout(function(){
                alert('Game Over!');
            }, 0);
        }
    });
}

function bindChangeNameClick(socket) {
    $('#change_name').click(function (e) {
        var $name = $('#my_name'),
            value = $name.val();
        if (value.trim() === '') {
            alert('昵称不能为空！');
            return;
        }
        if (value !== $name.attr('data-oldvalue')) {
            socket.emit('setName', value);
        }
    });
}

function bindApplyGameClick(socket) {
    $('.user-status').click(function (e) {
        var competitorId = $(this).data('id');
        console.log('competitorId', competitorId);
        socket.emit('applyGame', competitorId);
    });
}

function handlebarsUserList(userList, ownId, socket) {
    var source = $("#user_template").html();
    var template = Handlebars.compile(source);
    var result = [];
    $.each(userList, function (index, value) {
        value.statusClass = '';
        value.statusText = '申请对战';
        if (value.competitor) {
            value.statusClass = 'gaming-status';
            value.statusText = '对战中';
        }
        if (value.competitor === ownId) {
            value.statusClass = 'gaming-current';
            value.statusText = '当前对手';
        }
        if (value.id !== ownId) {
            result.push(value);
        }
    });
    var html = template({
        userList: result
    });
    $('#user_list').html(html);
    bindApplyGameClick(socket);
}

function stepPiece(x, y, isGameOver) {
    isCanStep = false;
    socket.emit('step', {
        x: x,
        y: y,
        isGameOver: isGameOver
    });
}