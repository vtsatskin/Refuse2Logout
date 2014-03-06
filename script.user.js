// ==UserScript==
// @name           Refuse2Logout
// @namespace      http://userscripts.org/users/vtsatskin
// @include        http://learn.uwaterloo.ca/*
// @include        https://learn.uwaterloo.ca/*
// @description    Prevents uWaterloo's Desire2Learn from logging you out automatically
// @version        0.0.3
// ==/UserScript==

window.addEventListener('load', function () {
    var POLL_INTERVAL = 10 * 6E4 // 10 minutes in ms
      , POLL_URL = "/d2l/lp/auth/session/extend"
      , tapItLikeItsHot = function () {
            try {
                var oReq = new XMLHttpRequest();
                oReq.open("GET", POLL_URL, true);
                oReq.onreadystatechange = function (oEvent) {
                  if (oReq.readyState === 4) {
                    if (oReq.status === 200) {
                      console && console.log && console.log("Successfully polled D2L!");
                    } else {
                      console && console.error && console.error("Polling error: ", oReq.statusText);
                    }
                  }
                };
                oReq.send(null);
            } catch (err) {
                console && console.error && console.error(err);
            }
        }
      , inject = function (fn) {
            var script = document.createElement('script');
            script.textContent = '(' + fn.toString() + ')()';
            var target = document.getElementsByTagName('head')[0]
                || document.body || document.documentElement;
            target.appendChild(script);
        }
      , fuckTheWarnings = function () {
            function shouldBother(msg) {
                if (typeof msg !== 'string') {
                    return true;
                }
                if (msg.indexOf('timeout') >= 0) {
                    return false;
                }
                return true;
            }
            function makeBanner(msg) {
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
                close.onmouseover = function () {
                    close.style.textDecoration = 'underline';
                };
                close.onmouseout = function () {
                    close.style.textDecoration = '';
                };
                close.onclick = function () {
                    banner.parentNode.removeChild(banner);
                };
                banner.appendChild(close);
                return banner;
            }
            var __alert = window.alert;
            window.alert = function (msg) {
                try {
                    if (shouldBother(msg)) {
                        __alert(msg);
                    } else {
                        var parent = document.getElementById('d2l_minibar');
                        var banner = makeBanner(msg);
                        parent.insertBefore(banner, parent.firstChild);
                    }
                } catch (err) {
                    // In case we fuck up, try not to change anything.
                    __alert(msg);
                    console && console.error && console.error(err);
                }
            }
        };

    setInterval(tapItLikeItsHot, POLL_INTERVAL);
    try {
        inject(fuckTheWarnings);
    } catch (err) {
        console && console.error && console.error(err);
    }
});
