var express = require("express");
var serverless = require("serverless-http");
var router = express.Router();
var db = require("../service");

/* GET all events. */
router.get("/", async function(req, res, next) {
  const eventsRef = await db.collection("events").get();
  const events = [];
  for (eventRef of eventsRef.docs) {
    const event = eventRef.data();
    const team = await event.team.get();
    events.push({
      id: eventRef.id,
      ...event,
      team: {
        id: team.id,
        ...team.data()
      }
    });
  }
  res.send(events);
});

router.post("/", async function(req, res, next) {
  try {
    const eventsRef = db.collection("events");
    eventsRef
      .add({ ...req.body, team: db.doc(`teams/${req.body.team}`) })
      .then(newEvent => {
        res.send(`Added event with id: ${newEvent.id}`);
      });
  } catch (err) {
    res.send(`Couldn't add event ${err}`);
  }
});

module.exports = router;
module.exports.handler = serverless(router);
