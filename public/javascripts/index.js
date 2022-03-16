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
	getStats();
};

function getStats(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var stats = JSON.parse(this.responseText);
			document.getElementById("globalConfirmed").innerHTML = stats.summary.confirmed;
			document.getElementById("globalRecovered").innerHTML = stats.summary.recovered;
			document.getElementById("globalDeaths").innerHTML = stats.summary.deaths;
			var globalMortalityRate = Math.round(stats.summary.deaths / stats.summary.confirmed * 10000) / 100 + "%";
			document.getElementById("globalMortalityRate").innerHTML = globalMortalityRate;

			document.getElementById("AUConfirmed").innerHTML = stats.data[0].total.confirmed;
			document.getElementById("AURecovered").innerHTML = stats.data[0].total.recovered;
			document.getElementById("AUDeaths").innerHTML = stats.data[0].total.deaths;
			var AUMortalityRate = Math.round(stats.data[0].total.deaths / stats.data[0].total.confirmed * 10000) / 100 + "%";
			document.getElementById("AUMortalityRate").innerHTML = AUMortalityRate;
		}
	};
	xhttp.open("GET", "https://c19stats.vercel.app/api?countries=Australia", true);
	xhttp.send();
}