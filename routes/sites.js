var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Site = require("../models/Site.js");
var axios = require("axios");

/* GET ALL SITES */
router.get("/", function(req, res, next) {
  Site.find(function(err, sites) {
    if (err) return next(err);
    res.json(sites);
  });
});

/* GET SINGLE SITE BY ID */
router.get("/:id", function(req, res, next) {
  Site.findById(req.params.id, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PINGS SINGLE SITE BY ID */
router.get("/ping/:id", function(req, res, next) {
  Site.findById(req.params.id, function(err, site) {
    if (err) return next(err);
    axios
      .get(adress)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        site.data.push({
          date: new Date().toString(),
          message: `${error}`
        });
        site.status = false;
        site.save();
        /*
        if (error.response) {
          console.log(error.response.status);
        }*/
      });

    res.json(site);
  });
});

/* SAVE SITE */
router.post("/create/", function(req, res, next) {
  Site.create(
    {
      siteName: req.body.siteName,
      siteUrl: req.body.siteUrl,
      status: true,
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

module.exports = router;
