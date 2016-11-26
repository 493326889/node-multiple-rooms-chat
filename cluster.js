var fork = require('child_process').fork;

var cupNum = require('os').cpus().length,
	workerArr = [],
	roomInfo = [];
var connectNum = 0;

for (var i = 0; i < cupNum; i++) {
	workerArr.push(fork('./fork_server.js', [6001 + i]));

	workerArr[i].on('message', function(msg) {
		if (msg.cmd && msg.cmd === 'client connect') {
			connectNum++;
			console.log('socket server connectnum:' + connectNum);
		}
		if (msg.cmd && msg.cmd === 'client disconnect') {
			connectNum--;
			console.log('socket server connectnum:' + connectNum);
		}
	});


}