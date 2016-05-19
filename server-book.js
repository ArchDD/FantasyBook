var exports = module.exports = {};

exports.getBooks = function () {
    var books = {
        "book1" : {
            bookTitle: "Chasing Centaurs", desc: "[Theme description]", pages: 5, height: 400, width: 70, colour: "#2a6f41", texture: "leather"
        },
        "book2" : {
            bookTitle: "Into Space", desc: "[Theme description]", pages: 5, height: 400, width: 70, colour: '#42548a', texture: "leather"
        },
        "book3" : {
            bookTitle: "A Murder Mystery", desc: "[Theme description]", pages: 5, height: 400, width: 70, colour: '#661919', texture: "leather"
        },
        "book4" : {
            bookTitle: "The Adventures of Me", desc: "[Theme description]", pages: 5, height: 400, width: 70, colour: '#4d3960', texture: "leather"
        }
    };
    return books;
};

exports.getEvent = function () {
    return {
        "eventName" : "DRAGONS!??!?!",
        "eventDesc" : "A dragon nest has been left empty! You spot eggs. What to do?!"
    };
}