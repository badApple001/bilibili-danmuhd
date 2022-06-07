const net = require("net");

function getBytesLength (str) {
    var num = str.length; //先用num保存一下字符串的长度（可以理解为：先假设每个字符都只占用一个字节）
    for (var i = 0; i < str.length; i++) { //遍历字符串
        if (str.charCodeAt(i) > 255) { //判断某个字符是否占用两个字节，如果是，num再+1
            num++;
        }
    }
    return num; //返回最终的num，既是字符串总的字节长度
}

class datapipe {

    //事件注册
    constructor() {
        const self = this;
        /**
         * @type {net.Socket[]}
         */
        self.clients = [];
        //this.cmdHandler["ONLINE_RANK_V2"] = this.top;

        //实例化一个服务器对象
        const server = new net.Server();
        //设置最大连接数量
        server.maxConnections = 1000;
        //监听connection事件
        server.on('connection', async function (socket) {
            console.log('有新的客户端接入');
            self.clients.push(socket);
            server.getConnections(async function (err, count) {
                console.log(`当前连接的客户端个数为：${ count }|${ server.maxConnections }`);
            });
            //监听data事件
            socket.on("data", async function (data) {
                self.receive(socket, data);
            });
            socket.on("close", async function () {
                let index = self.clients.indexOf(socket);
                if (index != -1) {
                    self.clients.splice(index, 1);
                    server.getConnections(async function (err, count) {
                        console.log(`当前连接的客户端个数为：${ count }|${ server.maxConnections }`);
                    });
                }
            });
            socket.on("error", async function (err) {
                let index = self.clients.indexOf(socket);
                if (index != -1) {
                    self.clients.splice(index, 1);
                    server.getConnections(async function (err, count) {
                        console.log(`当前连接的客户端个数为：${ count }|${ server.maxConnections }`);
                    });
                }
            });
        });
        //设置监听端口
        server.listen(5566, "0.0.0.0", async function () {
            console.log("服务正在监听中。。。")
        });
        //设置监听时的回调函数
        server.on('listening', async function () {
            //获取地址信息
            let address = server.address();
            //获取地址详细信息
            console.log("服务器监听的端口是：" + address.port);
            console.log("服务器监听的地址是：" + address.address);
            console.log("服务器监听的地址类型是：" + address.family);
        });
        //设置关闭时的回调函数
        server.on('close', async function () {
            console.log('服务已关闭');
        });
        //设置出错时的回调函数
        server.on('error', async function (err) {
            console.log('服务运行异常', err);
        });
    }

    //房间人气发生变化
    top (room_popularity) {

    }

    //游戏弹幕
    danmaku (data) {

        let len = getBytesLength(data);
        console.log(">>>>>>>>>>>>>> receive danmaku: " + len + "bytes");
        this.pub(data);

        // switch (data.cmd) {

        //     //观看人数变化
        //     case "WATCHED_CHANGE":
        //         //{"cmd":"WATCHED_CHANGE","data":{"num":2481,"text_small":"2481","text_large":"2481人看过"}}
        //         // this.pub("WATCHED_CHANGE", data);
        //         break;
        //     //在线
        //     case "ONLINE_RANK_V2":
        //         //{"cmd":"ONLINE_RANK_V2","data":{"list":[{"uid":1035106537,"face":"http://i1.hdslb.com/bfs/face/c8aafe84f8ebdfcb5c72a0665920c2555f7420fd.jpg","score":"290","uname":"蜡笔小鑫cy","rank":1,"guard_level":0},{"uid":1279208711,"face":"http://i2.hdslb.com/bfs/face/d1fcb6df9b226009b8ed4f3ef429d0221826decd.jpg","score":"257","uname":"风中追风大傻X","rank":2,"guard_level":0},{"uid":1517184262,"face":"http://i1.hdslb.com/bfs/face/c41ebeb15eae06d8077d941484263fabb17e1e4e.jpg","score":"216","uname":"bili_38204078821","rank":3,"guard_level":0},{"uid":161295539,"face":"http://i2.hdslb.com/bfs/face/f8cdfc771d0ea69617c88109bb9b509e83967b83.jpg","score":"5","uname":"社会褀","rank":4,"guard_level":0},{"uid":34632002,"face":"http://i0.hdslb.com/bfs/baselabs/1f6a9da07a70a491d0147ff94ab6b4515bc0ba06.jpg","score":"3","uname":"速溶鸡精","rank":5,"guard_level":0},{"uid":479249239,"face":"http://i1.hdslb.com/bfs/face/61778d9a7738af046c30e03e3193d51e918c3985.jpg","score":"3","uname":"慕青泽恩","rank":6,"guard_level":0},{"uid":522560310,"face":"http://i0.hdslb.com/bfs/face/member/noface.jpg","score":"2","uname":"bili_72338258497","rank":7,"guard_level":0}],"rank_type":"gold-rank"}}
        //         // this.pub("ONLINE_RANK_V2", data);
        //         break;
        //     //在线排行数量
        //     case "ONLINE_RANK_COUNT":
        //         //{"cmd":"ONLINE_RANK_COUNT","data":{"count":11}}

        //         break;
        //     //弹幕消息
        //     case "DANMU_MSG":
        //         //{"cmd":"DANMU_MSG","info":[[0,1,25,16777215,1654587468536,1654587061,0,"6f369e99",0,0,0,"",0,"{}","{}",{"mode":0,"show_player_type":0,"extra":"{\"send_from_me\":false,\"mode\":0,\"color\":16777215,\"dm_type\":0,\"font_size\":25,\"player_mode\":1,\"show_player_type\":0,\"content\":\"三体\",\"user_hash\":\"1865850521\",\"emoticon_unique\":\"\",\"bulge_display\":0,\"recommend_score\":10,\"main_state_dm_color\":\"\",\"objective_state_dm_color\":\"\",\"direction\":0,\"pk_direction\":0,\"quartet_direction\":0,\"yeah_space_type\":\"\",\"yeah_space_url\":\"\",\"jump_to_url\":\"\",\"space_type\":\"\",\"space_url\":\"\"}"}],"三体",[34632002,"速溶鸡精",0,0,0,10000,1,""],[2,"C酱","C酱です",47867,6067854,"",0,12632256,12632256,12632256,0,0,67141],[20,0,6406234,"\u003e50000",0],["",""],0,0,null,{"ts":1654587468,"ct":"59E23156"},0,0,null,null,0,14]}
        //         break;
        //     case "INTERACT_WORD":
        //         //{"cmd":"INTERACT_WORD","data":{"contribution":{"grade":0},"dmscore":4,"fans_medal":{"anchor_roomid":24656761,"guard_level":0,"icon_id":0,"is_lighted":1,"medal_color":6067854,"medal_color_border":6067854,"medal_color_end":6067854,"medal_color_start":6067854,"medal_level":2,"medal_name":"百科书","score":442,"special":"","target_id":122923414},"identities":[3,1],"is_spread":0,"msg_type":1,"roomid":25095499,"score":1654597911251,"spread_desc":"","spread_info":"","tail_icon":0,"timestamp":1654587469,"trigger_time":1654587468193862000,"uid":209762138,"uname":"黑泽臣","uname_color":""}}

        //         break;
        //     case "STOP_LIVE_ROOM_LIST":
        //         //{"cmd":"STOP_LIVE_ROOM_LIST","data":{"room_id_list":[11434704,1619130,22891616,2454534,21724210,22797533,23609830,23675477,24145373,24792621,25151706,24018596,24618405,25074953,25191259,23682618,23869050,25185730,25188751,208871,22633942,24221073,24600707,24926607,25169201,23954164,24347631,7721222,25183972,25191280,24022321,23545706,25038497,25186772,7598665,25110352,13291021,22010972,23837410,24153261,4516808,1449846,25191274,11161409,11357785,12966912,21677533,22495584,2725947,25191229,23757503,23858392,24025713,22564521,23745870,25183134,7543374,9501940,22718437,25191258,1109331,22520314,413964,4990497,23691372]}}
        //         break;
        // }

    }


    //客户端消息
    receive (s, data) {
        console.log("接收到数据: " + data.toString());

    }

    /**
     * 发送给所有客户端
     * @param {string} msg 
     */
    pub (msg) {
        if (this.clients.length > 0) {
            for (let c of this.clients) {
                c._handle && c.write(msg);
            }
            console.log(">>>>>>>>>>>>>> transmit danmaku: " + this.clients.length);
        }
    }
}
module.exports = datapipe;