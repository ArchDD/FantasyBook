"use strict";

// character class
 function character() {
    this.characterName = "";
    this.ownerName = "";
    this.c_id;

    this.hair = {type: "1", hueShift: 0, 
                yOffset: 0, scale: 1};
    this.nose = {type: "1", hueShift: 0, 
                yOffset: 0, scale: 1};
    this.lash = {type: "1", hueShift: 0, 
                yOffset: 0, scale: 1};
    this.brow = {type: "1", hueShift: 0, 
                yOffset: 0, scale: 1};
    this.socket = {type: "1", hueShift: 0, 
                yOffset: 0, scale: 1};
    this.pupil = {type: "1", hueShift: 0, 
                yOffset: 0, scale: 1};
    this.mouth = {type: "1", hueShift: 0, 
                yOffset: 0, scale: 1};
    this.cheek = {type: "1", hueShift: 0, 
                yOffset: 0, scale: 1};
    this.ear = {type: "1", hueShift: 0, 
                yOffset: 0, scale: 1};
    this.chin = {type: "1", hueShift: 0, 
                yOffset: 0, scale: 1};
    this.head = {type: "1", hueShift: 0, 
                yOffset: 0, scale: 1};
    this.neck = {type: "1", hueShift: 0, 
                yOffset: 0, scale: 1};

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
    "images/bg.jpg"
];

// appearance list
var hairList = ["1", "2"];
var mouthList = ["1", "2"]

// cached asset management using dictionary
var cachedImages = {};

// initialise when document is ready
document.addEventListener("DOMContentLoaded", function(event) {
    // retrieve character information from server
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/character-creator.html?action=get_character", true);
    xhr.send();
    xhr.onreadystatechange = setCharacter; 
    function setCharacter(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var c_info = JSON.parse(xhr.responseText || "null");
            console.log(c_info);
            readCharacterInfo(c_info);
            init();
        }
    }
});

function readCharacterInfo(c_info) {
    myCharacter.c_id = c_info['c_id'];
    myCharacter.characterName = c_info['name'];
    myCharacter.ownerName = c_info['username'];

    myCharacter.hair.type = c_info['hair_type'].toString();
    //myCharacter.eye.type = c_info['eye_type'].toString();
    myCharacter.nose.type = c_info['nose_type'].toString();
    myCharacter.mouth.type = c_info['mouth_type'].toString();
    myCharacter.head.type = c_info['head_type'].toString();
}

// Aspect ratio information for resizing
var oldAspectRatio;
function init() {
	// decide initial aspect ratio
	var gameContainer = document.getElementById("main");
	oldAspectRatio = gameContainer.clientWidth/gameContainer.clientHeight;
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
function getIndex(val, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] == val) {
            return i;
        }
    }
}

function setupUI() {
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

function placeUI(canvas) {
	// clearing
	var ui = document.querySelectorAll('#ui')[0];
	ui.style.width = '0px';
	ui.style.height = '0px';
	var rect = canvas.getBoundingClientRect();

	// size ui
	ui.style.width = canvas.width/2+'px';
	ui.style.height = 16*canvas.height/20+'px';
	ui.style.left = rect.left+'px';
	ui.style.top = rect.top+canvas.height/20+'px';
}

function drawCharacter()
{	
	var canvas = document.getElementById("character");
	var character = myCharacter;
	var x = canvas.width/1.3;
	var y = canvas.height/2;
	var width = characterAspectRatio*(canvas.height/1.4);
	var height = (canvas.height/1.4);

	var context = canvas.getContext("2d");
	// clear only the div drawn on
	context.clearRect(x-width,y-height,x+width,y+height);

	// images to load
	var characterImages = [
		"images/character/neck_"+character.neck.type+".png",
		"images/character/head_"+character.head.type+".png",
		"images/character/chin_"+character.chin.type+".png",
		"images/character/ear_"+character.ear.type+".png",
		"images/character/cheek_"+character.cheek.type+".png",
		"images/character/mouth_"+character.mouth.type+".png",
		"images/character/pupil_"+character.pupil.type+".png",
		"images/character/socket_"+character.socket.type+".png",
		"images/character/brow_"+character.brow.type+".png",
		"images/character/lash_"+character.lash.type+".png",
		"images/character/nose_"+character.nose.type+".png",
		"images/character/hair_"+character.hair.type+".png"];

	var featuresPrefixes = ["neck_", "head_", "chin_", "ear_", "mouth_", "pupil_", "socket_", "brow_", "lash_", "nose_", "hair_"];

	loadImages(characterImages, function() {
		for (var i = 0; i < character.features.length; i++)
		{
			draw(canvas, 
				"images/character/"+featuresPrefixes[i]+character.features[i].type+".png",
				y+character.features[i].yOffset,
				width*character.features[i].scale, 
				height*character.features[i].scale);
		}

	});
}


function loadImages(srcList, callback) {
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

function draw(canvas, src, y, width, height) {
	var context = canvas.getContext("2d");
	context.drawImage(cachedImages[src], width*1.5, y-height/2, width, height);
};

function resizeAll()
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
function resizeCanvas(canvas) {
		canvas.style.marginLeft = "0px";
		canvas.style.marginTop = "0px";
		var gameContainer = document.getElementById("main");
		var context = canvas.getContext("2d");
		var dataURL = canvas.toDataURL("image/png", 1.0);

		//var aspectRatio = gameContainer.clientWidth/gameContainer.clientHeight;
		var resizeWidth = gameContainer.clientWidth;
		var resizeHeight = gameContainer.clientHeight;
		var newAspectRatio = resizeWidth/resizeHeight;

		// resize, retaining aspect ratio
		if (newAspectRatio > oldAspectRatio) {
			// shrink by width
			resizeWidth = resizeHeight * oldAspectRatio;
		} else {
			// shrink by height
			resizeHeight = resizeWidth / oldAspectRatio;
		}
	
		canvas.width = resizeWidth;
		canvas.height = resizeHeight;

		canvas.style.marginLeft = (gameContainer.clientWidth-resizeWidth)/2 + 'px';
		canvas.style.marginTop = (gameContainer.clientHeight-resizeHeight)/2 + 'px';

		var obj = {resizeWidth: resizeWidth, dataURL: dataURL};
		return obj;
}

function validateText(str, minLength, maxLength) {
    var reg = new RegExp("^(?=.*([a-z]|[A-Z]|d)).{"+minLength.toString()+","+maxLength.toString()+"}$");
    return reg.test(str);
}

function submitCharacter() {
    var c_id = myCharacter.c_id;
    var name = document.forms["character-form"]["name"].value;;
    var hair_type = myCharacter.hair.type;
    //var eye_type = myCharacter.eye.type;
    var nose_type = myCharacter.nose.type;
    var mouth_type = myCharacter.mouth.type;
    var head_type = myCharacter.head.type;

    if (!validateText(name, 1, 64)) {
        alert("Character names must be between 1 to 64 characters and consist of lowercase, uppercase, or numerical characters.");
    } else {
        var xhr = new XMLHttpRequest();
        var params = "c_id="+c_id+"&name="+name+"&hair_type="+hair_type+"&nose_type="+nose_type+"&mouth_type="+mouth_type+"&head_type="+head_type;
        console.log(params);
        xhr.open('POST', "/character-creator.html?action=submit", true);
        xhr.send(params);
        xhr.onreadystatechange = onSubmit;
        function onSubmit(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var r = JSON.parse(xhr.responseText || "null");
                var result = r['result'];
                console.log("result is "+result);
                if (!result)
                {
                    alert("Update failed.");
                }
            }
        }
    }
}