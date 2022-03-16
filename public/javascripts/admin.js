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
    alert("You have logged out!");
    window.location.href='/';
    xmlhttp.open("GET", "/users/logout", true);
    xmlhttp.send();
}

function getAdminInfo(){
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
    xhttp.open("GET", "/users/getAdminInfo", true);
	xhttp.send();
}

function changeAdminInfo(){
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
    xhttp.open("POST", "/users/changeAdminInfo", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}

function showAllHotspots(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var places = JSON.parse(this.responseText);
            var c = '';
            for (var i in places)
            {
                var startDate = new Date(places[i].start_date);
                var startDateString = [
                  startDate.getUTCFullYear() ,
                  ("0" + (startDate.getUTCMonth()+1)).slice(-2),
                  ("0" + startDate.getUTCDate()).slice(-2)
                ].join("-");
                var endDate = new Date(places[i].end_date);
                var endDateString = [
                  endDate.getUTCFullYear() ,
                  ("0" + (endDate.getUTCMonth()+1)).slice(-2),
                  ("0" + endDate.getUTCDate()).slice(-2)
                ].join("-");
                c +='<tr>'+'<td>'+places[i].hotspot_id+'</td>'+'<td>'+places[i].check_in_code+'</td>'+'<td>'+places[i].name+'</td>'+'<td>'+startDateString+'</td>'+'<td>'+endDateString+'</td>'+'</tr>';
            }
            document.getElementById("allHotspotsTable").innerHTML = c;
        }
    };
    xhttp.open("GET", "/users/showAllHotspots", true);
	xhttp.send();
}

function createLocations(){
	let place = {
        check_in_code: document.getElementById("createCheckInCode").value,
        name: document.getElementById("createLocationName").value,
        lat: document.getElementById("createLat").value,
        lng: document.getElementById("createLng").value
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Location successfully created");
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Location created failed");
        }
    };
    xhttp.open("POST", "/users/createLocations", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(place));
}

function createHotspots(){
    hotspot = {
        check_in_code: document.getElementById("createHotspotCheckInCode").value,
        start_date: document.getElementById("createStartDate").value,
        end_date: document.getElementById("createEndDate").value,
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Hotspot successfully created");
            location.reload();
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Hotspot created failed");
        }
    };
    xhttp.open("POST", "/users/createHotspots", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(hotspot));
}

function changeTimeframe(){
    hotspot = {
        hotspot_id: document.getElementById("hotspotId").value,
        start_date: document.getElementById("newStartDate").value,
        end_date: document.getElementById("newEndDate").value,
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Hotspot timeframe successfully updated");
            location.reload();
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Hotspot timeframe updated failed");
        }
    };
    xhttp.open("POST", "/users/changeTimeframe", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(hotspot));
}

function allocateVenues(){
    let venue = {
        uid: document.getElementById("allocateVenueUid").value,
        checkInCode: document.getElementById("allocateVenueCheckInCode").value,
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Success");
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Failed");
        }
    };
    xhttp.open("POST", "/users/allocateVenues", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(venue));
}

function removeUsers(){
    let user = {
        uid: document.getElementById("deleteUsers").value
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Delete success");
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Delete failed");
        }
    };
    xhttp.open("POST", "/users/removeUsers", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}

function removeOwners(){
    let user = {
        uid: document.getElementById("deleteOwners").value,
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Delete success");
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Delete failed");
        }
    };
    xhttp.open("POST", "/users/removeOwners", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}

function removeLocations(){
    let place = {
        code: document.getElementById("deleteLocations").value,
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Delete success");
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Delete failed");
        }
    };
    xhttp.open("POST", "/users/removeLocations", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(place));
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

function showAllCheckInHistory()
{
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
                c +='<tr>'+'<td>'+places[i].history_id+'</td>'+'<td>'+places[i].uid+'</td>'+'<td>'+places[i].username+'</td>'+'<td>'+places[i].name+'</td>'+'<td>'+dateString+'</td>'+'</tr>';
            }
            document.getElementById("allCheckInHistoryTable").innerHTML = c;
        }
    };
    xhttp.open("GET", "/users/showAllCheckInHistory", true);
	xhttp.send();
}

function seeCurrentHotspots(){
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
	getAdminInfo();
	showAllHotspots();
	seeCurrentHotspots();
	showAllCheckInHistory();
};