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

function validateLogin() {
    var username = document.forms["login"]["login-username"].value;
    var password = document.forms["login"]["login-password"].value;
    if (!validateText(username, 4, 32)) {
        alert("Usernames are between 4 to 32 characters consisting of lowercase, uppercase, and numerical characters.");
    } else if (!validatePassword(password, 6, 32)) {
        alert("Passwords must be between 6 to 32 characters and must contain lowercase, uppercase, and numberical characters.");
    } else {
        console.log(username);
        var xhr = new XMLHttpRequest();
        var params = "type=login&username="+username+"&password="+password;
        xhr.open('POST', "/register-login.html", true);
        xhr.send(params);
        xhr.onreadystatechange = onLogin;
        function onLogin(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var r = JSON.parse(xhr.responseText || "null");
                var result = r['result'];
                console.log("result is "+result);
                if (!result)
                {
                    alert("Incorrect credentials.");
                }
                else
                {
                    window.location="/character-creator.html";
                }
            }
        }
    }
}

function validateRegister() {   
    var username = document.forms["register"]["register-username"].value;
    var password = document.forms["register"]["register-password"].value;
    var email = document.forms["register"]["register-email"].value;
    var confirm = document.forms["register"]["register-confirm"].value;
    if (!validateText(username, 4, 32)) {
        alert("Usernames are between 4 to 32 characters consisting of lowercase, uppercase, and numerical characters.");
    } else if (!validatePassword(username, 6, 32)) {
        alert("Passwords must be between 6 to 32 characters and must contain lowercase, uppercase, and numberical characters.");
    } else if (!email) {
        alert("Invalid Email.");
    } else if (password != confirm) {
        alert("Password confirmation does not match.");
    } else {
        console.log(username);
        var xhr = new XMLHttpRequest();
        var params = "type=register&username="+username+"&email="+email+"&password="+password;
        xhr.open('POST', "/register-login.html", true);
        xhr.send(params);
        xhr.onreadystatechange = onRegister;
        function onRegister(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var r = JSON.parse(xhr.responseText || "null");
                var result = r['result'];
                console.log("result is "+result);
                if (!result)
                {
                    alert("Request rejected by server.");
                }
                else
                {
                    window.location="/character-creator.html";
                }
            }
        }
    }
}