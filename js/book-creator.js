"use strict";

var players = 1;

function addPlayer() {
    players++;
    var $row=$('<p> Player'+players+': <input type="text" name="player" maxlength="32" class = "form-field"/></p>');
    $row.insertAfter('#add-players p:last-child');
}