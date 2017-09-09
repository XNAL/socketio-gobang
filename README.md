## 前言

公司开发微信小程序的项目中需要用的socket.io，所以自己先写个简单的项目来练练手，熟悉下socket.io。socket.io主要用于浏览器和服务器之间的实时通信。对HTML5中websocket进行了封装。具体的就不多说，有兴趣的话可以去[官网](https://socket.io/)看下。

## 技术栈

node.js + socket.io + js + canvas

## 源码地址

[https://github.com/XNAL/socketio-gobang](https://github.com/XNAL/socketio-gobang)

## 项目运行
    
    git clone https://github.com/XNAL/socketio-gobang
    cd socketio-gobang
    npm install
    
    node socketServer
    
    使用浏览器打开/public下的index.html文件即可
    
## 说明

1. 此项目只是简单的实现了对战的功能，项目的页面效果写的也比较水（也就能看...），此次项目的重点也不在于页面的效果。

2. 需要同时至少运行两个页面才可以开始游戏，有兴趣的可以自己做下人机对战的功能。 

## 项目截图

<img src="https://github.com/XNAL/socketio-gobang/blob/master/screenshorts/gobang.png"/>


