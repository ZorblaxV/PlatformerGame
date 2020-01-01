//Canvas and background variables
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");;
	var ctx = canvas.getContext("2d");
	var background = document.getElementById("myForest");
	var backgroundX = 0;
	var backgroundY = 0;
	
//test functions
	function test() {// this function can be used as a quick test to see which part of the code is going wrong
	//This function can be used to test where the mistake in the code might be (note, because the game function clears the canvas, as long as the game function is working, the test should be put into the game function)
		ctx.font = "30px Arial";
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.fillText("TESTING", canvas.width/10, canvas.height/2); 
	}
	
	function testIf(condition, text = "Condition Met", xposition = canvas.width/2, yposition = canvas.height/2) {//put in the condition that you want to be met and this function should return the text if it's met
		if (condition == true){//you can rewrite the condition here if you want something non-boolean
			ctx.font = "30px Arial";
			ctx.fillStyle = "black";
			ctx.textAlign = "center";
			ctx.fillText(text, xposition, yposition);
		}
	}
	
	
//Platform variables
	function pCreator(X, Y, w, h = groundHeight, c = "Black", 
					solidWall = true, xSpeed = 0, ySpeed = 0, initialCounter = 0, counter = -1, label = "platform"){
		this.X = X;
		this.Y = Y;
		this.width = w;
		this.height = h;		
		this.colour = c;
		this.solidWall = solidWall;
		this.xSpeed = xSpeed;
		this.ySpeed = ySpeed;
		this.initialCounter = initialCounter;
		this.counter = counter;
		this.label = label;
		
		this.end = X + width;
		this.bottom = Y + height;
	}
	/*NOTE: if counter < 0, the platform won't be affected by liftMove().
	If xSpeed = ySpeed = 0, this is irrelevant, as liftMove() won't have any effect anyway.
	For lifts, the counter >= 0 and initialCounter > 0.
	For conveyers and hovers, counter < 0 (hence it being set standardly at -1) as otherwise they'll glitch.
		[This will probably all become irrelevant soon anyway though, because I probs want to separate
		the conveyer / hover movement from xSpeed and ySpeed anyway - partly because it might be cool to have
		conveyer / hover lifts, and at the moment that's impossible]
	*/
	
	pCreator(0,0,0)//I have no idea why this is necessary but the code just stops running at "var ground = new pCreator ..." unless I put this here
	
	var groundHeight = 50
	
	var ground = new pCreator (0, canvas.height-groundHeight, 2*canvas.width/5)
	var ditch = new pCreator (canvas.width/5, canvas.height-groundHeight/3, 3*canvas.width/5, groundHeight/3)
	var ground2 = new pCreator (3*canvas.width/5, canvas.height-groundHeight, 6*canvas.width/5)
	var endGround = new pCreator (11*canvas.width/5, canvas.height-groundHeight, 2*canvas.width/5)
	var ledge = new pCreator (canvas.width/7, 4*canvas.height/6, 80, 10)
	var ledge2 = new pCreator (2*canvas.width, 4*canvas.height/5, 100, 10)
	
	var lift1 = new pCreator (2*canvas.width/3, canvas.height/2, 150, 10, "Black",
							true, 0, -1, 150, 75, "lift1")
	var lift2 = new pCreator (6*canvas.width/7, canvas.height - groundHeight - 70, 100, 10, "Black",
							true, 2, 0.5, 350, 0, "lift2")
	var lift3 = new pCreator (canvas.width, canvas.height/2, 150, 10, "Black",
							true, 0, -1, 100, 0, "lift3")
	
	var conveyer = new pCreator (5*canvas.width/3, canvas.height/3, canvas.width/3, 10, "Blue",
							true, 6, 0, 0, -1, "conveyer")
	var hover = new pCreator (4*canvas.width/3, 2*canvas.height/3, canvas.width/3, 10, "Red",
							true, 0, -2, 0, -1, "hover")
		
	var platform = [ground, ground2, ditch, lift1, lift2, lift3, ledge, ledge2, conveyer, hover, endGround];
	
	var start = ground.X;
	var fin = endGround.X + endGround.width;
	var bottom = ground.Y + ground.height;
	//these are written to make the functions more readable (though remember they need to be constantly re-defined in the game function) 
	
//Character variables
	//stickman variables
	var stickman = document.getElementById("myStickman");
	var characterWidth = 40;
	var characterHeight = 40;
	//ball variables
	var ballRadius = characterWidth/2;
	//both variables
	var x = 0;
	var y = canvas.height-ground.height-characterHeight;
	
//Movement and Collision Variables
	//horizontal movement variables
	var maxdx = 10; //this is the maximum horizontal speed of the ball
	var dx = 0; //this is the horizontal speed of the ball
	var accelerationX = 0.48; //this is the rate at which the ball accelerates if you press the arrow keys
	var decelerationX = 0.2; //this is the rate at which the ball decelerates if you unpress the arrow keys
	
	//vertical movement variables
	var initialdy = -7.5; //this is the speed at which the ball initially jumps when it goes into the air
	var dy = 0; //this is the vertical speed of the ball
	var accelerationY = 0.48; //this is the rate at which the ball accelerates towards the ground if it's in the air
	var jumpExtend = 0.2; //this affects the amount you can extend the ball's jump by if you press space for longer
	var jumpStop = false; //this stops the ball from jumping while in mid-air
	
	/*feel free to mess around with these controls for a smoother jump. I quite like:
	initialdy = -7.5, accelerationY = 0.48, jumpExtend = 0.2 - starter one, maybe a little too high?
	initialdy = -5, accelerationY = 0.5, jumpExtend = 0.35 - better space bar control but maybe less fluid
	initialdy = -1, accelerationY = 0.2, jumpExtend = 0.2 - dude, it's like floating :D
	*/
	
	//screen scroll variables
	var screenScrollSpeed = maxdx;// speed at which the screen can be made to scroll forwards
	
	//Collision detection variables
	var platformSwitch = ground; //this is switched to whichever platform the ball is on, or switched off if the ball is in the air
	var rightWall = false; //this turns on when the ball hits a right platform wall and stops it moving
	var leftWall = false; //this turns on when the ball hits a left platform wall and stops it moving
	var underPlatform = [];//this stores whichever solid platforms the ball is under