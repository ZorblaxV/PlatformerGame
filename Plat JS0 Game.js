	function game() {//this function has all the information for the game
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();
		drawPlatform();
		drawBall();
		
		start = ground.X;
		fin = endGround.X + endGround.width;
		bottom = ground.Y + ground.height;
		//we need to do this here so that start, end, bottom and top are updated to move with ground and endGround
		
		if (paused){
			writePaused();
		}
		else{
			wallBounce();
			liftMove();
			horizontalMovement();
			jump();
			platformCollisionDetector();
			secondPlatformCollisionDetector();
			gravity();
			insideSolid();
			screenReadjust();
		}
		
		screenScroll();
		//testing station
		testIf(false)
		
		requestAnimationFrame(game);
	}
	
	game();