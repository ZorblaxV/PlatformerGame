//keypad variables
	var rightPressed = false;
	var leftPressed = false;
	var spacePressed = false;
	var paused = false;
	var pauseLock = false; //the pauseLock is to ensure that if you continually hold down 'p', the screen remains paused
	var aPressed = false;
	var dPressed = false;
	var wPressed = false;
	var sPressed = false;
	var mousePressed = true;
	
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("click", mouseClickHandler, false);
	
	//keypad and mouse functions
	function keyDownHandler(e) {//this function takes the event of a key going down (labelled 'e') as its input and changes the relevant variables
		if(e.keyCode == 39) {//39 is the key code for the right arrow key
			rightPressed = true;
		}
		else if(e.keyCode == 37) {//37 is the key code for the left arrow key
			leftPressed = true;
		}
		else if(e.keyCode == 32) {//32 is the key code for the space bar
			spacePressed = true;
		}
		else if (e.keyCode == 80) {//80 is the key code for the 'p' key
			if (!paused){
				paused = true;
				pauseLock = true;
			}
			else if (paused && !pauseLock){
				paused = false;
			}
		}
		else if(e.keyCode == 65) {//65 is the key code for a
			aPressed = true;
		}
		else if(e.keyCode == 68) {//68 is the key code for d
			dPressed = true;
		}
		else if(e.keyCode == 87){//87 is the key code for w
			wPressed = true;
		}
		else if(e.keyCode == 83){//83 is the keycode for s
			sPressed = true;
		}
	}
	
	function keyUpHandler(e) {//this function takes the event of a key going up (labelled 'e') as its input and changes the relevant variables
		if(e.keyCode == 39) {
			rightPressed = false;
		}
		else if(e.keyCode == 37) {
			leftPressed = false;
		}
		else if(e.keyCode == 32) {
			spacePressed = false;
			jumpStop = true;
		}
		else if(e.keyCode == 80){
			pauseLock = false;
		}
		else if(e.keyCode == 65) {
			aPressed = false;
		}
		else if(e.keyCode == 68) {
			dPressed = false;
		}
		else if(e.keyCode == 87){
			wPressed = false;
		}
		else if(e.keyCode == 83){
			sPressed = false;
		}
	}
	
	function mouseClickHandler(e) {//this function takes the event of the mouse being clicked (labelled 'e') and [atm does nothing]
		if (mousePressed == true){
			mousePressed = false;
		}
		else{
			mousePressed = true;
		}
	}