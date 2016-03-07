// initialise when document is ready
$(document).ready(function() {
    init();
  });

init = function() {
	var characterCreator = document.getElementById("character-creator");
	var characterCanvas = document.getElementById("character");

	// resizing listeners for responsive canvas
	resizeCanvas(characterCreator);
	resizeCanvas(characterCanvas);
	window.addEventListener('resize', function() {
    	resizeCanvas(characterCreator);
    	resizeCanvas(characterCanvas);
	}, false);

	loadImages(backgroundImages, function() {
		for (var i = 0; i < backgroundImages.length; i++) 
			draw(characterCreator, backgroundImages[i], characterCreator.width/2, characterCreator.height/2, characterCreator.width, characterCreator.height);
	});
	drawCharacter(characterCanvas, myCharacter, characterCanvas.width/1.3, characterCanvas.height/2., characterAspectRatio*(characterCanvas.height/1.4) , (characterCanvas.height/1.4));
	
	setupUI();
	placeUI(characterCreator);
};

setupUI = function() {
	// UI
	document.querySelectorAll('.ui-button')[0].addEventListener('click', function(event) {
	   console.log('Button clicked'); 
	});
}

placeUI = function(canvas) {
	var rect = canvas.getBoundingClientRect();
	console.log(rect.top, rect.right, rect.bottom, rect.left);

	var uibutton = document.querySelectorAll('.ui-button')[0];
	uibutton.style.width = canvas.width/10+'px';
	uibutton.style.height = canvas.height/10+'px';

	uibutton.style.left = x+'px';
	uibutton.style.top = y+'px';

}

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
	this.characterName = "";
	this.ownerName = "";

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

draw = function(canvas, src, x, y, width, height) {
	var context = canvas.getContext("2d");
	context.drawImage(cachedImages[src], x-width/2, y-height/2, width, height);
};

// event function that makes canvas responsive
resizeCanvas = function(canvas) {
		canvas.style.marginLeft = "0px";
		canvas.style.marginTop = "0px";
		var gameContainer = document.getElementById("main");
		var context = canvas.getContext("2d");
		var dataURL = canvas.toDataURL("image/png", 1.0);

		var flexVal = 12.0;
		var aspectRatio = 16.0/12.0;
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

		canvas.style.marginLeft = (gameContainer.clientWidth-resizeWidth)/2 + 'px';
		canvas.style.marginTop = (gameContainer.clientHeight-resizeHeight)/2 + 'px';


		var image = new Image();
		image.src = dataURL;
		image.onload = function() {
			context.drawImage(image, 0, 0, canvas.width, canvas.height);
		};
};