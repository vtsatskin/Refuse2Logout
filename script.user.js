// ==UserScript==
// @name           Refuse2Logout
// @namespace      http://userscripts.org/users/vtsatskin
// @include        http://learn.uwaterloo.ca/*
// @include        https://learn.uwaterloo.ca/*
// @description	   Prevents uWaterloo's Desire2Learn from logging you out automatically
// @version        0.0.1
// ==/UserScript==

window.addEventListener('load', function() {
	var POLL_INTERVAL = 600000; // 10 minutes in ms
	var POLL_URL = "/d2l/lp/homepage/home.d2l?ou=6606";

	function tapItLikeItsHot(){
		var oReq = new XMLHttpRequest();
		oReq.open("GET", POLL_URL, true);
		oReq.onreadystatechange = function (oEvent) {
		  if (oReq.readyState === 4) {
		    if (oReq.status === 200) {
		      console.log("Successfully polled D2L!");
		    } else {
		      console.log("Error", oReq.statusText);
		    }
		  }
		};
		oReq.send(null);
		setTimeout(tapItLikeItsHot, POLL_INTERVAL);
	}

	setTimeout(tapItLikeItsHot, POLL_INTERVAL);
});