require('./src/config');

const http = require('http').createServer();
const socket = require('socket.io')(http);

socket.on("connection", client => {
  console.log("Connected");

  client.on('subscribe', room => {
    client.join(room);
  });

  client.on('unsubscribe', room => {
    client.leave(room);
  })

  client.on("disconnect", () => {
    console.log("Disconnected");
  });
});

const Intraday = require('./src/models/Intraday');

Intraday.watch().on("change", async ({documentKey}) => {
  const doc = await Intraday.findById(documentKey);

  const room = doc.symbol;
  socket.to(room).emit('message', doc);
});

http.listen(3000, () => console.log("server started, listening *:3000"));
