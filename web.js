
const URL = "https://cloud-run-hackathon-nodejs-zzovtf46pq-uc.a.run.app"

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const { match } = require('assert');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!');
});
var isShot = true
var last = 0
var stack = []

app.post('/', function (req, res) {
    const moves = ['R', 'L','R', 'R','R', 'R','L', 'L','R', 'L'];
  console.log(JSON.stringify(req.body));
  let closeToMe = [100,100]
  let score = 100
  const  me = req.body.arena.state[URL]
  delete req.body.arena.state[URL]
  const players = Object.values(req.body.arena.state)
  players.forEach(player => {
      const possibleX = me.x - player.x
      const possibleY = me.y - player.y
      if ((Math.abs(possibleX) + Math.abs(possibleY)) < score) {
        closeToMe[0] = possibleX
        closeToMe[1] = possibleY
        score = (Math.abs(possibleX) + Math.abs(possibleY))
      }
  })
  if (me.wasHit && isShot === false) {
    isShot = true
  }
  if (isShot && last <=2) {
      if (last === 0){
        last += 1
        res.send(moves[Math.floor(Math.random() * moves.length)])
      }
        
      if (last <= 2){
        last += 1
        res.send('F')
      }
      last += 1
      if (last >=3){
        isShot = false 
        last = 0
      }
      
  }
  console.log('result', shotOrGo(me, closeToMe), closeToMe, me)
  stack.push(shotOrGo(me, closeToMe))
  if (stack.length > 50) {
    stack = []
    res.send(moves[Math.floor(Math.random() * moves.length)])
  }
  res.send(shotOrGo(me, closeToMe));
});

const moves2 = ['R','F', 'F','F','F', 'L','F'];

function shotOrGo(me,closeToMe) {
    if (closeToMe[0] > closeToMe[1]) {
        if (closeToMe[0] > 0) { //1
            if (me.direction === 'W' && Math.abs(closeToMe[0]) < 3  &&  Math.abs(closeToMe[1]) === 0) {
                return 'T'
            } else if(me.direction ==='S') {
                return 'R'
            } else if (me.direction ==='N' || me.direction ==='E') {
                return 'L'
            }
        } else { //2
            if (me.direction === 'E' && Math.abs(closeToMe[0]) < 3  &&  Math.abs(closeToMe[1]) === 0) {
                return 'T'
            } else if(me.direction ==='S') {
                return 'L'
            } else if (me.direction ==='N' || me.direction ==='W') {
                return 'R'
            }
        }
        
    } else {
        if (closeToMe[1] > 0) { //3
            if (me.direction === 'N' && Math.abs(closeToMe[1]) < 3 &&  Math.abs(closeToMe[0]) === 0) {
                return 'T'
            } else if(me.direction ==='E') {
                return 'L'
            } else if (me.direction ==='S' || me.direction ==='W') {
                return 'R'
            }
        } else { //4
            if (me.direction === 'S' && Math.abs(closeToMe[1]) < 3  &&  Math.abs(closeToMe[0]) === 0) {
                return 'T'
            } else if(me.direction ==='E') {
                return 'R'
            } else if (me.direction ==='N' || me.direction ==='W') {
                return 'L'
            }
        }
    }

    return moves[Math.floor(Math.random() * moves.length)]
    
}

app.listen(process.env.PORT || 8080);
