const socket = require('socket.io-client')('http://localhost:3000');

socket.on("connect", () => {
  console.log("Connected");
});

socket.emit('subscribe', 'BTC');

socket.on('message', (data) => console.log(data))

socket.on("close", () => {
  console.log("Closed");
})
