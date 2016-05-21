"use strict";

// initialise when document is ready
document.addEventListener("DOMContentLoaded", function(event) {
    // retrieve character information from server
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/index.html?action=get_session", true);
    xhr.send();
    xhr.onreadystatechange = setSession;
    function setSession(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var session = JSON.parse(xhr.responseText || "null");
            var secret = session['secret'];
            if (secret)
            {
                // Hide logout
                var l = document.getElementById("logout");
                if (l)
                    l.style.display = "none";
            }
            else
            {
                // Hide login / register
                var l = document.getElementById("login-register");
                if (l)
                    l.style.display = "none";
            }
        }
    }
});