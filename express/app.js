var createError = require("http-errors");
var express = require("express");
const serverless = require("serverless-http");
var path = require("path");
var cookieParser = require("cookie-parser");

var indexRouter = require("./routes/index");
var teamsRouter = require("./routes/teams");
var eventsRouter = require("./routes/events");

var app = express();

app.set("view engine", "html");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.use("/.netlify/functions/app", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
