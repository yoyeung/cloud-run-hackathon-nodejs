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

// app.post('/', function (req, res) {
//     const moves = ['R', 'L','R', 'R','R', 'R','L', 'L','R', 'L'];
  
//   const URL = `${req.protocol}://${req.hostname}/`
//   console.log(JSON.stringify(req.body));
//   let closeToMe = [100,100]
//   let score = 100
//   const  me = req.body.arena.state[URL]
//   delete req.body.arena.state[URL]
//   const players = Object.values(req.body.arena.state)
//   console.log(players)
//   players.forEach(player => {
//       const possibleX = me.x - player.x
//       const possibleY = me.y - player.y
//       if ((Math.abs(possibleX) + Math.abs(possibleY)) < score) {
//         closeToMe[0] = possibleX
//         closeToMe[1] = possibleY
//         score = (Math.abs(possibleX) + Math.abs(possibleY))
//       }
//   })
//   if (me.wasHit && isShot === false) {
//     isShot = true
//   }
//   if (isShot && last <=2) {
//       if (last === 0){
//         last += 1
//         res.send(moves[Math.floor(Math.random() * moves.length)])
//       }
        
//       if (last <= 3){
//         last += 1
//         res.send('F')
//       }
//       last += 1
//       if (last >=4){
//         isShot = false 
//         last = 0
//       }
      
//   }
//   console.log('result', shotOrGo(me, closeToMe), closeToMe, me)
//   stack.push(shotOrGo(me, closeToMe))
//   if (stack.length > 50) {
//     stack = []
//     res.send(moves[Math.floor(Math.random() * moves.length)])
//   }
//   res.send(shotOrGo(me, closeToMe));
// });

app.post('/', function (req, res) {
    const moves = ['R', 'L','R', 'R','F', 'R','L', 'F','R', 'L'];
  
  const URL = `https://${req.hostname}`
  console.log('URL', URL)
  console.log(JSON.stringify(req.body.arena.state));
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
  
  
  
  
//   res.send(moves[Math.floor(Math.random() * moves.length)])
  
});

// try to find out is the player on my left/right/behind
function thePlayerDirection(me) {
  return (player) => {
   if (me.direction === 'N') {
     
     if (player.y === me.y){
        if(player.x < me.x) {
          player.position =0
        } else {
          player.position = 2
        }
        player.distinct = Math.abs(player.x - me.x)
      } else {
       player.position = 1 
       player.on = (player.y > me.y) ? 'r' : 'l'
       player.distinct = Math.abs(player.y - me.y)
      }
  
    } else if (me.direction === 'E') {
      if (player.x === me.x){
        if(player.y > me.y) {
          player.position =0
        } else {
          player.position = 2
        }
        player.distinct = Math.abs(player.y - me.y)
      } else {
        player.position = 1
        player.on = (player.x > me.x) ? 'r' : 'l'
        player.distinct = Math.abs(player.x - me.x)
      }
    } else if (me.direction === 'W') {
      if (player.x === me.x){
        if(player.y < me.y) {
          player.position =0
        } else {
          player.position = 2
        }
        player.distinct = Math.abs(player.y - me.y)
      } else {
        player.position = 1
        player.on = (player.x > me.x) ? 'l' : 'r'
        player.distinct = Math.abs(player.x - me.x)
      }
    } else {
      if (player.y === me.y){
        if(player.x > me.x) {
          player.position =0
        } else {
          player.position = 2
        }
        player.distinct = Math.abs(player.x - me.x)
      } else {
       player.position = 1 
       player.on = (player.y > me.y) ? 'l' : 'r'
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
        return res.send('L')
      } else {
        return res.send('R')
      }
    } else {
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
// function checkCloseToMe(me){
//  return (player) => {
//     if (me.direction === 'N') {
//       if(player.y < me.y) {
//         if (me.y - player.y < 3) {
//           return res.send('T')
//         } else {
//           return res.send('F')
//         }
//       }
      
//     } else if (me.direction === 'E') {
//       if(player.x > me.x) {
//         if (player.x - me.x < 3) {
//           return res.send('T')
//         } else {
//           return res.send('F')
//         }
//       }
      
//     } else if (me.direction === 'W') {
//       if(player.x < me.x) {
//         if (me.x - player.x < 3) {
//           return res.send('T')
//         } else {
//           return res.send('F')
//         }
//       }
//     } else {
//       if(player.y > me.y) {
//         if (player.y - me.y < 3) {
//           return res.send('T')
//         } else {
//           return res.send('F')
//         }
//       }
//     }
    
//  }
// }

function filterForSameRow(me){ 
  return (player) => {
    if (me.x === player.x || me.y === player.y){
      return true
    }
    return false
  }
}


// function shotOrGo(me,closeToMe) {
//     const moves2 = ['R','F', 'F','F','F', 'L','F'];
//     if (closeToMe[0] > closeToMe[1]) {
//         if (closeToMe[0] > 0) { //1
//             if (me.direction === 'W' && Math.abs(closeToMe[0]) < 3  &&  Math.abs(closeToMe[1]) === 0) {
//                 return 'T'
//             } else if(me.direction ==='S') {
//                 return 'R'
//             } else if (me.direction ==='N' || me.direction ==='E') {
//                 return 'L'
//             }
//         } else { //2
//             if (me.direction === 'E' && Math.abs(closeToMe[0]) < 3  &&  Math.abs(closeToMe[1]) === 0) {
//                 return 'T'
//             } else if(me.direction ==='S') {
//                 return 'L'
//             } else if (me.direction ==='N' || me.direction ==='W') {
//                 return 'R'
//             }
//         }
        
//     } else {
//         if (closeToMe[1] > 0) { //3
//             if (me.direction === 'N' && Math.abs(closeToMe[1]) < 3 &&  Math.abs(closeToMe[0]) === 0) {
//                 return 'T'
//             } else if(me.direction ==='E') {
//                 return 'L'
//             } else if (me.direction ==='S' || me.direction ==='W') {
//                 return 'R'
//             }
//         } else { //4
//             if (me.direction === 'S' && Math.abs(closeToMe[1]) < 3  &&  Math.abs(closeToMe[0]) === 0) {
//                 return 'T'
//             } else if(me.direction ==='E') {
//                 return 'R'
//             } else if (me.direction ==='N' || me.direction ==='W') {
//                 return 'L'
//             }
//         }
//     }

//     return moves2[Math.floor(Math.random() * moves2.length)]
    
// }

app.listen(process.env.PORT || 8080);
