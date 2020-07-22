const socket = require('socket.io-client')('http://localhost:3000');

socket.on("connect", () => {
  console.log("Connected");
});

socket.on('test', (data) => console.log(data))

socket.on("close", () => {
  console.log("Closed");
})
