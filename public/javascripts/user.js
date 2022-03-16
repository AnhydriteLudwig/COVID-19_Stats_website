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

function logout(){
    var xmlhttp = new XMLHttpRequest();
    alert("You have logged out");
    window.location.href='/';
    xmlhttp.open("GET", "/users/logout", true);
    xmlhttp.send();
}

function getInfo(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var s = JSON.parse(this.responseText);
            document.getElementById('uid').innerText = "Your uid is "+s[0].uid;
            document.getElementById('preUserName').innerText = s[0].username;
            document.getElementById('prePassword').innerText = s[0].password;
            document.getElementById('preFirstName').innerText = s[0].first_name;
            document.getElementById('preLastName').innerText = s[0].last_name;
            document.getElementById('preEmail').innerText = s[0].email;
        }
    };
    xhttp.open("GET", "/users/getUserInfo", true);
	xhttp.send();
}

function changeInfo(){
	let user = {
        username: document.getElementById("afterUserName").value,
        password: document.getElementById("afterPassword").value,
        first_name: document.getElementById("afterFirstName").value,
        last_name: document.getElementById("afterLastName").value,
        email: document.getElementById("afterEmail").value,
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Info change success");
            location.reload();
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Info change failed");
        }
    };
    xhttp.open("POST", "/users/changeUserInfo", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}

function checkIn(){
	let code = {
        code: document.getElementById("checkInCode").value
	};
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Check in success");
        }
    };
    xhttp.open("POST", "/users/checkIn", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(code));
}

function viewHistory(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var places = JSON.parse(this.responseText);
            var options = {
                zoom: 15,
                center: new google.maps.LatLng(places[0].lat,places[0].lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById('googleMap'), options);
            for (var i = 0; i < places.length; i++) {
                var date = new Date(places[i].date);
                var dateString = [
                  date.getUTCFullYear() ,
                  ("0" + (date.getUTCMonth()+1)).slice(-2),
                  ("0" + date.getUTCDate()).slice(-2)
                ].join("-");
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(places[i].lat, places[i].lng),
                    map: map,
                    title: places[i].name+" "+dateString
                });
            }
            marker.setMap(map);
        }
    };
    xhttp.open("GET", "/users/viewHistory", true);
	xhttp.send();
}

function seeHotspots(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var places = JSON.parse(this.responseText);
            var options = {
                zoom: 15,
                center: new google.maps.LatLng(places[0].lat,places[0].lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById('googleMap'), options);
            for (var i = 0; i < places.length; i++) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(places[i].lat, places[i].lng),
                    map: map,
                    title: places[i].name
                });
            }
            marker.setMap(map);
        }
    };

    xhttp.open("GET", "/users/seeCurrentHotspots", true);
	xhttp.send();
}

function wentHotspots(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var places = JSON.parse(this.responseText);
            var c = '';
            for (var i in places)
            {
                var date = new Date(places[i].date);
                var dateString = [
                  date.getUTCFullYear() ,
                  ("0" + (date.getUTCMonth()+1)).slice(-2),
                  ("0" + date.getUTCDate()).slice(-2)
                ].join("-");
                c +='<tr>'+'<td>'+dateString+'</td>'+'<td>'+places[i].name+'</td>'+'</tr>';
            }
            document.getElementById("table").innerHTML = c;
            alert("Danger!");
        }
        else if (this.readyState == 4 && this.status >= 400) {
            alert("You are safe!");
        }
    };

    xhttp.open("GET", "/users/wentHotspots", true);
	xhttp.send();
}

function sendCurrentHotspots(){
    var email={
        emailAddress: document.getElementById("emailAddress").value
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Email successfully sent");
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Email sent failed");
        }
    };
    xhttp.open("POST", "/users/getCurrentHotspotsEmail", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(email));
}

function sendWentHotspots(){
    var email={
        emailAddress: document.getElementById("emailAddress").value
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Email successfully sent");
        }
    };
    xhttp.open("POST", "/users/sendWentHotspotsEmail", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(email));
}

function initialize()
{
  var mapProp = {
    center: new google.maps.LatLng(0,138.6),
    zoom:1,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
}

function loadScript()
{
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyA9bWybmVQFUpA6Kw16EaMIfulZjUy0eGA&callback=initialize";
  document.body.appendChild(script);
}

window.onload = function(){
    getTime();
	loadScript();
	getInfo();
};