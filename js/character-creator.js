//context.clearRect(0, 0, canvas.width, canvas.height); <- refresh

// initialise when document is ready
$(document).ready(function() {
    init();
  });

draw = function() {
	var characterCreator = document.getElementById("character-creator");
	var context = characterCreator.getContext("2d");
	var image = new Image();

	image.onload = function() {
		context.drawImage(image, 0, 0, characterCreator.width,characterCreator.height);
	}

	image.src = "../images/bg.jpg"
};

// initialisation adds event listeners and draws background
init = function() {
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas, false);
	draw();
};

// event function that makes canvas responsive
resizeCanvas = function() {
		var gameContainer = document.getElementById("main");
		var characterCreator = document.getElementById("character-creator");

		var flexVal = 14.0;
		var aspectRatio = 16.0/10.0;
		//var resizeWidth = gameContainer.clientWidth;
		var resizeWidth = window.innerWidth*(10.0/flexVal);
		var resizeHeight = window.innerHeight*(10.0/flexVal);
		var newAspectRatio = resizeWidth/resizeHeight;
		// resize, retaining aspect ratio
		if (newAspectRatio > aspectRatio) {
			// shrink by width
			resizeWidth = resizeHeight * aspectRatio;
		} else {
			// shrink by height
			resizeHeight = resizeWidth / aspectRatio;
		}

		characterCreator.width = resizeWidth;
		characterCreator.height = resizeHeight;
		characterCreator.style.paddingLeft = (gameContainer.clientWidth-resizeWidth)/2 + 'px';
		characterCreator.style.paddingTop = '0.5em';
		//gameContainer.style.fontSize = (resizeWidth / 400) + 'em';
		draw();
};

//********** this.parent() for inheritance

// declare an base entity class for game objects
Entity = function(){
	var position = {x: 0, y: 0};
	var size = {x: 0, y: 0};

	update = function(){};
};

// declare the game engine class that handles main game logic and loop
GameEngine = function()
{
	entities = new function(){};
	factory = new function(){};

	spawnEntity = function(typename){
		return new (factory[typename])();
	}

	// the update loop goes through all entities and calls update
	update = function()
	{
		for (var i = 0; i < this.entities.length; i++)
		{
			var entity = this.entities[i];
			entity.update();
		}
	}
}