const http = require('http').createServer();
const socket = require('socket.io')(http);

const connected = [];

socket.on("connection", client => {
  console.log("Connected");
  connected.push(client);

  client.on("disconnect", () => {
    console.log("Disconnected");
    connected.splice(connected.indexOf(client), 1);
  });
});



http.listen(3000, () => console.log("server started, listening *:3000"));
