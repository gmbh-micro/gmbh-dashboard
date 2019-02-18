"use strict";
console.log("start");
var container = document.getElementById("container");
// let content = document.getElementById("main-content");  
var nav = document.getElementById("nav-bar");
// @ts-ignore
var parsedServices;
var parsedRemotes;
setDashboard();
retrieveData();
buildNav();
function getAddress() {
}
function buildNav() {
    if (nav == null) {
        console.log("could not get nav bar");
        return;
    }
    nav.className += " nav-padding";
    nav.innerHTML =
        "<span class=\"services-header\">navigation</span>\n<br>\n<div class=\"collection\">\n<a href=\"#!\" class=\"collection-item active white\">Dashboard</a>\n<a href=\"#!\" class=\"collection-item\">Change Addresses</a>\n<a href=\"#!\" class=\"collection-item\">Core Settings</a>\n<a href=\"#!\" class=\"collection-item\">ProcM Settings</a>\n<a href=\"#!\" class=\"collection-item\">Logs</a>\n</div>\n";
}
function retrieveData() {
    // @ts-ignore
    $.ajax({
        url: "/api/get_services",
        method: 'POST',
        success: function (data) {
            console.log(data);
            try {
                parsedServices = JSON.parse(data);
            }
            catch (err) {
                console.log(data);
            }
            $.ajax({
                url: "/api/get_remotes",
                method: 'POST',
                success: remotes,
                error: gmbherror,
            });
        },
        error: gmbherror,
    });
}
function gmbherror() {
    var content = document.getElementById("main-content");
    if (content == null) {
        console.log("error=could not get main-content div");
        return;
    }
    content.innerHTML =
        "<h3>Dashboard</h3>\n    <h5>could not reach gmbh</h5>\n    ";
}
function getService(parentID) {
    //@ts-ignore
    for (var s in parsedServices) {
        //@ts-ignore
        var service = parsedServices[s];
        if (service.parentID == parentID) {
            //@ts-ignore
            parsedServices[s] = {};
            return service;
        }
    }
}
function remotes(data) {
    var content = document.getElementById("main-content");
    if (content == null) {
        console.log("error=could not get main-content div");
        return;
    }
    try {
        parsedRemotes = JSON.parse(data);
    }
    catch (_a) {
        console.log("could not parse results");
        // let header = document.createElement('h5');
        // header.innerText = "could not contact gmbh";
        // content.appendChild(header);    
        content.innerHTML =
            "\n<h3>Dashboard</h3>\n<h5>could not reach gmbh</h5>\n";
        return;
    }
    content.innerHTML =
        "<h3>Dashboard</h3>\n<h4>Cluser Information</h4>\n";
    // let header = document.createElement('h4');
    // header.innerText = "Cluster Information"
    // content.appendChild(header);
    var cluster = document.createElement("div");
    cluster.id = "cluster";
    for (var remote in parsedRemotes) {
        var r = parsedRemotes[remote];
        // console.log(r);
        var remoteDiv = document.createElement("div");
        remoteDiv.id = "remote-" + r.id;
        remoteDiv.className = "remote";
        remoteDiv.innerHTML =
            "<table class=\"remote-header\">\n    <tr>\n        <td class=\"remote-title\"><h5>Remote " + r.id + "</h5></td>\n        <td class=\"paren\">{</td>\n        <td class=\"remote-data\">\n        <b>Address</b>&nbsp;" + r.address + "<br>\n        <b>Status</b>&nbsp;&nbsp;&nbsp;&nbsp;<span class=\"new badge green\" data-badge-caption=\"\">" + r.status + "</span><br>\n        <b>Uptime</b>&nbsp;&nbsp;&nbsp;" + timeSince(Date.parse(r.startTime)) + "\n        </td>\n    </tr>\n</table>\n";
        if (r.services.length > 0) {
            var serviceDiv = document.createElement('div');
            remoteDiv.appendChild(serviceDiv);
            var sheader = document.createElement("span");
            sheader.className = "services-header";
            sheader.innerText = "Managed Services";
            serviceDiv.appendChild(sheader);
            var table = document.createElement('table');
            table.className = "highlight service-tbl";
            table.id = "services-" + r.id;
            remoteDiv.appendChild(table);
            var header = document.createElement('thead');
            header.innerHTML =
                "<thead>\n    <th>Name</td>\n    <th>ID</td>\n    <th>PID</td>\n    <th>Address</td>\n    <th>Upime</td>\n    <th>Mode</td>\n    <!--<th>Fail Time</td>\n    <th>Log Path</td>\n    <th>Path</td>-->\n</thead>\n";
            table.appendChild(header);
            for (var service in r.services) {
                var s = r.services[service];
                var id = s.id;
                if (id.length > 4) {
                    id = id.substring(5);
                }
                var color = "red";
                if (s.status == "Stable" || s.status == "Running") {
                    color = "green";
                }
                var status_1 = "<span class=\"new badge " + color + "\" data-badge-caption=\"\">" + s.status + "</span>";
                var cabalService = getService(r.id);
                var addr = "-";
                if (cabalService != null) {
                    addr = cabalService.address;
                }
                var row = document.createElement('tr');
                row.innerHTML =
                    "<td>" + s.name + "&nbsp;" + status_1 + "</td>\n<td>" + id + "</td>\n<td>" + s.pid + "</td>\n<td>" + addr + "</td>\n<td>" + timeSince(Date.parse(s.startTime)) + "</td>\n<td>" + s.mode + "</td>\n<!--<td>" + s.failTime + "</td>\n<td>" + s.logPath + "</td>\n<td>" + s.path + "</td>-->";
                table.appendChild(row);
            }
        }
        cluster.append(remoteDiv);
    }
    content.append(cluster);
}
function setDashboard() {
    var content = document.getElementById("main-content");
    if (content == null) {
        console.log("error=could not get main-content div");
        return;
    }
    content.innerHTML =
        "<h3>Dashboard</h3>\n<h5>contacting gmbh</h5>\n<div class=\"progress\">\n      <div class=\"indeterminate grey darken-3\"></div>\n  </div>\n";
}
// Sky Sanders, stackoverflow; July 5, 2010
// @ts-ignore
function timeSince(date) {
    // @ts-ignore
    var seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) {
        return "<1m";
    }
    var interval = Math.floor(seconds / 31536000);
    var result = "";
    interval = Math.floor(seconds / 2592000);
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        result += interval + "d";
        seconds -= interval * 86400;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        result += interval + "h";
        seconds -= interval * 3600;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        result += interval + "m";
        seconds -= interval * 60;
    }
    return result;
}
