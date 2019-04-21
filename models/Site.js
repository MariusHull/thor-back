var mongoose = require("mongoose");

var SiteSchema = new mongoose.Schema({
  siteName: String,
  siteUrl: String,
  siteDesc: String,
  status: Boolean,
  latest: [Number],
  timeToPing: String,
  data: [{ date: String, message: String, up: Boolean }]
});

module.exports = mongoose.model("Site", SiteSchema);
