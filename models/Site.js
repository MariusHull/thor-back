var mongoose = require("mongoose");

var SiteSchema = new mongoose.Schema({
  siteName: String,
  siteUrl: String
});

module.exports = mongoose.model("Site", SiteSchema);
