const datapipe = require('./datapipe');
const BilibiliSocket = require("./bilibili-socket")

!function () {
    //房间号
    let bilibiliClient = new BilibiliSocket(592067);
    //端口
    let pipe = new datapipe(10086);

    //协议监听
    bilibiliClient.onOpen = async function () {
        console.log(">>>>>>>>>>>>>> link room success!!!");
        console.log(">>>>>>>>>>>>>> start to receive danmaku!!!  roomid: " + bilibiliClient.roomId);
    };
    bilibiliClient.onClose = async function (e) {
        console.log(">>>>>>>>>>>>>> broken link...");
    }
    bilibiliClient.onError = async function (e) {
        console.log(`>>>>>>>>>>>>>> unknown error: \n${ e.message }`);
    }
    bilibiliClient.onPopularityChange = async function (value) {
        pipe.top(value);
    }
    bilibiliClient.onMessage = async function (msg) {
        pipe.danmaku(msg);
    }
    bilibiliClient.connect();
}();