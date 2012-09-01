
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
	'jquery':
	['//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
'lib/jquery']
}
});

var global = this;

require(['jquery'], function($) {
	// Create the canvas
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 700;
	canvas.height = 575;
	document.body.appendChild(canvas);

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

	// Game objects
	var gun = {
		speed: 256
	};

	var bullet = {
		live: false,
	        speed: 200 
	}

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
		gun.x = canvas.width / 2;
		gun.y = canvas.height - 100;
	};

	// Update game objects
	function update( modifier ) {
		if (37 in keysDown) { // Player holding left
			gun.x -= gun.speed * modifier;
		}

		if (39 in keysDown) { // Player holding right
			gun.x += gun.speed * modifier;
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

	};

	// Draw everything
	function render() {
		if (bgReady) {
			ctx.drawImage(bgImage, 0, 0);
		}

		if (bgGun) {
			ctx.drawImage(bgGun, gun.x, gun.y);
		}

		if (bullet.live) {
			ctx.fillRect(bullet.x + 20, bullet.y, 6, 15);
		}
	};

	// The main game loop
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
