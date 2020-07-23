const mongoose = require('mongoose');

const {
  MONGODB_URL = "mongodb://localhost:27017/brava500?replicaSet=rs0",
  SERVER_HOST = "localhost",
  SERVER_PORT = "3000",
} = process.env;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}, (err) => {
  if (err) {
    console.log(`[SERVER_ERROR] MongoDB Connection:`, err);
    process.exit(1);
  }
});

module.exports = {
  mongoose,
  MONGODB_URL,
  SERVER_HOST,
  SERVER_PORT,
}
