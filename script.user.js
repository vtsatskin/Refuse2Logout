// ==UserScript==
// @name           Refuse2Logout
// @namespace      http://userscripts.org/users/vtsatskin
// @include        http://learn.uwaterloo.ca/*
// @include        https://learn.uwaterloo.ca/*
// @description    Prevents uWaterloo's Desire2Learn from logging you out automatically
// @version        0.0.3
// ==/UserScript==

window.addEventListener('load', function () {
	var POLL_INTERVAL = 10 * 6E4; // 10 minutes in ms
	var POLL_URL = "/d2l/lp/auth/session/extend";

	function tapItLikeItsHot() {
		var oReq = new XMLHttpRequest();
		oReq.open("GET", POLL_URL, true);
		oReq.onreadystatechange = function (oEvent) {
			if (oReq.readyState !== 4) return;

			if (oReq.status === 200) {
				log("Successfully polled D2L!");
			} else {
				error("Polling error: ", oReq.statusText);
			}
		};
		oReq.send(null);
	}

	setInterval(tryTo(tapItLikeItsHot), POLL_INTERVAL);
	tryTo(inject)(fuckTheWarnings);

	function fuckTheWarnings() {
		function fakeAlert(msg) {
			if (msg.indexOf('inactive') >= 0) {
				// Your session has been inactive for some time. Press 'OK' to remain logged in.

				// Doing nothing for this message should let the user's
				// session be extended automatically (since the calling
				// code thinks we clicked 'OK'), unless it has already
				// expired, in which case we will get the below message
				// immediately thereafter.
				return;
			} else if (msg.indexOf('expired') >= 0) {
				// Your session has expired. Any unsaved work will be lost if you continue to use the system.
				//
				// If you have unsaved work, we recommend you:
				// a) Open a new browser tab/window and log back in before proceeding.
				// b) Copy and paste unsaved work into another application (such as Notepad) before proceeding.

				// We add this message at the top of the page, since
				// it might actually be useful to know that you have
				// been logged out.
				addMessageBanner(msg);
			} else {
				__alert(msg);
			}
		}
		var __alert = window.alert;
		window.alert = function (msg) {
			try {
				fakeAlert(msg);
			} catch (err) {
				__alert(msg);
				console && console.error && console.error(err);
			}
		};
		function addMessageBanner(msg) {
			var parent = document.getElementById('d2l_minibar');
			var placeholder = document.getElementById('d2l_minibar_placeholder');

			var banner = document.createElement('div');
			banner.innerText = msg;
			banner.style.color = 'rgba(255, 255, 255, 0.9)';
			banner.style.padding = '10px';
			banner.style.fontSize = '15px';

			var close = document.createElement('a');
			close.innerText = 'x';
			close.style.color = 'rgba(255, 255, 255, 0.9)';
			close.style.float = 'right';
			close.style.cursor = 'pointer';
			close.style.webkitUserSelect = 'none';

			close.onmouseover = function () {
				close.style.textDecoration = 'underline';
			};
			close.onmouseout = function () {
				close.style.textDecoration = '';
			};
			close.onclick = function () {
				parent.removeChild(banner);
				placeholder.style.height = parent.offsetHeight + 'px';
			};

			banner.appendChild(close);
			parent.insertBefore(banner, parent.firstChild);
			placeholder.style.height = parent.offsetHeight + 'px';
		}
	};

	function inject(fn) {
		console.log("injecting: ", fn.toString());
		var script = document.createElement('script');
		script.textContent = '(' + fn.toString() + ')()';
		document.getElementsByTagName('head')[0].appendChild(script);
	}
	function tryTo(fn) {
		return function (/*args*/) {
			try {
				fn.apply(null, arguments);
			} catch (err) {
				error(err);
			}
		}
	}
	function log(/*args*/) {
		console && console.log && console.log.apply(console, arguments);
	}
	function error(/*args*/) {
		console && console.error && console.error.apply(console, arguments);
	}
});
