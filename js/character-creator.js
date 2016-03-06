//context.clearRect(0, 0, canvas.width, canvas.height); <- refresh
// initialise when document is ready
$(document).ready(function() {
    init();
  });

// initialisation adds event listeners and draws background
init = function() {
	var characterCreator = document.getElementById("character-creator");
	var characterCanvas = document.getElementById("character");

	resizeCanvas(characterCreator);
	resizeCanvas(characterCanvas);
	window.addEventListener('resize', function() {
    	resizeCanvas(characterCreator);
	}, false);
	window.addEventListener('resize', function() {
    	resizeCanvas(characterCanvas);
	}, false);

	draw(characterCreator, "../images/bg.jpg", 0, 0, characterCreator.width, characterCreator.height);
	draw(characterCanvas, "../images/character.png", characterCanvas.width/3, characterCanvas.height/3, characterCanvas.width/10 , (characterCanvas.width/10) );
};

character = function() {
	this.hair = {type: "medium", hueShift: 0, xOffset: 0, yOffset: 0, scale: 1};
	this.nose = {type: "normal", hueShift: 0, xOffset: 0, yOffset: 0, scale: 1};
	this.lash = {type: "normal", hueShift: 0, xOffset: 0, yOffset: 0, scale: 1};
	this.brow = {type: "normal", hueShift: 0, xOffset: 0, yOffset: 0, scale: 1};
	this.socket = {type: "normal", hueShift: 0, xOffset: 0, yOffset: 0, scale: 1};
	this.pupil = {type: "normal", hueShift: 0, xOffset: 0, yOffset: 0, scale: 1};
	this.mouth = {type: "normal", hueShift: 0, xOffset: 0, yOffset: 0, scale: 1};
	this.cheek = {type: "normal", hueShift: 0, xOffset: 0, yOffset: 0, scale: 1};
	this.ear = {type: "normal", hueShift: 0, xOffset: 0, yOffset: 0, scale: 1};
	this.chin = {type: "normal", hueShift: 0, xOffset: 0, yOffset: 0, scale: 1};
	this.neck = {type: "normal", hueShift: 0, xOffset: 0, yOffset: 0, scale: 1};
}

getAspectRatio = function(width, height)
{
	return width/height;
}

var myCharacter = new character();

draw = function(canvas, src, x, y, width, height) {
	var context = canvas.getContext("2d");
	var image = new Image();

	image.onload = function() {
		context.drawImage(image, x, y, width, height);
	}
	image.src = src
};

// event function that makes canvas responsive
resizeCanvas = function(canvas) {
		var gameContainer = document.getElementById("main");
		var context = canvas.getContext("2d");

		var dataURL = canvas.toDataURL();

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

		canvas.width = resizeWidth;
		canvas.height = resizeHeight;
		canvas.style.paddingLeft = (gameContainer.clientWidth-resizeWidth)/2 + 'px';
		canvas.style.paddingTop = '0.5em';
		//gameContainer.style.fontSize = (resizeWidth / 400) + 'em';
		draw(canvas, dataURL, 0, 0, canvas.width, canvas.height);
};

//********** this.parent() for inheritance

drawSprite = function(spriteName, x, y) {

}

// declare an base entity class for game objects
Entity = function() {
	var position = {x: 0, y: 0};
	var size = {x: 0, y: 0};
	var isAlive = true;
	var spriteName = null;
	var zIndex = 0;

	update = function(){};
	draw = function(){
		// subtract pivot to centre around given position
		drawSprite(this.spriteName, this.position.x.round() - this.hsize.x, this.position.y.round() - this.hsize.y);
	};
};

// declare the game engine class that handles main game logic and loop
GameEngine = function() {
	entities = new function(){};
	factory = new function(){};

	spawnEntity = function(typename) {
		return new (factory[typename])();
	}

	// the update loop goes through all entities and calls update
	update = function() {
		for (var i = 0; i < this.entities.length; i++)
		{
			var entity = this.entities[i];
			entity.update();
		}
	}
	// engine draw function
	draw = function() {
		// draw map

		// draw entities


	}
}

//gameEngine = new GameEngine();