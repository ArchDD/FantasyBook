// initialise when document is ready
$(document).ready(function() {
    init();
  });

init = function() {
	var characterCreator = document.getElementById("character-creator");
	var context = characterCreator.getContext("2d");
	//context.fillStyle = "#FF0000";
	//context.fillRect(0,0,characterCreator.width,characterCreator.height);
	var image = new Image();

	image.onload = function() {
		console.log("Loaded image");
		context.drawImage(image, 0, 0, characterCreator.width,characterCreator.height);
	}

	image.src = "../images/logo.svg"
}