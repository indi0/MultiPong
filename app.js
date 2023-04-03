/*
Multiplayer Pong game
Using p5.js, Firebase Realtime Database and Firebase Authentication
by Axel Persson
*/

/*
the script below is in the index.html file
    <script src="https://www.gstatic.com/firebasejs/9.19.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js"></script>

    <script>
        // Your web app's Firebase configuration
        const firebaseConfig = {
          apiKey: "AIzaSyAKo_00KstGqgbHiF11jociEvliD1Xikw8",
          authDomain: "multipong-46515.firebaseapp.com",
          databaseURL: "https://multipong-46515-default-rtdb.europe-west1.firebasedatabase.app",
          projectId: "multipong-46515",
          storageBucket: "multipong-46515.appspot.com",
          messagingSenderId: "190617665266",
          appId: "1:190617665266:web:361ad06f58a13d6a855a6b",
        };
      
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
      </script>
*/

// Return a random color, bright enough to be visible on a black background
function randomColor() {
  return color(random(100, 255), random(100, 255), random(100, 255));
}

var database;
var ball;
var players = {};
var uid;
var playerRef;
var gameStarted = false;
var score;

function setup() {

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      uid = user.uid;
      playerRef = database.ref("players/"+uid);

      playerRef.set({
        id: uid,
        x: 0,
        y: height/2-50,
      });

      ballRef = database.ref("ball");
      ballRef.set({
        x: width/2,
        y: height/2,
        speedX: 0,
        speedY: 0,
      });

      playerRef.onDisconnect().remove();

      startGame();
    }
  });

  firebase.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
  });

  database = firebase.database();
  cnv = createCanvas(600, 400);
  
  //center canvas
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function startGame() {
  gameStarted = true;
  const allPlayersRef = database.ref("players");
  const ballRef = database.ref("ball");
  const scoreRef = database.ref("score");

  allPlayersRef.on("value", function(snapshot) {
    // Whenever a change occurs
    const allPlayers = snapshot.val();

    Object.keys(allPlayers).forEach(function(key) {

      if(key==uid) return; //Skip myself (I update my own position)

      const player = allPlayers[key];
      players[player.id].setposition(player.x, player.y);
    });
  });

  allPlayersRef.on("child_added", function(snapshot) {
    //When a new player is added
    const addedPlayer = snapshot.val();
    console.log("Player added: " + addedPlayer.id);

    if(addedPlayer.id == uid) {
      players[addedPlayer.id] = new Player(addedPlayer.x, addedPlayer.y, addedPlayer.id, true);
    } else {
      players[addedPlayer.id] = new Player(addedPlayer.x, addedPlayer.y, addedPlayer.id);
    }
  });

  allPlayersRef.on("child_removed", function(snapshot) {
    //When a player is removed
    const removedPlayer = snapshot.val();
    console.log("Player removed: " + removedPlayer.id);
    delete players[removedPlayer.id];
  });

  ball = new Ball();

  // Listen to changes in the ball position
  ballRef.on("value", function(snapshot) {
    const ballData = snapshot.val();
    ball.setPosition(ballData.x, ballData.y);
    ball.setSpeed(ballData.speedX, ballData.speedY);
  });

  score = new Score();

  // Listen to changes in the score
  scoreRef.on("value", function(snapshot) {
    const scoreData = snapshot.val();
    score.setScore(scoreData.leftScore, scoreData.rightScore);
  });
}

function draw() {

  if(gameStarted) {

    if(keyIsDown(UP_ARROW)) {
      players[uid].moveY(-5);
    }
    
    if(keyIsDown(DOWN_ARROW)) {
      players[uid].moveY(5);
    }

    background(0);

    // Draw the middle line
    for (var i = 0; i < height; i+=20) {
      fill(255);
      rect(width/2-1, i, 2, 10);
    }
    score.show();

    ball.physics();
    ball.drawTrail(20,3);
    ball.show();

    Object.keys(players).forEach(function(key) {
      players[key].show();
    });

  }
}

function keyPressed() {
  if (key == 'f') {
    players[uid].setposition(width-players[uid].x-players[uid].w, players[uid].y);
    players[uid].update();
  }

  if (key == ' ') {
    ball.reset();
    score.reset();
  }
}