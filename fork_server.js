var process = require('process');

var io = require('socket.io')();

var num = 0;

var redis = require('redis');
var redisClient = redis.createClient;
// var adapter = require('socket.io-redis');
var pub = redisClient(6379, '127.0.0.1');
var sub = redisClient(6379, '127.0.0.1');
// io.adapter(adapter({ pubClient: pub, subClient: sub }));

var roomSet = {};

//获取父进程传递端口
var port = parseInt(process.argv[2]);
// var roomid = null;

io.on('connection', function(socket) {

	//客户端请求ws URL:  http://127.0.0.1:6001?roomid=k12_webcourse_room_1
	var roomid = socket.handshake.query.roomid;

	// console.log(socket.handshake.query.roomid);

	console.log('worker pid: ' + process.pid  + ' join roomid: '+ roomid);


	socket.join(roomid);    //加入房间

	if(!roomSet[roomid]){
		console.log('sub channel ' + roomid);
    	sub.subscribe(roomid);
	}
	roomSet[roomid] || (roomSet[roomid] = []);
   	roomSet[roomid].push(socket.id);

	reportConnect();

	console.log(roomSet);

    // socket.emit('message',{ data: 'message' })
    
	socket.on('disconnect', function() {
		num--;
		console.log('worker pid: ' + process.pid + ' clien disconnection num:' + num);
		process.send({
			cmd: 'client disconnect'
		});

		// 从房间名单中移除
	    var index = roomSet[roomid].indexOf(socket.id);
	    if (index !== -1) {
	      roomSet[roomid].splice(index, 1);
	    }

	    socket.leave(roomid);    // 退出房间
	    io.to(roomid).emit('message', {data: socket.id + '退出了房间' + roomid});
    	console.log(socket.id  + '退出了' + roomid);
    	console.log(roomSet);
	});
});

/**
 * 订阅redis 回调
 * @param  {[type]} channel [频道]
 * @param  {[type]} count   [数量]  
 * @return {[type]}         [description]
 */
sub.on("subscribe", function (channel, count) {
    console.log('worker pid: ' + process.pid + ' subscribe: ' + channel);
});

/**
 * [description]
 * @param  {[type]} channel  [description]
 * @param  {[type]} message
 * @return {[type]}          [description]
 */
sub.on("message", function (channel, message) {
    console.log("message channel " + channel + ": " + message);
    io.to(channel).emit('message',{ data: message });
    //io.sockets.emit('message', { data: message })
});

/**
 * 上报连接到master进程 
 * @return {[type]} [description]
 */
var reportConnect = function(){
	num++;
	console.log('worker pid: ' + process.pid + ' client connect connection num:' + num);
	process.send({
		cmd: 'client connect'
	});
};


io.listen(port);

console.log('worker pid: ' + process.pid + ' listen port:' + port);