const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!');
});
var isShot = true
var last = 0
var stack = []
const maxDistinct = 2
var hitCount = 0
let dims = []
let idea = 0
let lastTargetPlayer = null

app.post('/', function (req, res) {
  
  
  const URL = `https://${req.hostname}`
  console.log('URL', URL)
  console.log(JSON.stringify(req.body));
  dims = req.body.arena.dims;

  const  me = req.body.arena.state[URL] || req.body.arena.state[`${URL}/`]
  delete req.body.arena.state[URL]
  delete req.body.arena.state[`${URL}/`]
  const players = Object.values(req.body.arena.state)
  console.log(JSON.stringify(me))
  const filteredPlayers = players.filter(filterForSameRow(me)).map(thePlayerDirection(me)).sort((a,b) => a.distinct- b.distinct)
  console.log('filteredPlayers', JSON.stringify(filteredPlayers))
 
  if (!actionToTake(me, filteredPlayers, res)) {
   idea++
    if (idea > 5) {
      idea = 0
      return res.send('F')
    }
    return res.send('R')
  }
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
function isBorder(me, res) {
  if (me.direction =='N') {
    // if (me.y - 1 < 0) {
    //   console.log('border move R')
    //   return res.send("R")
    // }
    // if (me.y + 1 > dims[1] - 1) {
    //   console.log('border move L')
    //   return res.send("L")
    // }
    if (me.x - 1 < 0) {
      console.log('border move R')
      return res.send("R")
    }
  }
  if (me.direction =='E') {
    // if (me.x + 1 > dims[0] - 1) {
    //   console.log('border move L')
    //   return res.send("L")
    // }
    // if (me.x - 1 < 0) {
    //   console.log('border move R')
    //   return res.send("R")
    // } 
    if (me.y + 1 > dims[1] - 1) {
        console.log('border move R')
      return res.send("R")
    }
  }
  if (me.direction =='W') {
    // if (me.x - 1 < 0) {
    //   console.log('border move L')
    //   return res.send("L")
    // }
    // if (me.x + 1 > dims[0] - 1) {
    //   console.log('border move R')
    //   return res.send("R")
    // }
    if (me.y - 1 < 0) {
        console.log('border move R')
      return res.send("R")
    }
  }
  if (me.direction =='S') {
    // if (me.y - 1 > dims[1] - 1) {
    //   console.log('border move R')
    //     return res.send("R")
    // }
    // if (me.y - 1 < 0) {
    //   console.log('border move L')
    //   return res.send("L")
    // }
    if (me.x +1 > dims[0] -1) {
        console.log('border move R')
      return res.send("R")
    }
  }
}

function actionToTake(me, players, res) {
  const moves = ['R', 'F','F', 'L','F', 'R','L', 'F','F', 'L'];
  if (me.wasHit) {
    hitCount++
    if (isBorder(me, res)) {
        return false
    }
    let maxDistinctPlayer = { distinct: 0 }
    const currentPlayer = players
    // .sort((a,b) => {
    //   return a.position - b.position || a.distinct - b.distinct
    // })
    let direction = [0, 'l', 'r', 2]
    for (let i = 0 ; i < currentPlayer.length; i++) {
        // if ( currentPlayer[i].distinct >= 2 ) {
        //   if (currentPlayer[i].on) {
        //     return res.send(currentPlayer[i].on.toUpperCase())
        //   }
        //   if (currentPlayer[i].position == 0)
        //     return res.send('F')
        //   else{
        //     return res.send('R')
        //   }
            
        // } else {
        if (maxDistinctPlayer.distinct < currentPlayer.distinct) {
            maxDistinctPlayer = currentPlayer
        }
        direction = direction.filter(item =>  item != (currentPlayer[i]?.on ?? currentPlayer[i].position))
        console.log('direction', direction)
        // }
    }
    let finalDirection = 2
    if (direction.length >= 2) {
        finalDirection = direction[Math.trunc(Math.random() * direction.length)]
    } else {
        finalDirection = maxDistinctPlayer?.on?.toUpperCase() ?? maxDistinctPlayer.position
    }
    
    if (finalDirection === 0) {
      console.log('hit and move F')
      return res.send('F')
    }
    if (finalDirection === 2) {
      console.log('hit and move R')
      return res.send('R')
    }
    if (finalDirection === 'l' || finalDirection === 'r' ) {
      console.log("hit and move", finalDirection.toUpperCase())
      return res.send(finalDirection.toUpperCase())
    }
    console.log('wong finalDirection', finalDirection, maxDistinctPlayer);
    // let i = 0
    // if (players[i].position === 0) {
    //   if (players[i+1]?.on == 'l' && players[i+1].distinct > 2) {
    //     console.log('Hit with L')
    //     return res.send('L')
    //   } else {
    //     console.log('Hit with R')
    //     return res.send('R')
    //   }
    // } else {
      return res.send(moves[Math.trunc(Math.random() * moves.length)])
    // }
  } else {
    hitCount = 0
    
    const targetPlayer = players
    .sort((a,b) => {
      return a.noOfStep - b.noOfStep
    })[0]
    console.log('targetPlayer', targetPlayer)
    if (!targetPlayer){
      console.log('normal R')
      lastTargetPlayer = null
      return res.send('R') 
    }
    if (lastTargetPlayer && lastTargetPlayer.x == targetPlayer.x &&lastTargetPlayer.y == targetPlayer.y) {
      console.log('normal T')
      return res.send('T')
    }
    if (targetPlayer.position === 0) {
      if (targetPlayer.distinct <= 3) {
        console.log('normal T')
        lastTargetPlayer = targetPlayer
        return res.send('T')
      }
      if (isBorder(me, res)) {
            return
      }
      console.log('normal F')
      lastTargetPlayer = null
      return res.send('F')
    }
    if (targetPlayer.on =='l') {
      console.log('normal L')
      lastTargetPlayer = null
      return res.send('L')
    } 
    if (targetPlayer.on =='r') {
      console.log('normal R')
      lastTargetPlayer = null
      return res.send('R')
    }
    
  }
//    return res.send('T')
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
