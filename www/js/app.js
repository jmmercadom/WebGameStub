
// The code below uses require.js, a module system for javscript:
// http://requirejs.org/docs/api.html#define
//
// You don't have to use require.js, and you can delete all of this if
// you aren't (make sure to uncomment the script tags in index.html also)


// Set the path to jQuery, which will fall back to the local version
// if google is down
require.config({
	baseUrl: 'js/lib',
	paths: {
		'jquery': ['//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min', 'lib/jquery']
	}
});

var global = this;

require(['jquery'], function($) {
	// Create the canvas
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 700;
	canvas.height = 575;
    $("#game-area").append(canvas);

	// Create the audio tag
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'sound/pig.ogg');
    audioElement.load();
    document.body.appendChild(audioElement);

	//Background image
	var bgReady = false;
	var bgImage = new Image();
	bgImage.onload = function() {
		bgReady = true;
	};
	bgImage.src = "img/background.png";

	//Gun Image
	var gunReady = false;
	var bgGun = new Image();
	bgGun.onload = function() {
		bgGun.ready = true;
	};
	bgGun.src = "img/gun3.png";

	//Bullet Image
	var bulletReady = false;
	var bgBullet = new Image();
	bgBullet.onload = function() {
		bgBullet.ready = true;
	};
	bgBullet.src = "img/bullet.png";

	//Duck Image
	var duckReady = false;
	var bgDuck = new Image();
	bgDuck.onload = function() {
		bgDuck.ready = true;
	};
	bgDuck.src = "img/duck.png";

	//Bacon Image
	var bgBacon = new Image();
	bgBacon.onload = function() {
		bgBacon.ready = true;
	};
	bgBacon.src = "img/bacon.png";

	// Game objects
	var gun = {
		speed: 400,
		width: 44
	};

	var bullet = {
		live: false,
		speed: 250
	};

	var duck = {
		speed: 256,
		ySpeed: 100
	};

	var ducksCount = 0;
	var time = 0;
	var ranking = new Array(0, 0, 0, 0, 0);

	// Handle keyboard controls
	var keysDown = {};

	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);

	//Reset game to original state
	function reset() {
		middleScreen = canvas.width / 2;
		gun.x = middleScreen;
		gun.y = canvas.height - 100;

		time = 0;
		ducksCount = 0
		bullet.live = false;
		resetDuck(duck);
	};

	function resetDuck(d) {
		d.live = true;
		d.toHeaven = false;
		d.x = -100;
		d.y = canvas.height - 100 - Math.floor(Math.random() * 500) ;
	};

	// Update game objects
	function update( modifier ) {
		time++;

		if (time >= 6000) {
			updateRanking();
			reset();
			return;
		}
		if (37 in keysDown) { // Player holding left
			if (gun.x >= 0) {
				gun.x -= gun.speed * modifier;
			}
		}

		if (39 in keysDown) { // Player holding right
			if (gun.x <= canvas.width - gun.width) {
				gun.x += gun.speed * modifier;
			}
		}

		if (13 in keysDown && !bullet.live) {
			bullet.live = true;
			bullet.x = gun.x;
			bullet.y = gun.y;
		}

		if (bullet.live) {
			if (bullet.y < 0) {
				bullet.live = false;
				return;
			}
			bullet.y -= bullet.speed * modifier;
		}

		if (duck.live) {
			if (duck.toHeaven) {
				if (duck.y < -90) {
					duck.live = false;
				}
				duck.y -= duck.ySpeed * modifier;
			}
			else {
				if (duck.x > canvas.width) {
					duck.live = false;
					return;
				}
				duck.x += duck.speed * modifier;
			}
		} else {
			resetDuck(duck);
		}

		// Did we killed the duck?
		if (
				bullet.live
				&& !duck.toHeaven
				&& bullet.x >= duck.x
				&& bullet.x <= duck.x + 141
				&& bullet.y <= duck.y + 111
				&& bullet.y >= duck.y
		   ) {
			   duck.toHeaven = true;
			   bullet.live = false;
			   ducksCount += 1;
               audioElement.play();
		   }
	};

	// Ranking
	function updateRanking() {
		ranking.sort(function(a,b){return b-a});
		for(j = 0; j < ranking.length; j++) {
			if (ranking[j] < ducksCount) {
				ranking.pop();
				ranking.push(ducksCount);
				ranking.sort(function(a,b){return b-a});
				updateScoreTable();
				return;
			}
		}
	}

	function updateScoreTable() {
		for (i = 0; i < ranking.length; i++) {
			var rkContent = $('#position' + (i + 1) + ' p');
			rkContent.replaceWith('<p>' + ranking[i] + ' pigs in heaven</p>');
		}
	}

	// Draw everything
	function render() {
		if (bgReady) {
			ctx.drawImage(bgImage, 0, 0);
		}

		if (bgGun) {
			ctx.drawImage(bgGun, gun.x, gun.y);
		}

		if (bullet.live) {
			ctx.drawImage(bgBullet, bullet.x + 18, bullet.y);
		}
		if (duck.live) {
			var image = bgDuck;
			if (duck.toHeaven)
				image = bgBacon;
			ctx.drawImage(image, duck.x, duck.y);
		}

		ctx.font = "24px Helvetica";
		ctx.fillStyle = "black";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Pigs on heaven: " + ducksCount, 32, 32);
		ctx.fillText("Time: " + (time / 100).toFixed(2), 550, 32);

	};

	var main = function () {
		var now = Date.now();
		var delta = now - then;

		update(delta / 1000);
		render();

		then = now;
	};

	// Let's play this game!
	reset();
	var then = Date.now();
	// Execute as fast as possible
	setInterval(main, 1);

});

// END REQUIRE.JS CODE
// Remove all of this if not using require.js
