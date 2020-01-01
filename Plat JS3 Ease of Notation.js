//ease-of-notation functions (i.e. functions designed to make the longer functions easier to write)

	function remove(array, element) {//removes an element from an array, as long as it's in there
		var index = array.indexOf(element);
		if (index !== -1) {
			array.splice(index, 1);
		}
	}
	
	function addNew(array, element) {//adds an element to an array, as long as it's not already in there
		var alreadyInThere = false;
		for (k = 0; k<array.length; k++){
		//note the use of k here rather than i or j: never use this function as part of another function that has pre-defined k as something else!
			var e = array[k];
			if (element == e){
				alreadyInThere = true;
			}
		}
		if (!alreadyInThere){
			array.push(element);
		}
	}
	
	function between(min,x,max){//returns true if x is between min and max
		if(x > min && x < max){
			return true;
		}
		else{
			return false;
		}
	}
