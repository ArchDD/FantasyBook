// initialise when document is ready
$(document).ready(function() {
    init();
  });

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
		//gameContainer.style.fontSize = (resizeWidth / 400) + 'em';
		draw();
	}

draw = function() {
	var characterCreator = document.getElementById("character-creator");
	var context = characterCreator.getContext("2d");
	var image = new Image();

	image.onload = function() {
		console.log("Loaded image");
		context.drawImage(image, 0, 0, characterCreator.width,characterCreator.height);
	}

	image.src = "../images/bg.jpg"
}

init = function() {
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas, false);
	draw();
}