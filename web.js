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
const maxDistinct = 2
var hitCount = 0


app.post('/', function (req, res) {
    const moves = ['R', 'L','R', 'R','F', 'R','L', 'F','R', 'L'];
  
  const URL = `https://${req.hostname}`
  console.log('URL', URL)
  console.log(JSON.stringify(req.body));
  let closeToMe = [100,100]
  let score = 100
  const  me = req.body.arena.state[URL] || req.body.arena.state[`${URL}/`]
  delete req.body.arena.state[URL]
  delete req.body.arena.state[`${URL}/`]
  const players = Object.values(req.body.arena.state)
  console.log(JSON.stringify(me))
  const filteredPlayers = players.filter(filterForSameRow(me)).map(thePlayerDirection(me)).sort((a,b) => a.distinct< b.distinct)
  console.log('filteredPlayers', JSON.stringify(filteredPlayers))
  if (filteredPlayers.length === 0) {
    return res.send('T')
  }
  actionToTake(me, filteredPlayers, res)
  
});

// try to find out is the player on my left/right/behind
function thePlayerDirection(me) {
  return (player) => {
   if (me.direction === 'N') {
     if (player.y === me.y){
        player.position = 1 
        player.on = (player.x > me.x) ? 'r' : 'l'
        player.distinct = Math.abs(player.x - me.x)
      } else {
        if(player.y < me.y) {
          player.position =0
        } else {
          player.position = 2
        }
        player.distinct = Math.abs(player.y - me.y)
      }
  
    } else if (me.direction === 'E') {
      if (player.x === me.x){
        player.position = 1
        player.on = (player.y > me.y) ? 'r' : 'l'
        player.distinct = Math.abs(player.y - me.y)
      } else {
        if(player.x > me.x) {
          player.position =0
        } else {
          player.position = 2
        }
        player.distinct = Math.abs(player.x - me.x)
      }
    } else if (me.direction === 'W') {
      if (player.x === me.x){
        player.position = 1
        player.on = (player.y > me.y) ? 'l' : 'r'
        player.distinct = Math.abs(player.y - me.y)
        
      } else {
        if(player.x < me.x) {
          player.position =0
        } else {
          player.position = 2
        }
        player.distinct = Math.abs(player.x - me.x)
      }
    } else {
      if (player.y === me.y){
        player.position = 1 
         player.on = (player.x > me.x) ? 'l' : 'r'
         player.distinct = Math.abs(player.x - me.x)
      } else {
        if(player.y > me.y) {
          player.position =0
        } else {
          player.position = 2
        }
        player.distinct = Math.abs(player.y - me.y)
      }
    }
    player.noOfStep = player.position + Math.abs(player.distinct - maxDistinct, 0)
    return player;
  }
}

function actionToTake(me, players, res) {
  if (me.wasHit) {
    let i = 0
    if (players[i].position === 0) {
      if (players[i+1].on == 'l' && players[i+1].distinct > 2) {
        console.log('Hit with L')
        return res.send('L')
      } else {
        console.log('Hit with R')
        return res.send('R')
      }
    } else {
      console.log('Hit with F')
      return res.send('F')
    }
  } else {
    const targetPlayer = players.sort((a,b) => {
      return a.noOfStep - b.noOfStep
    })[0]
    console.log('targetPlayer', targetPlayer)
    if (!targetPlayer){
      return res.send('T') 
    }
    if (targetPlayer.position === 0) {
      if (targetPlayer.distinct < 3) {
        return res.send('T')
      }
      return res.send('F')
    }
    if (targetPlayer.on ='l') {
      return res.send('L')
    } 
    if (targetPlayer.on ='r') {
      return res.send('R')
    }
    
  }
   return res.send('T')
}


function filterForSameRow(me){ 
  return (player) => {
    if (me.x === player.x || me.y === player.y){
      return true
    }
    return false
  }
}


app.listen(process.env.PORT || 8080);
