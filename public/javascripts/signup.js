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

window.onload = function(){
	getTime();
	hideAllSign();
};

function hideAllSign(){
	document.getElementById("userSignUp").style.display="none";
	document.getElementById("ownerSignUp").style.display="none";
	document.getElementById("adminSignUp").style.display="none";
}

function showUserSign(){
	document.getElementById("userSignUp").style.display="";
	document.getElementById("ownerSignUp").style.display="none";
	document.getElementById("adminSignUp").style.display="none";
}

function showOwnerSign(){
	document.getElementById("userSignUp").style.display="none";
	document.getElementById("ownerSignUp").style.display="";
	document.getElementById("adminSignUp").style.display="none";
}

function showAdminSign(){
	document.getElementById("userSignUp").style.display="none";
	document.getElementById("ownerSignUp").style.display="none";
	document.getElementById("adminSignUp").style.display="";
}

function userSignUp() {
    let user = {
        username: document.getElementById("userName").value,
        password: document.getElementById("userPassword").value,
        first_name: document.getElementById("userFirstName").value,
        last_name: document.getElementById("userLastName").value,
        email: document.getElementById("userEmail").value,
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("user register success");
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("username already exists");
        }
    };
    xhttp.open("POST", "/users/userSignUp", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}

function ownerSignUp() {
    let user = {
        username: document.getElementById("ownerName").value,
        password: document.getElementById("ownerPassword").value
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("venue owner register success");
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("username already exists");
        }
    };
    xhttp.open("POST", "/users/ownerSignUp", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}

function adminSignUp() {
    let user = {
        username: document.getElementById("adminName").value,
        password: document.getElementById("adminPassword").value,
        first_name: document.getElementById("adminFirstName").value,
        last_name: document.getElementById("adminLastName").value,
        email: document.getElementById("adminEmail").value,
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("admin register success");
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("username already exists");
        }
    };
    xhttp.open("POST", "/users/adminSignUp", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}

