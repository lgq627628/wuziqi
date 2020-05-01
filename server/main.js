"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = __importStar(require("ws"));
var ws = new WebSocket.Server({ port: 7777 });
ws.on('connection', function (socket, request) {
    // ws 相当于一个管理者，好比客服总经理
    // socket 相当于下属，就是每个客服
    console.log('某个客服收到了一个链接');
    socket.send('客户端你好，我是本次和你对接的客服人员');
    socket.on('message', function (data) {
        console.log(data);
    });
});
