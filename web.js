
const URL = "https://cloud-run-hackathon-nodejs-zzovtf46pq-uc.a.run.app"

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const { match } = require('assert');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!');
});

app.post('/', function (req, res) {
    const moves = ['F', 'R', 'L', 'T'];
  console.log(JSON.stringify(req.body));
  let closeToMe = [100,100]
  const  me = req.body.arena.state[URL]
  delete req.body.arena.state[URL]
  const players = Object.values(req.body.arena.state)
  players.forEach(player => {
      const possibleX = me.x - player.x
      const possibleY = me.y - player.y
      if (Math.abs(possibleX) < Math.abs(closeToMe[0])|| Math.abs(possibleY) < Math.abs(closeToMe[1])) {
        closeToMe[0] = possibleX
        closeToMe[1] = possibleY
      }
  })
  console.log('result', shotOrGo(me, closeToMe), closeToMe, me)
  res.send(shotOrGo(me, closeToMe));
});

function shotOrGo(me,closeToMe) {
    if (closeToMe[0] > closeToMe[1]) {
        // move to close one like Y
        if (closeToMe[0] === 1) { //1
            if (me.direction === 'W' && Math.abs(closeToMe[1]) < 3) {
                return 'T'
            } else if(me.direction ==='S') {
                return 'R'
            } else if (me.direction ==='N' || me.direction ==='E') {
                return 'L'
            }
        } else { //2
            if (me.direction === 'E' && Math.abs(closeToMe[1]) < 3) {
                return 'T'
            } else if(me.direction ==='S') {
                return 'R'
            } else if (me.direction ==='N' || me.direction ==='W') {
                return 'L'
            }
        }
        
    } else {
        if (closeToMe[1] === 1) { //3
            if (me.direction === 'S' && Math.abs(closeToMe[0]) < 3) {
                return 'T'
            } else if(me.direction ==='E') {
                return 'R'
            } else if (me.direction ==='N' || me.direction ==='W') {
                return 'L'
            }
        } else { //4
            if (me.direction === 'N' && Math.abs(closeToMe[0]) < 3) {
                return 'T'
            } else if(me.direction ==='E') {
                return 'L'
            } else if (me.direction ==='S' || me.direction ==='W') {
                return 'R'
            }
        }
    }

    return 'F'
    
}

app.listen(process.env.PORT || 8080);
