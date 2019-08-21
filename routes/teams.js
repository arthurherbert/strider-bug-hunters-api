var express = require("express");
var router = express.Router();
var db = require("../service");

/* GET all events. */
router.get("/", async function(req, res, next) {
  const teamsRef = await db.collection("teams").get();
  const teams = [];
  for (teamRef of teamsRef.docs) {
    const team = teamRef.data();
    teams.push({ id: teamRef.id, ...team });
  }
  res.send(teams);
});

router.post("/", async function(req, res, next) {
  try {
    const teamsRef = db.collection("teams");
    teamsRef.add(req.body).then(newTeam => {
      res.send(`Added team with id: ${newTeam.id}`);
    });
  } catch (err) {
    res.send(`Couldn't add team ${err}`);
  }
});

module.exports = router;
