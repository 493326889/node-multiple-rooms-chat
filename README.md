# node-multiple-rooms-chat
node socket.io multiple room chat demo

#### node、socket.io、redis搭建的基于多机多进程的消息即时IM系统。

#### nginx配置：    
在http下新增upstream配置ip_hash，如果多机，则添加多个替换下面ip地址即可。然后配置server里的location规则。nginx须>1.3才可支持websocket。
````
upstream io_nodes {
  ip_hash;
  server 127.0.0.1:6001;
  server 127.0.0.1:6002;
  server 127.0.0.1:6003;
  server 127.0.0.1:6004;
  server 127.0.0.1:6005;
  server 127.0.0.1:6006;
  server 127.0.0.1:6007;
  server 127.0.0.1:6008;
}
server {
  listen 3000;
  server_name io.yourhost.com;
  location / {
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
    proxy_http_version 1.1;
    proxy_pass http://io_nodes;
  }
}
````   
#### 安装redis
https://redis.io/download 下载后，安装并启动本地redis服务，默认监听6379端口。    

#### 启动服务:

````
node cluster 
````  

以上命令启动master进程并监听6001-600n端口，根据cpu核数而定。     


#### 访问index.html    
输入参数，并建立websocket连接。
