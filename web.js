
const URL = "https://cloud-run-hackathon-nodejs-zzovtf46pq-uc.a.run.app"

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { match } = require('assert');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!');
});

app.post('/', function (req, res) {
    const moves = ['F', 'R', 'L', 'T'];
  console.log(JSON.stringify(req.body));
  let closeToMe = [100,100]
  const  me = req.body.arena.state[URL]
  const players = Object.values(req.body.arena.state)
  players.forEach(player => {
      const possibleX = me.x - player.x
      const possibleY = me.y - player.y
      if (match.abs(possibleX) < match.abs(closeToMe[0])) {
        closeToMe[0] = possibleX
      }
      if (match.abs(possibleY) < match.abs(closeToMe[1])) {
        closeToMe[1] = possibleY
      }
  })
  
  res.send(shotOrGo(me, closeToMe));
});

function shotOrGo(me,closeToMe) {
    if (closeToMe[0] > closeToMe[1]) {
        // move to close one like Y
        if (closeToMe[1] === 1) {
            if (me.direction === 'W') {
                return 'T'
            } else if(me.direction ==='E') {
                return 'R'
            }
            return 'L'
        } else {
            if (me.direction === 'N') {
                return 'T'
            } else if(me.direction ==='E') {
                return 'L'
            }
            return 'R'
        }
        
    } else {
        if (closeToMe[0] === 1) {
            if (me.direction === 'W') {
                return 'T'
            } else if(me.direction ==='E') {
                return 'R'
            }
            return 'L'
        } else {
            if (me.direction === 'N') {
                return 'T'
            } else if(me.direction ==='E') {
                return 'L'
            }
            return 'R'
        }
    }
    
}

app.listen(process.env.PORT || 8080);
