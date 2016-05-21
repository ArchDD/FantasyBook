"use strict";

//when the document is ready
$(window).on("load", function() {
    
    var books = {};
    var bookIsOpen = false;
    var pageNumber = 0;
    var currentBook = null;
    var isSinglePage = false;
    var canvases = {};
    //Texture container
    var textures = {
        leather : new Image()
    };
    textures.leather.src = "images/leather_grey.png";

    $.get("?action=get_books&uniqueId="+Math.random(), function(data, status){
        books = data;
        // call initial window resize function
        resizeBooks();
        // add event to listen for future window resizes
        window.addEventListener('resize', resizeBooks, false);

        initialiseBookshelf();
    });

    function resizeBooks() {
        var mainHeight = $("#main").height();
        var mainWidth = $("#main").width();

        if(bookIsOpen) {
            if(window.screen.width < 600 || mainWidth < 600)
                changeToSinglePage(currentBook);
            else
                changeToDoublePage(currentBook);

            var $flipbook = $("#flipbook");

            $flipbook.css({ height:7 * mainHeight/10,
                            top:1.5*mainHeight/10
                         });
        } else {

            // resize all books other than book creator book
            for (var key in books) {
                var $book = $("#"+key);
                resizeBook($book,0);
            }
            // resize the book creator book
            var $addBook = $("#addBook");
            resizeBook($addBook, 6);
        }
    }

    function resizeBook(book, border) {
        book.removeClass("book-transition"); // remove transitions
        book.addClass("no-transition"); // set transitions to none.
        var shelfHeight = $('#bookshelf').height();
        book.css({top:shelfHeight - (book.height()+border)});
        book.height(); // causes css changes to be applied
        book.removeClass("no-transition"); // renable transitions
        book.addClass("book-transition");
    }

    function initialiseBookshelf() {
        
        //loaded texture counter
        var loadedTextures = 0;
        //For each texture
        $.each(textures, function(i,tex) {
            $('#hidden-textures').append(tex);
            tex.onload = function() {
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
        for (var key in books) {
            // insert books before the 'new book' template
            createNewBook(key, books[key]).insertBefore($("#addBook"));
        }
    }

    // Update and load pages on page turn.
    function updatePages(book, pageNumber) {
        // not in single page mode, update left element   
        if(!isSinglePage) {
            setPageEvents(currentBook,pageNumber,"#left_page");
            setPageEvents(currentBook,pageNumber+1,"#right_page");
        }
        // single page mode, update right element
        else {
            setPageEvents(currentBook,pageNumber,"#right_page");
        }
    }

    function setPageEvents(book, requestPageNum,pageId) {
        if(requestPageNum <= book.pages) {
            $.get("?action=get_event&book="+book['bookId']+"&page="+requestPageNum+"&uniqueId="+Math.random(),function(data, status){
                if(requestPageNum == pageNumber || requestPageNum == pageNumber + 1) {
                    $(pageId+" .page-title").html(data['eventName']);
                    $(pageId+" .page-content").html(data['eventDesc']);
                    $(pageId+" .page-number").html(requestPageNum);
                    $(pageId+" .page-image").show();

                    // if the event choice has not been made
                    if(!data['isCompleted']) {
                        $(pageId+" .choice-buttons:nth-child(1)").html(data['choice1']);;
                        $(pageId+" .choice-buttons:nth-child(2)").html(data['choice2']);
                        $(pageId+" .page-choices").show();
                    // otherwise the event is incomplete
                    } else {
                        $(pageId+" .page-choices").hide();
                    }
                    
                }
            });
        } else {
            setBlankPage(pageId);
        }
    }

    function setBlankPage(pageId) {
        $(pageId+" .page-title").html("");
        $(pageId+" .page-choices").hide();
        $(pageId+" .page-image").hide();

        $(pageId+" .page-content").html("");
        $(pageId+" .page-number").html("");
    }

    function loadFirstPage(book) {
        pageNumber = 0;
        $("#left_page .page-title").hide();
        $("#left_page .page-choices").hide();
        $("#left_page .page-image").hide();

        $("#left_page .page-content").html("");
        $("#left_page .page-number").html("");

        // Write title
        $("#right_page .page-title").html(book.bookTitle);
        // write book description
        $("#right_page .page-content").html(book.desc);
        $("#right_page .page-number").html(pageNumber+1);
        $("#right_page .page-choices").hide();
        $("#right_page .page-image").hide();
    }

    function loadFirstPageSingle(book) {
        pageNumber = 1;
        // Write title
        $("#right_page .page-title").html(book.bookTitle);
        // write book description
        $("#right_page .page-content").html(book.desc);
        $("#right_page .page-number").html(pageNumber);
        $("#right_page .page-choices").hide();
        $("#right_page .page-image").hide();
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
                updatePages(book,pageNumber);
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
                updatePages(book,pageNumber);
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
                updatePages(currentBook,pageNumber);
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
                    updatePages(currentBook,pageNumber);
                }
            }
        }

    }

    // Change page content to next page
    function nextPage() {
        console.log(currentBook.pages+","+pageNumber);
        // If there are more pages left
        if(pageNumber+1 < currentBook.pages) {
            pageNumber += 2;
            // show left title and image
            $("#left_page .page-title").show();
            $("#left_page .page-image").show();

            // Update content of the left page
            // Contact server to get either new event, saved result, or empty string
            updatePages(currentBook,pageNumber);
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
                // update pages
                updatePages(currentBook,pageNumber);
            }
        }
    }

    function makeChoice(choice) {
        $.get(
            "?action=event_choice"+
            "&book="+currentBook['bookId']+
            "&choice="+choice+
            "&uniqueId="+Math.random(),
            function(data, status){
                //update pages to reflect new book state
                currentBook.pages = data['pages'];
                updatePages(currentBook,pageNumber);
        });
    }

    // Does not propagate click to the flipbook beneath
    $("body").on("click", ".choice-buttons.choice-1", function(e) {
        makeChoice(1);
        e.stopPropagation();
    });

    // Does not propagate click to the flipbook beneath
    $("body").on("click", ".choice-buttons.choice-2", function(e) {
        makeChoice(2);
        e.stopPropagation();
    });

    // right page clicked
    $("body").on("click", "#right_page", function(e) {
        // go forward if not single page mode
        if(!isSinglePage)
            nextPage();
        // otherwise go back or forwards depending on mouse position (in e)
        else
            changePageSingle(e);
    });

    // if the left page is clicked, turn back a page
    $("body").on("click", "#left_page", function(e) {
        previousPage();
    });

    // Does not propagate click to the flipbook container beneath
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

    // Draw book canvas
    function createBookCanvas(settings) {
        var tex = textures.leather;
        var drawCanvas = document.createElement("canvas");
        drawCanvas.className = "canvas-texture";
        drawCanvas.width = settings.width;
        drawCanvas.height = settings.height;
        var drawContext = drawCanvas.getContext("2d");

        var gradient = drawContext.createLinearGradient(0,0,settings.width,0);
        gradient.addColorStop(0,"black");
        gradient.addColorStop(0.1,settings.colour);
        gradient.addColorStop(0.9,settings.colour);
        gradient.addColorStop(1,"black");

        drawContext.drawImage(tex,0,0);

        drawContext.globalCompositeOperation = "overlay";
        //fill the book with the gradient colour
        drawContext.fillStyle = gradient;

        //draw the book
        drawContext.fillRect(0,0,settings.width,settings.height);

        return drawCanvas;
    }

    // Create book elements and add to shelf
    function createNewBook(key, settings) {
        //default settings
        settings = $.extend(true, {
            height: 400,
            width: 70,
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


});

