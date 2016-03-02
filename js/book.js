
$(function() {
    //Texture container
    var textures = {
        leather : new Image()
    };
    textures.leather.src = "../images/leather_greyscale.png";
    //loaded texture counter
    var loadedTextures = 0;
    //Canvas container
    var canvases = {};

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

    function populateBooks() {
        //Example Books
        var books = [
        {spineText: 'Lord of the Rings', height: 400, width: 96, colour: 'green', texture: canvases['leather']},
        {spineText: "Alice in Wonderland", height: 320, width: 48, colour: 'blue', texture: canvases.leather},
        {spineText: "A Hitchhiker's Guide to the Galaxy", height: 370, width: 36, colour: 'orange', texture: canvases.leather},
        {spineText: "Morte", height: 250, width: 60, colour: 'grey', texture: canvases.leather},
        {spineText: "Coraline", height: 400, width: 50, colour: 'violet', texture: canvases.leather}
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
    var $text = $('<span class="spineText">'+settings.spineText+'</span>');
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
    context.fillStyle = settings.colour;

    $book.append(canvas);
    //fill colour
    context.fillRect(0,0,settings.width,settings.height);
    //overlay texture
    settings.texture.get(0).getContext('2d').blendOnto(context,'overlay');

    $book.append($text);
    return $book;
}