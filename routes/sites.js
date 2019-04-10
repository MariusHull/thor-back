var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Site = require("../models/Site.js");

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

/* SAVE SITE */
router.post("/", function(req, res, next) {
  Site.create(req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
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
