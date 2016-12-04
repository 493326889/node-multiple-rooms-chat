# node-multiple-rooms-chat
node socket.io multiple room chat demo

####node、socket.io、redis搭建的基于多机多进程的消息即时IM系统。

####nginx配置：    在http下新增upstream配置ip_hash。
````
upstream io_nodes {
  ip_hash;
  server 127.0.0.1:6001;
  server 127.0.0.1:6002;
  server 127.0.0.1:6003;
  server 127.0.0.1:6004;
}
````
