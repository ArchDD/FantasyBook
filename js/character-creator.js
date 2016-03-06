// initialise when document is ready
$(document).ready(function() {
    init();
  });

init = function() {
	var characterCreator = document.getElementById("character-creator");
	var characterCanvas = document.getElementById("character");
	var ui = document.getElementById("ui");

	// resizing listeners for responsive canvas
	resizeCanvas(characterCreator);
	resizeCanvas(characterCanvas);
	resizeCanvas(ui);
	window.addEventListener('resize', function() {
    	resizeCanvas(characterCreator);
    	resizeCanvas(characterCanvas);
    	resizeCanvas(ui);
	}, false);

	var uiContext = ui.getContext("2d");
	uiContext.mouse = {
        x: 0,
        y: 0,
        clicked: false,
        down: false
    };
	ui.addEventListener("mousemove", function(e) {
		uiContext.mouse.x = e.offsetX;
		uiContext.mouse.y = e.offsetY;
		uiContext.mouse.clicked = (e.which == 1 && !uiContext.mouse.down);
        uiContext.mouse.down = (e.which == 1);
        console.log(uiContext.mouse);
	});

	ui.addEventListener("mousedown", function(e) {
        uiContext.mouse.clicked = !uiContext.mouse.down;
        uiContext.mouse.down = true;
        console.log("down");
    });

    ui.addEventListener("mouseup", function(e) {
        uiContext.mouse.down = false;
        uiContext.mouse.clicked = false;
    });

	loadImages(backgroundImages, function() {
		for (var i = 0; i < backgroundImages.length; i++) 
			draw(characterCreator, backgroundImages[i], characterCreator.width/2, characterCreator.height/2, characterCreator.width, characterCreator.height);
	});
	drawCharacter(characterCanvas, myCharacter, characterCanvas.width/1.3, characterCanvas.height/2., characterAspectRatio*(characterCanvas.height/1.4) , (characterCanvas.height/1.4));

	// draw UI

};

// variables
var characterAspectRatio = 191.2/236;
// images to load
var backgroundImages = [
    "../images/bg.jpg"
];
// cached asset management using dictionary
var cachedImages = {};
// character class
character = function() {
	this.hair = {type: "hair_medium", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.nose = {type: "nose_default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.lash = {type: "lash_default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.brow = {type: "brow_default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.socket = {type: "socket_default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.pupil = {type: "pupil_default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.mouth = {type: "mouth_feminine", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.cheek = {type: "cheek_default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.ear = {type: "ear_default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.chin = {type: "chin_default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.head = {type: "head", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.neck = {type: "neck_default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};

	this.features = [this.neck, this.head, this.chin, this.ear, 
					this.cheek, this.mouth, this.pupil, this.socket, 
					this.brow, this.lash, this.nose, this.hair];
}
// character instance
var myCharacter = new character();

drawCharacter = function(canvas, character, x, y, width, height, callback)
{
	// images to load
	var characterImages = [
		"../images/character/"+character.neck.type+".png",
		"../images/character/head.png",
		"../images/character/"+character.chin.type+".png",
		"../images/character/"+character.ear.type+".png",
		"../images/character/"+character.cheek.type+".png",
		"../images/character/"+character.mouth.type+".png",
		"../images/character/"+character.pupil.type+".png",
		"../images/character/"+character.socket.type+".png",
		"../images/character/"+character.brow.type+".png",
		"../images/character/"+character.lash.type+".png",
		"../images/character/"+character.nose.type+".png",
		"../images/character/"+character.hair.type+".png"];

	loadImages(characterImages, function(){
		for (var i = 0; i < character.features.length; i++)
		{
			draw(canvas, 
				"../images/character/"+character.features[i].type+".png",
				x+character.features[i].xOffset, 
				y+character.features[i].yOffset,
				width*character.features[i].xScale, 
				height*character.features[i].yScale);
		}

	});
}


loadImages = function(srcList, callback) {
	// batch loading
	var loadBatch = {
		count: 0,
		total: srcList.length,
		cb: callback
	};

	for (var i = 0; i < srcList.length; i++) {
		// check if exists
		if (cachedImages[srcList[i]] == undefined) {
			// load new image
			var img = new Image();
			img.onload = function() {
				onLoadedCallback(img, loadBatch);
			}
			img.src = srcList[i];
			cachedImages[srcList[i]] = img;
		} else {
			// already exists
			onLoadedCallback(cachedImages[srcList[i]], loadBatch);
		}
	}
}

function onLoadedCallback(src, batch)
{
	batch.count++;
	if (batch.count == batch.total) {
		batch.cb(src);
	}
}

getAspectRatio = function(width, height)
{
	return width/height;
}

draw = function(canvas, src, x, y, width, height) {
	var context = canvas.getContext("2d");
	context.drawImage(cachedImages[src], x-width/2, y-height/2, width, height);
};

// event function that makes canvas responsive
resizeCanvas = function(canvas) {
		var gameContainer = document.getElementById("main");
		var context = canvas.getContext("2d");

		var dataURL = canvas.toDataURL("image/png", 1.0);

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
		//draw(canvas, [dataURL], 0, 0, canvas.width, canvas.height);
		var image = new Image();
		image.src = dataURL;
		image.onload = function() {
			context.drawImage(image, 0, 0, canvas.width, canvas.height);
		};
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