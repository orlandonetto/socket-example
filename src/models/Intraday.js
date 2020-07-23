const {mongoose} = require("../config/index");

const IntradaySchema = mongoose.Schema({
  symbol: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
  open: {
    type: Number,
    required: true,
    // validate: [(value) => value > 0, 'this value is invalid']
  },
  high: {
    type: Number,
    required: true,
    // validate: [(value) => value > 0, 'this value is invalid']
  },
  low: {
    type: Number,
    required: true,
    // validate: [(value) => value > 0, 'this value is invalid']
  },
  close: {
    type: Number,
    required: true,
    // validate: [(value) => value > 0, 'this value is invalid']
  },
  bidPrice: {
    type: Number,
    required: true
  },
  askPrice: {
    type: Number,
    required: true
  },
  volume: {
    type: Number,
  },
  percentage: {
    type: Number
  },
}, {versionKey: false});

IntradaySchema.index({symbol: "text"});
IntradaySchema.index({symbol: 1, date: 1}, {unique: true});

module.exports = mongoose.model("Intraday", IntradaySchema);
