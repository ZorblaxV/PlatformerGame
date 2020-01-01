//Ease-of-Notation Functions
	function insidePlatform(x,y){//returns true if the coordinate (x,y) is inside a platform
		for (i = 0; i<platform.length; i++){
			var p = platform[i];
			if (between(p.X, x, p.X + p.width) && between(p.Y, y, p.Y + p.height)){
				return true;
			}
		}
	}

// collision detection functions
	function platformCollisionDetector(){//this function detects when the ball or character lands on a platform
		for (i = 0; i<platform.length; i++){
			var p = platform[i];
			if (platformSwitch == p){
				if (x + characterWidth/2 >= p.X  && x + characterWidth/2 <= p.X + p.width){
					xMovement(p.xSpeed);
					yMovement(p.ySpeed);
				}
				else{
					platformSwitch = false;
				}
			}
			else if (y + characterHeight + dy + accelerationY >= p.Y + p.ySpeed && y + characterHeight <= p.Y && x + characterWidth/2 >= p.X  && x + characterWidth/2 <= p.X + p.width){
				y = p.Y-characterHeight;
				dy = 0;//this seems to help make the ball's fall off the platform smoother
				platformSwitch = p;
			}
		}
	}
	/*If the platformSwitch is switched to a platform p, and the ball IS on p, then it's x- and y-coordinate will move with p's
		If platformSwitch is switched to p and the ball ISN'T on p, then it will be switched off
		If the ball's motion (complete with the added speed from gravity) will take it below a platform p ...
		...and it's currently above p, and its x-coordinate falls within p's, then:
			(1) it will land on p
			(2) dy gets set to zero
			(3) the platformSwitch will switch to p
		*/
	
	function secondPlatformCollisionDetector(){//this function detects when the ball or character collides with the bottom or sides of a solid platform
		for (i = 0; i<platform.length; i++){
			var p = platform[i];
			if (p.solidWall){
				if (x + characterWidth + dx >= p.X + p.xSpeed && x + characterWidth <= p.X && y + characterHeight + dy > p.Y && y + dy < p.Y+ p.height){
					x = p.X - characterWidth;
					dx = 0;
					leftWall = p;
				}
				if (leftWall == p){
					if (p.xSpeed < 0){
						x += p.xSpeed;
					}
					if (x + characterWidth < p.X || y + characterHeight <= p.Y || y + dy >= p.Y+ p.height){
						leftWall = false;
					}
				}
				
				if (x + dx <= p.X + p.width + p.xSpeed && x >= p.X + p.width && y + dy + characterHeight > p.Y && y + dy < p.Y+ p.height){
					x = p.X + p.width;
					dx = 0;
					rightWall = p;
				}
				if (rightWall == p){
					if (p.xSpeed > 0){
						x += p.xSpeed;
					}
					if (x > p.X + p.width || y + characterHeight <= p.Y || y + dy >= p.Y+ p.height){
						rightWall = false;
					}
				}
				
				if (y > p.Y + p.height && x + characterWidth/2 >= p.X && x + characterWidth/2 <= p.X + p.width){
					addNew(underPlatform, p);
				}
				for (j = 0; j<underPlatform.length; j++){
					var q = underPlatform[j];
					if (p == q){
						if (y <= p.Y + p.height && x + characterWidth/2 >= p.X && x + characterWidth/2 <= p.X + p.width){
							y = p.Y + p.height;
							dy = 0;
							jumpStop = true;
							remove(underPlatform,p); //stops the ball travelling down with a solid lift
						}
						else if (x + characterWidth/2 < p.X || x + characterWidth/2 > p.X + p.width){
							remove(underPlatform,p)
						}
					}
				}
			}
		}
	}
	/*For solid platforms, p:
		If the ball is currently to the left of p but its horizontal motion will take it through p then:
			(1) leftWall switches to p
			(2) dx = 0
			(3) x switches to just to the left of p
		If leftWall is switched to p:
			(1) if the platform is travelling left, x travels with the speed of p
			(2) leftWall switches off
		(Similarly for rightWall)
		If the ball ever goes under p:
			p is added to the underPlatform array (provided it's not already in there)
		If p is in the underPlatform array:
			then if the ball is stil under p:
				(1) y is placed directly under p
				(2) dy = 0
				(3) jumpStop is switched on
				(4) p is instantaneously removed from underPlatform to stop the ball travelling down with p if p is a downwards-moving lift 
			or if the ball is not still under p, then p is removed from underPlatform
	*/
	
	function insideSolid(){//this function will move the ball backwards / forwards if it's ever partially inside a solid platform
		for (i = 0; i<platform.length; i++){
			var p = platform[i];
			if (p.solidWall && underPlatform == false && platformSwitch !== p){
			//the dy >= 0 criterion is designed to ensure that if the ball is currently UNDER p it won't be knocked sideways by insideSolid
			//the platformSwitch !== p criterion is to ensure the same thing for it the ball is currently ON p
				if (x + characterWidth > p.X && x + characterWidth/2 <= p.X + p.width/2 && y + characterHeight > p.Y && y < p.Y+ p.height){
					x -= 2;
					x += p.xSpeed;
					if (dx > 0){
						dx = -dx;
					}
				}
				if (x < p.X + p.width && x + characterWidth/2 > p.X + p.width/2 && y + characterHeight > p.Y && y < p.Y+ p.height){
					x += 2;
					x += p.xSpeed;
					if (dx < 0){
						dx = -dx;
					}
				}
			}
		}
	}
	/*this is the most buggy function and the most messy one as well - I am planning to change it soon but at the moment it sort of works
		so I'm not going to change it for the mo
	*/