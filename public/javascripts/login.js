var menu = new Vue({
    el: '#menu',
    data: {
		menu: [{ title:'Users',         url:'/user.html' },
		{ title:'Venue Owners/Managers',        url:'/owner.html' },
		{ title:'Admins/Health Officials',   url:'/admin.html' },{ title:'sign up',         url:'/signup.html' },
		{ title:'log in',        url:'/login.html' }],
	}
});

var mainPage = new Vue({
    el: '#main',
    data: {
		dark_mode: false,
	}
});


function getTime(){
	str = "Currently Time: ";
	var p = document.getElementById("timeP");
	time =  new Date();
	year = time.getFullYear();
	month = time.getMonth() + 1;
	day = time.getDate();
	hour = time.getHours();
	minutes = time.getMinutes();
	seconds = time.getSeconds();
	str = str + year +"-"+ month +"-"+ day + " " +hour+":"+minutes+":"+seconds;

	p.innerText = str;

	setTimeout(getTime,1000);
}

function hideAllLog(){
	document.getElementById("userLogIn").style.display="none";
	document.getElementById("ownerLogIn").style.display="none";
	document.getElementById("adminLogIn").style.display="none";
}

function showUserLog(){
	document.getElementById("userLogIn").style.display="";
	document.getElementById("ownerLogIn").style.display="none";
	document.getElementById("adminLogIn").style.display="none";
}

function showOwnerLog(){
	document.getElementById("userLogIn").style.display="none";
	document.getElementById("ownerLogIn").style.display="";
	document.getElementById("adminLogIn").style.display="none";
}

function showAdminLog(){
	document.getElementById("userLogIn").style.display="none";
	document.getElementById("ownerLogIn").style.display="none";
	document.getElementById("adminLogIn").style.display="";
}

function userLogIn(){
    let user = {
        username: document.getElementById('userName').value,
        password: document.getElementById('userPassword').value
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Welcome "+user.username);
            window.location.href='/user.html';
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Login failed");
        }
    };
    xhttp.open("POST", "/users/userLogIn", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}

function ownerLogIn(){
    let user = {
        username: document.getElementById('ownerName').value,
        password: document.getElementById('ownerPassword').value
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Welcome "+user.username);
            window.location.href='/owner.html';
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Login failed");
        }
    };
    xhttp.open("POST", "/users/ownerLogIn", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}

function adminLogIn(){
    let user = {
        username: document.getElementById('adminName').value,
        password: document.getElementById('adminPassword').value
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Welcome "+user.username);
            window.location.href='/admin.html';
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Login failed");
        }
    };
    xhttp.open("POST", "/users/adminLogIn", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}

function onSignIn(googleUser) {
    // Read the token data on the client side
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    // Prepare to send the TOKEN to the server for validation
    var id_token = { token: googleUser.getAuthResponse().id_token };
    // Create AJAX Request
    var xmlhttp = new XMLHttpRequest();

    // Define function to run on response
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Welcome");
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Login failed");
        }
    };
    // Open connection to server & send the token using a POST request
    xmlhttp.open("POST", "/users/GoogleLogIn", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(id_token));
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    alert("You've signed out.");
    });
}

function loadScript()
{
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src="https://apis.google.com/js/platform.js";
  document.body.appendChild(script);
}


window.onload = function(){
    getTime();
	hideAllLog();
	loadScript();
};