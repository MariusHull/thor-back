var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Site = require("../models/Site.js");
var axios = require("axios");

/* GET ALL SITES */
router.get("/", function(req, res, next) {
  Site.find(function(err, sites) {
    if (err) return next(err);
    sites.forEach(site => {
      getInterval(site);
      site.save();
    });
    res.json(sites);
  });
});

/* GET SINGLE SITE BY ID */
router.get("/:id", function(req, res, next) {
  Site.findById(req.params.id, function(err, site) {
    if (err) return next(err);
    getInterval(site);
    site.save();
    res.json(site);
  });
});

/* PINGS SINGLE SITE BY ID */
router.get("/ping/:id", async function(req, res, next) {
  const site = await Site.findById(req.params.id);
  if (!site) next("Gna");
  await ping(site);
  res.json(site);
});

/* PINGS ALL SITES */
router.get("/pingall/", function(req, res, next) {
  Site.find(function(err, sites) {
    if (err) return next(err);
    sites.forEach(async site => await ping(site));
    res.json(sites);
  });
});

/* SAVE SITE */
router.post("/create/", function(req, res, next) {
  Site.create(
    {
      siteName: req.body.siteName,
      siteUrl: req.body.siteUrl,
      siteDesc: req.body.siteDesc,
      status: true,
      latest: parseDate(new Date()),
      timeToPing: "∞",
      data: []
    },
    function(err, post) {
      if (err) return next(err);
      res.json(post);
    }
  );
});

/* UPDATE SITE */
router.put("/:id", function(req, res, next) {
  Site.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE SITE */
router.delete("/:id", function(req, res, next) {
  Site.findByIdAndRemove(req.params.id, req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

function ping(site) {
  axios
    .get(site.siteUrl)
    .then(res => {
      let newdate = parseDate(new Date());
      site.data.push({
        date: formatDate(newdate),
        message: `Back-end up and running!`,
        up: true
      });
      site.latestResp = res.data;
      site.status = true;
      site.latest = newdate;
      getInterval(site);
      site.save();
    })
    .catch(error => {
      let newdate = parseDate(new Date());
      site.latestResp = error;
      site.data.push({
        date: formatDate(newdate),
        message: `${error}`,
        up: false
      });
      site.status = false;
      site.latest = newdate;
      getInterval(site);
      site.save();
    });
}

// Takes a Date() oject, returns following table : [min, hour, day, month, year]
function parseDate(date) {
  let dateArray = [];
  dateArray.push(date.getMinutes());
  dateArray.push(date.getHours());
  dateArray.push(date.getDate());
  dateArray.push(date.getMonth() + 1);
  dateArray.push(date.getFullYear());
  return dateArray;
}

function formatDate(dateArray) {
  let formattedDate = "";
  formattedDate += `${dateArray[1]}h${dateArray[0]}min - ${dateArray[2]}/${
    dateArray[3]
  }/${dateArray[4]}`;
  return formattedDate;
}

function getInterval(site) {
  const newDate = parseDate(new Date());
  let timeInterval = "";
  const older = site.latest;
  if (older.length === 0) {
    return 0;
  }
  if (older[3] !== newDate[3]) {
    timeInterval = `${newDate[3] - older[3]} month(s)`;
  } else {
    if (older[2] !== newDate[2]) {
      timeInterval = `${newDate[2] - older[2]} day(s)`;
    } else {
      if (older[1] !== newDate[1]) {
        timeInterval = `${newDate[1] - older[1]} hour(s)`;
      } else {
        if (older[0] !== newDate[0]) {
          timeInterval = `${newDate[0] - older[0]} minutes(s)`;
        } else {
          timeInterval = "0 minutes";
        }
      }
    }
  }
  site.timeToPing = timeInterval;
}

module.exports = router;
