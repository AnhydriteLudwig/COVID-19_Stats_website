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

function getVenueInfo(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var places = JSON.parse(this.responseText);
            var c = '';
            for (var i in places)
            {
                c +='<tr>'+'<td>'+places[i].check_in_code+'</td>'+'<td>'+places[i].name+'</td>'+'<td>'+places[i].lat+'</td>'+'<td>'+places[i].lng+'</td>'+'</tr>';
            }
            document.getElementById("venueTable").innerHTML = c;
        }
        else if (this.readyState == 4 && this.status >= 400) {
            alert("You don't have venues to manage.");
        }
    };
    xhttp.open("GET", "/users/getVenueInfo", true);
	xhttp.send();
}

function changeVenueInfo(){
	let place = {
        check_in_code: document.getElementById("selectVenue").value,
        name: document.getElementById("newVenueName").value,
        lat: document.getElementById("newLat").value,
        lng: document.getElementById("newLng").value
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Info change success");
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Info change failed");
        }
    };
    xhttp.open("POST", "/users/changeVenueInfo", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(place));
}

function showVenueCheckInHistory(){
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
            document.getElementById("historyTable").innerHTML = c;
        }
        else if (this.readyState == 4 && this.status >= 400) {
            alert("You don't have venues to manage.");
        }
    };
    xhttp.open("GET", "/users/showVenueCheckInHistory", true);
	xhttp.send();
}

window.onload = function(){
    getTime();
};