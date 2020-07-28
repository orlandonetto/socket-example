require('./src/config');

const moment = require('moment');
const _ = require("lodash");

const http = require('http').createServer();
const socket = require('socket.io')(http);

socket.on("connection", client => {
  console.log("Connected");

  client.on('subscribe', room => {
    client.join(room);
  });

  client.on('unsubscribe', room => {
    client.leave(room);
  });

  client.on("disconnect", () => {
    console.log("Disconnected");
  });
});

const Intraday = require('./src/models/Intraday');

Intraday.watch().on("change", async ({documentKey}) => {
  const doc = await Intraday.findById(documentKey, {_id: 0});

  const room = doc.symbol;
  socket.to(room).emit('message', doc);

  // send by intervals
  sendByInterval(doc);
});

function sendByInterval(doc) {
  // Interval 3M
  buildByInterval(doc, 3);

  // Interval 5M
  buildByInterval(doc, 5);

  // Interval 10M
  buildByInterval(doc, 15);

  // Interval 30M
  buildByInterval(doc, 30);

  // Interval 45M
  buildByInterval(doc, 45);

  // Interval 60M
  buildByInterval(doc, 60);
}

async function buildByInterval(doc, interval = 1) {
  // Room. Ex: BTC.5M
  const room = `${doc.symbol}.${interval}M`

  const date = moment(doc.date).toDate();

  const initialMinuteValue = getInitialMinute(date.getMinutes(), interval)
  const initialDate = moment(date).subtract(date.getMinutes() - initialMinuteValue, "minutes").toDate();

  const documents = await Intraday.find({
    symbol: doc.symbol,
    date: {
      $gte: initialDate,
      $lte: date
    }
  }).sort({date: 1});

  const intraday = buildIntraday(documents);

  socket.to(room).emit("message", intraday);
}

function getInitialMinute(currentMinute = 0, interval = 1) {
  currentMinute = Number(currentMinute);
  interval = Number(interval);

  if (currentMinute % interval === 0)
    return currentMinute;

  // Recursive
  return getInitialMinute(currentMinute - 1, interval);
}

function buildIntraday(documents) {
  const initial = documents[0];
  const current = documents[documents.length - 1];
  const closeValues = documents.map(e => e.close);

  return {
    date: initial.date,
    symbol: initial.symbol,
    bidPrice: current.bidPrice,
    askPrice: current.askPrice,
    open: initial.close,
    high: _.max(closeValues),
    low: _.min(closeValues),
    close: current.close,
    percentage: current.percentage,
  }
}

http.listen(3000, () => console.log("server started, listening *:3000"));
