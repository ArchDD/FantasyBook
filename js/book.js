
//when the document is ready
$(document).ready(function() {
    var canvases = {};
    initialiseBookshelf();
    function initialiseBookshelf() {
        //Texture container
        var textures = {
            leather : new Image()
        };
        textures.leather.src = "../images/leather_grey.png";
        //loaded texture counter
        var loadedTextures = 0;
        //Canvas container


        //For each loaded texture, create a canvas of the same size and draw it
        $.each(textures, function(i,tex) {
            $('#hidden-textures').append(tex);
            tex.onload = function() {
                canvases[i] = $("<canvas/>");
                canvases[i]
                    .attr('width', tex.width)
                    .attr('height', tex.height)
                    .addClass('bookiewookie')
                    .attr('id', i);

                //Draw texture onto canvas
                canvases[i].get(0).getContext('2d').drawImage(tex,0,0);
                loadedTextures++;
                //when all textures are loaded
                if(loadedTextures == Object.keys(textures).length) {
                    populateBooks();
                }

            }
        });
    }
    //Populate the shelf with previously saved books
    function populateBooks() {
        //Example Books
        var books = [
        {spineText: 'Lord of the Rings', height: 400, width: 96, colour: '#2a6f41', texture: canvases['leather']},
        {spineText: "Alice in Wonderland", height: 400, width: 48, colour: '#42548a', texture: canvases.leather},
        {spineText: "A Hitchhiker's Guide to the Galaxy", height: 400, width: 36, colour: '#661919', texture: canvases.leather},
        {spineText: "Morte", height: 400, width: 60, colour: '#603939', texture: canvases.leather},
        {spineText: "Coraline", height: 400, width: 50, colour: '#4d3960', texture: canvases.leather}
        ];
        //Create each example 
        $.each(books, function(i,book) {
            $('#bookshelf').append(createNewBook(book));
        });
    }

});

function createNewBook(settings) {
    //default settings
    settings = $.extend(true, {
        height: 300,
        width: 48,
        spineText: "",
        colour: "#02B8Be"
    }, settings);

    //get height of the shelf
    var shelfHeight = $('#bookshelf').height();
    //create text and book elements
    var $text = $('<span class="spineText unselectable">'+settings.spineText+'</span>');
    var $book = $('<div class="book"/>');
    //apply book settings
    $book.height(settings.height);
    $book.width(settings.width);
    //position the book relative to the shelf
    $book.offset({top:shelfHeight - settings.height});

    var canvas = document.createElement('canvas');
    canvas.className = 'canvas-texture';
    canvas.width = settings.width;
    canvas.height = settings.height;

    var context = canvas.getContext('2d');
    //create gradient, with black shadow on left hand side
    var gradient = context.createLinearGradient(0,0,settings.width,0);
    gradient.addColorStop(0,"black");
    gradient.addColorStop(0.1,settings.colour);
    gradient.addColorStop(0.9,settings.colour);
    gradient.addColorStop(1,"black");

    //fill the book with the gradient colour
    context.fillStyle = gradient;


    $book.append(canvas);
    //draw the book
    context.fillRect(0,0,settings.width,settings.height);
    //overlay the book texture
    settings.texture.get(0).getContext('2d').blendOnto(context,'overlay');

    $book.append($text);
    return $book;
}