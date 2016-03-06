
//when the document is ready
$(window).on("load", function() {
    // call initial window resize function
    resizeBooks();
    // add event to listen for future window resizes
    window.addEventListener('resize', resizeBooks, false);

    var canvases = {};
    initialiseBookshelf();

    function resizeBooks() {
        var mainHeight = $("#main").height();
        var $flipbook = $("#flipbook");

        $flipbook.css({ height:8 * mainHeight/10,
                        top:mainHeight/10
                     });

        for (var key in books) {
            var $book = $("#"+key);
            var shelfHeight = $('#bookshelf').height();
            $book.css({top:shelfHeight - $book.height()});
        }
    }

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

    var books = {
        "Lord-of-the-Rings" : {
            height: 400, width: 96, colour: "#2a6f41", texture: "leather"
        },
        "Alice-in-Wonderland" : {
            height: 400, width: 48, colour: '#42548a', texture: "leather"
        },
        "A-Hitchhikers-Guide-to-the-Galaxy" : {
            height: 400, width: 36, colour: '#661919', texture: "leather"
        },
        "Coraline" : {
            height: 400, width: 50, colour: '#4d3960', texture: "leather"
        }
    }

    //Populate the shelf with previously saved books
    function populateBooks() {
        //Create each example 
        for (var key in books) {
            //console.log($('#bookshelf').height());
            $('#bookshelf').append(createNewBook(key, books[key]));
        }
    }

    // Attach mouse over event for books created at runtime
    /*
    $('body').on('mouseover mouseout', '.book', function() {
        console.log("HEY!");
    })
    */

    var bookIsOpen = false;
    // Open flipbookon book click
    $("body").on("click", ".book", function() {
        if(!bookIsOpen) {
            bookIsOpen = true;
            // Make flipbook visible
            $("#flipbook-container").css("display","flex");
            $("#flipbook-container").css("visibility","visible");
            $("#bookshelf-container").css("display","none");
            $("#bookshelf-container").css("visibility","hidden");
            resizeBooks();
            // Set title to book title
            //var front_cover = document.getElementById("front_cover");
            //front_cover.innerHTML = this.id;
            // Set colour to book colour
            //$('.hard').css("background",books[this.id].colour);
            //$('.hard').css("background","rgba(0,0,0,1)");
            var settings = books[this.id];
            settings.width = 800;
            settings.height = 450;

            //$('.hard').append(createBookCanvas(settings));
            // Load content

        }
    });

    function createBookCanvas(settings) {
        var canvas = document.createElement('canvas');
        canvas.className = 'canvas-texture';
        canvas.width = settings.width;
        canvas.height = settings.height;

        var context = canvas.getContext('2d');
        //create gradient, with black shadows on either side
        var gradient = context.createLinearGradient(0,0,settings.width,0);
        gradient.addColorStop(0,"black");
        gradient.addColorStop(0.1,settings.colour);
        gradient.addColorStop(0.9,settings.colour);
        gradient.addColorStop(1,"black");

        //fill the book with the gradient colour
        context.fillStyle = gradient;

        //draw the book
        context.fillRect(0,0,settings.width,settings.height);
        //overlay the book texture
        canvases[settings.texture].get(0).getContext('2d').blendOnto(context,'overlay');

        return canvas;
    }

    function createNewBook(key, settings) {
        //default settings
        settings = $.extend(true, {
            height: 300,
            width: 48,
            spineText: key,
            colour: "#02B8Be"
        }, settings);

        //get height of the shelf
        var shelfHeight = $('#bookshelf').height();
        //create text and book elements
        var $text = $('<span class="spineText unselectable">'+settings.spineText+'</span>');
        var $book = $('<div class="book" id="'+settings.spineText+'"/>');
        //apply book settings
        $book.height(settings.height);
        $book.width(settings.width);
        //position the book relative to the shelf
        $book.offset({top:shelfHeight - settings.height});
        // Append book graphics
        $book.append(createBookCanvas(settings));
        // Append book spine text
        $book.append($text);

        return $book;
    }
});

