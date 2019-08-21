const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("../service");

var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.send("🐛 Strider Task: BUG HUNTERS");
});

/* GET all events. */
router.get("/events", async function(req, res, next) {
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

router.post("/events", async function(req, res, next) {
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

/* GET all events. */
router.get("/teams", async function(req, res, next) {
  const teamsRef = await db.collection("teams").get();
  const teams = [];
  for (teamRef of teamsRef.docs) {
    const team = teamRef.data();
    teams.push({ id: teamRef.id, ...team });
  }
  res.send(teams);
});

router.post("/teams", async function(req, res, next) {
  try {
    const teamsRef = db.collection("teams");
    teamsRef.add(req.body).then(newTeam => {
      res.send(`Added team with id: ${newTeam.id}`);
    });
  } catch (err) {
    res.send(`Couldn't add team ${err}`);
  }
});

app.use(bodyParser.json());
app.use("/", router);

module.exports = app;
