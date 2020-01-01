//Ease-of-notation Functions
	function everythingElseMovesHorizontally(m){//makes everything except the ball / character move horizontally by m
		for (j = 0; j<platform.length; j++){
			var q = platform[j];
			q.X += m;
		}
		backgroundX += m;
	}

	function everythingElseMovesVertically(m){//makes everything except the ball / character move vertically by m
		for (j = 0; j<platform.length; j++){
			var q = platform[j];
			q.Y += m;
		}
		backgroundY += m;
	}
	
	function horizontalAlignment(){//returns "c", "l" or "r" depending on the alignment of x
		if ((x + characterWidth/2) - start >= canvas.width/2  &&
			fin - (x + characterWidth/2) >= canvas.width/2){
				return "c"; 
		}
		else if ((x + characterWidth/2) - start < canvas.width/2){
			return "l"
		}
		else if (fin - (x + characterWidth/2) < canvas.width/2){
			return "r"
		}
	}
	/*More explicitly, this function returns:
		"c" if ball should be centred (i.e. if it's more than canvas.width/2 away from both start and fin)
		"l" if start should be zeroed (i.e. if ball is less than canvas.width/2 away from start)
		"r" if fin should be zeroed (i.e. if ball is less than canvas.width/2 away from fin)
	*/

	function verticalAlignment(){//returns "c", "d" or "u" depending on the alignment of y
		if (bottom - (y+characterHeight/2) >= canvas.height/2){
			return "c";
		}
		else if (bottom - (y+ characterHeight/2) < canvas.width/2){
			return "d";
		}
	}

	function xMovement(m){//if x isn't centred, it moves m; otherwise everything else moves -m
		if (horizontalAlignment() !== "c" || aPressed || dPressed){
			x += m;
		}
		else if (start - m >= 0){//this stops the canvas from ever going to the left of start
			everythingElseMovesHorizontally(-start);
			x += m - start;
		}
		else if (fin - m <= canvas.width){//this stops the canvas from ever going to the right of fin
			everythingElseMovesHorizontally(-(fin - canvas.width));
			x += m - (fin - canvas.width);
		}
		else {
			everythingElseMovesHorizontally(-m);
		}
	}
	
	function yMovement(m){//if y isn't centred, it moves m; otherwise everything else moves -m
		if (verticalAlignment() !== "c" || wPressed || sPressed){
			y += m;
		}
		else if (bottom - m <= canvas.height){//this stops the canvas from ever going below bottom
			everythingElseMovesVertically(-(bottom - canvas.height));
			y += m - (bottom - canvas.height);
		}
		else{
			everythingElseMovesVertically(-m);
		}
	}
	
	
//Final functions
	function liftMove(){//this function makes the lifts move
		for (i = 0; i<platform.length; i++){
			var p = platform[i];
			if(p.counter > 0){
				p.Y += p.ySpeed;
				p.X += p.xSpeed;
				p.counter --
			}
			else if (p.counter == 0){
				p.ySpeed = -p.ySpeed;			
				p.xSpeed = -p.xSpeed;
				p.counter = p.initialCounter
			}
		}
	}
	
	function wallBounce(){//this function makes the ball or character bounce off the left of the screen (at start)
		if (x <= start){
			dx = -dx;
			if (dy > 0 && dx > 0 && y < canvas.height){//the y < canvas.height condition ensures it can't bounce back on to the screen if it falls below the screen
				if( -dy  >= 10*accelerationY){
					dy = -dy;
				}
				else{
					dy = -10*accelerationY
				}
			}
		}
		//^if the ball ever hits the edge of the screen it will bounce back at the same speed
		if (x < start){
			x ++;
		}
		//^failsafe: if the ball ever goes off the sides of the screen it will be nudged back on
		
		if (x + characterWidth >= fin){
			dx = -dx;
			if (dy > 0 && dx > 0 && y < canvas.height){
				if( -dy  >= 10*accelerationY){
					dy = -dy;
				}
				else{
					dy = -10*accelerationY
				}
			}
		}
		if (x + characterWidth > fin){
			x --;
		}
	}
	
	function horizontalMovement(){//this function controls the horizontal movement of the ball or character
		if(rightPressed && leftWall == false){// if the right arrow is pressed it will accelerate to a maximum velocity of maxdx
			if (dx + accelerationX <= maxdx){	
				dx += accelerationX;
			}
			xMovement(dx);
		}
				
		else if(leftPressed && rightWall == false){// if the left arrow is pressed it will decelerate to a minimum velocity of -maxdx
			if (dx + accelerationX >= -maxdx){
				dx -= accelerationX;
			}
			xMovement(dx);
		}
				
		else if (!rightPressed && !leftPressed){//If neither arrow is pressed the ball's speed will decrease until rest
			if (Math.abs(dx) < decelerationX){
				dx = 0;
			}//i.e. stops the ball from just going backwards and forwards indefinitely
			else if (dx > 0 && leftWall == false){	
				dx -= decelerationX;
				xMovement(dx);
			}
			else if (dx < 0 && rightWall == false){
				dx += decelerationX;
				xMovement(dx);
			}
		}
	}
	
	function jump(){//this function controls the jump
		if (spacePressed){
			for (i = 0; i<platform.length; i++){
				var p = platform[i];
				if (platformSwitch == p) {
					dy = initialdy;
					platformSwitch = false;
					jumpStop = false;
				}
			}
			if (!jumpStop && dy < 0){
				dy -= jumpExtend;
				yMovement(dy);
			}
		}
		//if space is pressed and it's on a platform:
		//(1) the ball's jump speed is reset to initialdy
		//(2) the platformSwitch is turned off to indicate that the ball is no longer on a platform
		//(3) jumpStop is turned off (until space is unpressed)
		//While jumpStop is off and the ball is heading up the ball will continue to add jumpExtend to its speed
		//N.B. The 'ball is heading up' condition is designed to stop the ball from adding dy to its speed while falling
	}
	
	function gravity(){//this function makes the ball or character accelerate downwards when the platformSwitch is off
		if (!platformSwitch){
			dy += accelerationY;
			yMovement(dy);
		}
	}
	
	function screenScroll(){//this function allows you to scroll forwards around the screen using the 'a', 'd', 'w' and 's' keys
		if (aPressed && start + screenScrollSpeed < 0){
		//if a is pressed the screen scrolls left, provided that won't make start positive
			x += screenScrollSpeed;
			everythingElseMovesHorizontally(screenScrollSpeed);
		}
		else if (aPressed){
		//this is to stop the screen from jolting constantly if it's scrolling left and it hits start
			x -= start;
			everythingElseMovesHorizontally(-start);
		}
		else if (dPressed && fin - screenScrollSpeed > canvas.width){
		//if d is pressed the screen scrolls right, provided that won't make fin less than canvas.width
			x -= screenScrollSpeed;
			everythingElseMovesHorizontally(-screenScrollSpeed);
		}
		else if (dPressed){
		//this is to stop the screen from jolting constantly if it's scrolling right and it hits the end of the endGround
			x -= fin - canvas.width;
			everythingElseMovesHorizontally(-(fin - canvas.width));
		}
		else if (wPressed){
		//if w is pressed the screen scrolls up
			y += screenScrollSpeed;
			everythingElseMovesVertically(screenScrollSpeed);
		}
		else if (sPressed && bottom - screenScrollSpeed > canvas.height){
		//if s is pressed the screen scrolls down, provided that won't make bottom less than canvas.height
			y -= screenScrollSpeed;
			everythingElseMovesVertically(-screenScrollSpeed);
		}
		else if (sPressed){
		//this is to stop the screen from jolting constantly if it's scrolling down and it hits the end of the endGround
			y -= bottom - canvas.height;
			everythingElseMovesVertically(-(bottom - canvas.height));
		}
	}
	
	function screenReadjust(){//this function adjusts the screen to centre the ball or zero start or fin, depending on which is appropriate, so long as 'a', 'd', 'w' and 's' aren't pressed
		if(!aPressed && !dPressed){
			if (x + characterWidth/2  < canvas.width/2 && horizontalAlignment()== "c"){
			//If the ball is ever to the left of the centre-point, and it's more than canvas.width/2 away from start, the screen will readjust to centre the ball
				var temporaryX = x + characterWidth/2;
				x -= (temporaryX - canvas.width/2)/10;
				everythingElseMovesHorizontally(-(temporaryX - canvas.width/2)/10);
			}
			
			else if (x + characterWidth/2 > canvas.width/2 && horizontalAlignment()== "c"){
			//If the ball is ever to the right of the centre-point, and it's more than canvas.width/2 away from fin, the screen will readjust to centre the ball
				var temporaryX2 = x + characterWidth/2
				x += (canvas.width/2 - temporaryX2)/10;
				everythingElseMovesHorizontally((canvas.width/2 - temporaryX2)/10)
			}
			
			else if (horizontalAlignment()== "l"){
			//If the ball is ever less than half the canvas width away from start, the screen will readjust to put start at zero
				x -= start/10;
				everythingElseMovesHorizontally(-start/10);
			}
			
			else if (horizontalAlignment()== "r"){
			//If the ball is ever less than half the canvas width away from fin, the screen will readjust to put fin at canvas.width
				x -= (fin - canvas.width)/10;
				everythingElseMovesHorizontally(-(fin - canvas.width)/10);
			}
		}
		if(!wPressed && !sPressed){
			if (y + characterHeight/2 < canvas.height/2 && verticalAlignment() == "c"){
				var temporaryY = y + characterHeight/2;
				y += (canvas.height/2 - temporaryY)/10;
				everythingElseMovesVertically((canvas.height/2 - temporaryY)/10);
			}
			else if (y + characterHeight/2 > canvas.height/2 && verticalAlignment() == "c"){
				var temporaryY2 = y + characterHeight/2;
				y -= (temporaryY2 - canvas.height/2)/10;
				everythingElseMovesVertically(-(temporaryY2 - canvas.height/2)/10);
			}
			else if (verticalAlignment() == "d"){
				y -= ((bottom - canvas.height)/10)
				everythingElseMovesVertically(-(bottom - canvas.height)/10)
			}
		}
	}