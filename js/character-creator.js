// character class
character = function() {
	this.characterName = "";
	this.ownerName = "";

	this.hair = {type: "medium", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.nose = {type: "default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.lash = {type: "default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.brow = {type: "default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.socket = {type: "default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.pupil = {type: "default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.mouth = {type: "feminine", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.cheek = {type: "default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.ear = {type: "default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.chin = {type: "default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.head = {type: "default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};
	this.neck = {type: "default", hueShift: 0, 
				xOffset: 0, yOffset: 0, xScale: 1, yScale: 1};

	this.features = [this.neck, this.head, this.chin, this.ear, 
					/*this.cheek,*/ this.mouth, this.pupil, this.socket, 
					this.brow, this.lash, this.nose, this.hair];
}

// character instance
var myCharacter = new character();

// variables //
var characterAspectRatio = 191.2/236;

// images to load
var backgroundImages = [
    "../images/bg.jpg"
];

// appearance list
var hairList = ["medium", "short"];
var mouthList = ["masculine", "feminine"]

// cached asset management using dictionary
var cachedImages = {};

// initialise when document is ready
$(document).ready(function() {
    init();
  });

init = function() {

	// resizing listeners for responsive canvas
	resizeAll();
	window.addEventListener('resize', function() {
    	resizeAll();
	}, false);

	/*loadImages(backgroundImages, function() {
		for (var i = 0; i < backgroundImages.length; i++) 
			draw(characterCreator, backgroundImages[i], characterCreator.width/2, characterCreator.height/2, characterCreator.width, characterCreator.height);
	});*/
	setupUI();
};

// required for IE8 since it does not support indexOf
getIndex = function(val, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] == val) {
            return i;
        }
    }
}

setupUI = function() {
	// UI listeners
	document.getElementById("previous-hair").addEventListener('click', function(event) {
		var i = getIndex(myCharacter.hair.type, hairList)-1;
		// mod in range
		i = ((i % hairList.length) + hairList.length) % hairList.length;
		myCharacter.hair.type = hairList[i];
		drawCharacter();
	});

	document.getElementById("next-hair").addEventListener('click', function(event) {
		var i = getIndex(myCharacter.hair.type, hairList)+1;
		// mod in range
		i = ((i % hairList.length) + hairList.length) % hairList.length;
		myCharacter.hair.type = hairList[i];
		drawCharacter();
	});
}

placeUI = function(canvas) {
	// clearing
	var ui = document.querySelectorAll('#ui')[0];
	ui.style.width = '0px';
	ui.style.height = '0px';
	var rect = canvas.getBoundingClientRect();
	console.log(rect.top, rect.right, rect.bottom, rect.left);

	// size ui
	ui.style.width = canvas.width/2+'px';
	ui.style.height = canvas.height+'px';
	ui.style.left = rect.left+'px';
	ui.style.top = rect.top+'px';
}

drawCharacter = function()
{	
	var canvas = document.getElementById("character");
	var character = myCharacter;
	var x = canvas.width/1.3;
	var y = canvas.height/2;
	var width = characterAspectRatio*(canvas.height/1.4);
	var height = (canvas.height/1.4);

	var context = canvas.getContext("2d");
	// clear only the section drawn on
	context.clearRect(x-width,y-height,x+width,y+height);

	// images to load
	var characterImages = [
		"../images/character/neck_"+character.neck.type+".png",
		"../images/character/head_"+character.head.type+".png",
		"../images/character/chin_"+character.chin.type+".png",
		"../images/character/ear_"+character.ear.type+".png",
		"../images/character/cheek_"+character.cheek.type+".png",
		"../images/character/mouth_"+character.mouth.type+".png",
		"../images/character/pupil_"+character.pupil.type+".png",
		"../images/character/socket_"+character.socket.type+".png",
		"../images/character/brow_"+character.brow.type+".png",
		"../images/character/lash_"+character.lash.type+".png",
		"../images/character/nose_"+character.nose.type+".png",
		"../images/character/hair_"+character.hair.type+".png"];

	var featuresPrefixes = ["neck_", "head_", "chin_", "ear_", "mouth_", "pupil_", "socket_", "brow_", "lash_", "nose_", "hair_"];
	console.log(character.features[0]);

	loadImages(characterImages, function() {
		for (var i = 0; i < character.features.length; i++)
		{
			console.log("aaa: "+"../images/character/"+featuresPrefixes[i]+character.features[i].type+".png");
			draw(canvas, 
				"../images/character/"+featuresPrefixes[i]+character.features[i].type+".png",
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

resizeAll = function()
{
	var characterCreator = document.getElementById("character-creator");
	var characterCanvas = document.getElementById("character");
	var previousWidth = characterCanvas.width;

	resizeCanvas(characterCreator);
    var obj = resizeCanvas(characterCanvas);
    var resizeWidth = obj.resizeHeight;
    var dataURL = obj.dataURL;

    // redraw is scaling up, otherwise reuse context
	if (previousWidth > resizeWidth)
	{
		var image = new Image();
		image.src = dataURL;
		image.onload = function() {
			context.drawImage(image, 0, 0, canvas.width, canvas.height);
		};
	}
	else
	{
		drawCharacter();
	}

	placeUI(characterCreator);
}

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

		return {resizeWidth, dataURL};
};