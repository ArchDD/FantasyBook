
//when the document is ready
$(window).on("load", function() {

    var bookIsOpen = false;
    var pageNumber = 0;
    var currentBook = null;
    var isSinglePage = false;

    // call initial window resize function
    resizeBooks();
    // add event to listen for future window resizes
    window.addEventListener('resize', resizeBooks, false);

    var canvases = {};
    initialiseBookshelf();

    function resizeBooks() {

        var mainHeight = $("#main").height();
        var mainWidth = $("#main").width();

        if(bookIsOpen) {
            if(window.screen.width < 800)
                changeToSinglePage(currentBook);
            else
                changeToDoublePage(currentBook);

            var $flipbook = $("#flipbook");

            $flipbook.css({ height:7 * mainHeight/10,
                            top:1.5*mainHeight/10
                         });
        } else {
            for (var key in books) {
                var $book = $("#"+key);
                //$book.removeClass("book-transition"); // dont animate css changes
                $book.removeClass("book-transition"); // renable transitions
                $book.addClass("no-transition"); // set transitions to none.
                var shelfHeight = $('#bookshelf').height();
                $book.css({top:shelfHeight - $book.height()});
                $book[0].offsetHeight; // causes css changes to be applied
                $book.removeClass("no-transition"); // renable transitions
                $book.addClass("book-transition");
            }
            
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
        "book1" : {
            bookTitle: "Lord of the Rings", desc: "[Theme description]", pages: 5, height: 400, width: 96, colour: "#2a6f41", texture: "leather"
        },
        "book2" : {
            bookTitle: "Alice in Wonderland", desc: "[Theme description]", pages: 5, height: 400, width: 48, colour: '#42548a', texture: "leather"
        },
        "book3" : {
            bookTitle: "The Colour of Magic", desc: "[Theme description]", pages: 5, height: 400, width: 36, colour: '#661919', texture: "leather"
        },
        "book4" : {
            bookTitle: "Coraline", desc: "[Theme description]", pages: 5, height: 400, width: 50, colour: '#4d3960', texture: "leather"
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

    // Open flipbook and exit book shelf
    $("body").on("click", ".book", function() {
        if(!bookIsOpen) {

            bookIsOpen = true;
            currentBook = books[this.id];
            resizeBooks();

            if(isSinglePage)
                loadFirstPageSingle(currentBook);
            else
                loadFirstPage(currentBook);

            // Make flipbook visible
            $("#flipbook-container").css("display","flex");
            $("#flipbook-container").css("visibility","visible");
            $("#bookshelf-container").css("display","none");
            $("#bookshelf-container").css("visibility","hidden");
        }
    });

    $("body").on("click", "#right_page", function(e) {
        if(!isSinglePage)
            nextPage();
        else
            changePageSingle(e);
    });

    $("body").on("click", "#left_page", function(e) {
        previousPage();
    });

    function updatePage(pageId, book, pageNumber) {
        if(pageNumber == 0 || pageNumber == book.pages) {
            $(pageId+" .page-title").html("");
            $(pageId+" .page-content").html("");
            $(pageId+" .page-number").html("");
            $(pageId+" .page-image").hide();
        }
        else {
            $(pageId+" .page-title").html(getEventTitle(currentBook, pageNumber));
            $(pageId+" .page-content").html(getEventContent(currentBook, pageNumber));
            $(pageId+" .page-number").html(pageNumber);
            $(pageId+" .page-image").show();
        }
        
    }

    function loadFirstPage(book) {
        pageNumber = 0;
        $("#left_page .page-title").hide();
        $("#left_page .page-image").hide();

        $("#left_page .page-content").html("");
        $("#left_page .page-number").html("");

        // Write title
        $("#right_page .page-title").html(book.bookTitle);
        // write book description
        $("#right_page .page-content").html(book.desc);
        $("#right_page .page-number").html(pageNumber+1);
    }

    function loadFirstPageSingle(book) {
        pageNumber = 1;
        // Write title
        $("#right_page .page-title").html(book.bookTitle);
        // write book description
        $("#right_page .page-content").html(book.desc);
        $("#right_page .page-number").html(pageNumber);
    }

    function changeToSinglePage(book) {
        $("#left_page").hide();
        isSinglePage = true;
        $(".page").css({width:"100%"});
        if(bookIsOpen) {
            if(pageNumber == 0) {
                pageNumber = 1;
            }
            if(pageNumber == 1) {
                loadFirstPageSingle(book);
            } else {
                updatePage("#right_page",book,pageNumber);
            }
        }
    }

    function changeToDoublePage(book) {
        $("#left_page").show();
        isSinglePage = false;
        $(".page").css({width:"50%"});
        if(bookIsOpen) {
            if(pageNumber%2 == 1)
                pageNumber -= 1;
            if(pageNumber == 0) {
                loadFirstPage(book);
            } else {
                $("#left_page .page-title").show();
                $("#left_page .page-image").show();
                updatePage("#left_page",book,pageNumber);
                updatePage("#right_page",book,pageNumber+1);
            }
        }
    }

    // Go to next or previous page in single page format
    function changePageSingle(event, element) {
        var clickPos = event.pageX;
        var $page = $("#right_page");
        var pageWidth = $page.width();
        var leftOffset = $page.offset().left;
        var threshold = leftOffset+pageWidth/2;

        if(clickPos > threshold) {
            // If there are more pages left
            if(pageNumber + 1 < currentBook.pages) {
                pageNumber += 1;
                // get new page
                updatePage("#right_page",currentBook,pageNumber);
            }
        }
        else {
            // If it is not at the start
            if (pageNumber -1 > 0) {
                pageNumber -= 1;

                // special case for first page
                if(pageNumber == 1) {
                    loadFirstPageSingle(currentBook);
                }
                // otherwise
                else {
                    updatePage("#right_page",currentBook,pageNumber);
                }
            }
        }

    }

    // Change page content to next page
    function nextPage() {
        // If there are more pages left
        if(pageNumber + 2 < currentBook.pages) {
            pageNumber += 2;
            // show left title and image
            $("#left_page .page-title").show();
            $("#left_page .page-image").show();

            // Update content of the left page
            // Contact server to get either new event, saved result, or empty string
            updatePage("#left_page",currentBook,pageNumber);
            updatePage("#right_page",currentBook,pageNumber+1);
        }
    }

    // Change page content to previous page
    function previousPage() {
        // If it is not at the start
        if (pageNumber -2 >= 0) {
            pageNumber -= 2;

            $("#right_page .page-image").show();
            // special case for first page
            if(pageNumber == 0) {
                loadFirstPage(currentBook);
            }
            // otherwise
            else {
                // update left page
                updatePage("#left_page",currentBook,pageNumber);
                updatePage("#right_page",currentBook,pageNumber+1);
            }
        }
    }


    // Do not propagate click to the flipbook container beneath
    $("body").on("click", "#flipbook", function(e) {
        e.stopPropagation();
    });

    // Exit flipbook and return to book shelf
    $("body").on("click", "#flipbook-container", function() {
        if(bookIsOpen) {
            bookIsOpen = false;
            // Make flipbook visible
            $("#flipbook-container").css("display","none");
            $("#flipbook-container").css("visibility","hidden");
            $("#bookshelf-container").css("display","flex");
            $("#bookshelf-container").css("visibility","visible");
            resizeBooks();
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
            bookTitle: key,
            colour: "#02B8Be"
        }, settings);

        //get height of the shelf
        var shelfHeight = $('#bookshelf').height();
        //create text and book elements
        var $text = $('<span class="spineText unselectable">'+settings.bookTitle+'</span>');
        var $book = $('<div class="book book-transition" id="'+key+'"/>');
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

    // contacts server to get the event name for the page
    function getEventTitle(book, pageNumber) {
        return "Event";
    }

    // contacts server to get either an event description or past event result
    function getEventContent(book, pageNumber) {
        return "Event description";
    }

    // contacts server to get active status of the event 
    function isEventComplete(book, pageNumber) {
        return "False";
    }

    // contacts server to get active status of the event 
    function getEventChoices(book, pageNumber) {

        var choices = {
            choice1 : "Go",
            choice2 : "Leave"
        }

        return choices;
    }

});

