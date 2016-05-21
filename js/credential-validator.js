"use strict";

function minimumLength(str, length) {
    if (str.length < length)
        return false;
    return true;
}

function number(str, length) {
    var regStr = "[0-9]{"+length.toString()+"}";
    var reg = new RegExp(regStr);
    var invalid = reg.test(str);
    if (invalid)
        return false;
    return true;
}

function validatePassword(str, minLength, maxLength) {
    var reg = new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{"+minLength.toString()+","+maxLength.toString()+"}$");
    return reg.test(str);
}

function validateText(str, minLength, maxLength) {
    var reg = new RegExp("^(?=.*([a-z]|[A-Z]|d)).{"+minLength.toString()+","+maxLength.toString()+"}$");
    return reg.test(str);
}

function validateLogin()
{
    var username = document.forms["login"]["login-username"].value;
    if (validateText(username, 4, 32)) {
        // POST FORM
    }
    else
    {
        alert("Usernames are between 4 to 32 characters consisting of lowercase, uppercase, and numerical characters.");
    }
    var password = document.forms["login"]["login-password"].value;
    if (validatePassword(username, 6, 32)) {
        // POST FORM
    }
    else
    {
        alert("Passwords must be between 6 to 32 characters and must contain lowercase, uppercase, and numberical characters.");
    }
}

function validateRegister()
{   
    var username = document.forms["register"]["register-username"].value;
    if (validateText(username, 4, 32)) {
        // POST FORM
    }
    else
    {
        alert("Usernames are between 4 to 32 characters consisting of lowercase, uppercase, and numerical characters.");
    }
    var password = document.forms["register"]["register-password"].value;
    if (validatePassword(username, 6, 32)) {
        // POST FORM
    }
    else
    {
        alert("Passwords must be between 6 to 32 characters and must contain lowercase, uppercase, and numberical characters.");
    }
}