const functions = require('firebase-functions');
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
var firebase = require("firebase/app");
var firebaseConfig = {
  apiKey: "AIzaSyA2fFvZfjVLweMg_NZnnGcS03L_oSi04r0",
  authDomain: "strider-bug-hunters.firebaseapp.com",
  databaseURL: "https://strider-bug-hunters.firebaseio.com",
  projectId: "strider-bug-hunters",
  storageBucket: "strider-bug-hunters.appspot.com",
  messagingSenderId: "114071764524",
  appId: "1:114071764524:web:25cc39625ad275b1"
};
firebase.initializeApp(firebaseConfig);
require("firebase/firestore");

const db = firebase.firestore(firebase.app());

var router = express.Router();
app.use(cors({origin:true}));
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
    events.push({
      id: eventRef.id,
      ...event
    });
  }
  res.send(events);
});

router.post("/events", async function(req, res, next) {
  try {
    const eventsRef = db.collection("events");
    eventsRef
      .add(
        { 
          ...req.body,
          team: {
            id: req.body.team_id,
            name: req.body.team_name
          },
          created_at: firebase.firestore.Timestamp.fromDate(new Date(req.body.created_at * 1000)) 
        }
      )
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

exports.app = functions.https.onRequest(app)
