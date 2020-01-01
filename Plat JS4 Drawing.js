// drawing functions
	function writePaused(){//this function writes 'paused'
		ctx.font = "30px Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("PAUSED", canvas.width/2, canvas.height/2); 
		ctx.font = "20px Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("To scroll, press w, a, s and d", canvas.width/2, canvas.height/2+20)
		ctx.font = "20px Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("To unpause, press p", canvas.width/2, canvas.height/2+40)
	}
	
	function drawPlatform() {//this function draws the platforms
		for (i = 0; i<platform.length; i++){
			var p = platform[i];
			ctx.beginPath();
			ctx.rect(p.X, p.Y, p.width, p.height);
			ctx.fillStyle = p.colour;
			ctx.fill();
			ctx.closePath();
		}
	}
	
	function drawBall() {//this function draws the ball
		characterHeight = characterWidth
		ctx.beginPath();
		ctx.arc(x+ballRadius, y+ballRadius, ballRadius, 0, Math.PI*2);
		ctx.fillStyle = "RED"
		ctx.fill();
		ctx.closePath();
	}
	
	function drawCharacter() {//this function draws the character
		ctx.drawImage(stickman, x, y, characterWidth, characterHeight);
	}

	function drawBackground(){//this function draws the background (though ideally I want the background to change with the ball so will have to sort that soon)
		ctx.drawImage(background,backgroundX,backgroundY, 2*canvas.width, 2*canvas.height);
	}