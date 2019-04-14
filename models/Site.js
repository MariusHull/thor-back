var mongoose = require("mongoose");

var SiteSchema = new mongoose.Schema({
  siteName: String,
  siteUrl: String,
  status: Boolean,
  data: [{ date: String, message: String }]
});

module.exports = mongoose.model("Site", SiteSchema);
