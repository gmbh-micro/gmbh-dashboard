"use strict";
// console.log("start")
$(document).ready(function () {
    // $('.collapsible').collapsible();
    setDashboard();
    retrieveData();
    M.AutoInit();
});
var container = document.getElementById("container");
// let content = document.getElementById("main-content");  
var nav = document.getElementById("nav-bar");
// @ts-ignore
var parsedServices;
var parsedRemotes;
function getAddress() {
}
function buildNav() {
    if (nav == null) {
        console.log("could not get nav bar");
        return;
    }
    nav.className += " nav-padding";
    nav.innerHTML =
        "<span class=\"services-header\">ProcM</span>\n    <div class=\"collection info\">\n        <a href=\"#!\" id=\"restart-all\" class=\"collection-item\">Restart All</a>\n        <a href=\"#!\" id=\"shutdown\" class=\"collection-item\">Shutdown</a>\n        <a href=\"#!\" id=\"reload\" class=\"collection-item\">Reload</a>\n        <a href=\"#!\" id=\"change-addresses\" class=\"collection-item\">Change Addresses</a>\n    </div>\n    ";
    $('#restart-all').click(function () {
        M.toast({ html: 'Restarted' });
        $.ajax({
            url: "/api/restart_all",
            method: 'POST',
            success: function (data) {
                console.log("data " + data);
                parsedServices = [];
                parsedRemotes = [];
                setDashboard();
                retrieveData();
            },
            error: function () {
                M.toast({ html: 'Issue restarting gmbH.' });
            },
        });
        // console.log("restart-all");
    });
    $('#shutdown').click(function () {
        console.log("shutdown");
        $.ajax({
            url: "/api/shutdown",
            method: 'POST',
            success: function (data) {
                console.log("data " + data);
                M.toast({ html: 'Sent shutdown notif' });
            },
            error: function () {
                M.toast({ html: 'Issue sending shutdown to gmbH.' });
            },
        });
    });
    $('#reload').click(function () {
        M.toast({ html: 'Reloading' });
        parsedServices = [];
        parsedRemotes = [];
        setDashboard();
        retrieveData();
    });
    $('#change-addresses').click(function () {
        console.log("unimp");
    });
}
function retrieveData() {
    // @ts-ignore
    $.ajax({
        url: "/api/get_services",
        method: 'POST',
        success: function (data) {
            // console.log(data);
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
        content.innerHTML =
            "<h3>Dashboard</h3>\n        <h5>could not reach gmbh</h5>\n        ";
        return;
    }
    buildNav();
    content.innerHTML =
        "<h3>Dashboard</h3>\n    <h4>Cluster Information</h4>\n    ";
    var cluster = document.createElement("div");
    cluster.id = "cluster";
    for (var remote in parsedRemotes) {
        var r = parsedRemotes[remote];
        // generate the header information
        var remoteDiv = genRemoteHeader(r);
        // generate the modal
        remoteDiv.appendChild(genModalRemote(r));
        if (r.services.length > 0) {
            var serviceDiv = document.createElement('div');
            remoteDiv.appendChild(serviceDiv);
            var sheader = document.createElement("span");
            sheader.className = "services-header";
            sheader.innerHTML = "Managed Services";
            serviceDiv.appendChild(sheader);
            var table = document.createElement('table');
            table.className = "highlight service-tbl";
            table.id = "services-" + r.id;
            remoteDiv.appendChild(table);
            var header = document.createElement('thead');
            header.innerHTML =
                "<thead>\n                    <th>Name</td>\n                    <th>ID</td>\n                    <th class=\"center-align\">Info</td>\n                    <th>PID</td>\n                    <th>Address</td>\n                    <th>Upime</td>\n                    <th>Mode</td>\n                    <th class=\"center-align\">Restart</td>\n                    <!--<th>Fail Time</td>\n                    <th>Log Path</td>\n                    <th>Path</td>-->\n                </thead>\n                ";
            table.appendChild(header);
            for (var service in r.services) {
                var s = r.services[service];
                table.appendChild(genServiceRow(r, s));
            }
        }
        cluster.appendChild(remoteDiv);
    }
    content.appendChild(cluster);
}
// setDashboard to the loading message
function setDashboard() {
    var content = document.getElementById("main-content");
    if (content == null) {
        console.log("error=could not get main-content div");
        return;
    }
    content.innerHTML =
        "<h3>Dashboard</h3>\n    <h5>contacting gmbh</h5>\n    <div class=\"progress\">\n        <div class=\"indeterminate grey darken-3\"></div>\n    </div>\n    ";
}
// Sky Sanders, stackoverflow; July 5, 2010
// @ts-ignore
function timeSince(date) {
    if (date == "0") {
        return "-";
    }
    // @ts-ignore
    var seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) {
        return "<1m";
    }
    var interval = Math.floor(seconds / 31536000);
    var result = "";
    interval = Math.floor(seconds / 2592000);
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        result += interval + "d";
        seconds -= interval * 86400;
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        result += interval + "h";
        seconds -= interval * 3600;
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        result += interval + "m";
        seconds -= interval * 60;
    }
    if (result == "") {
        return "1m";
    }
    return result;
}
function generateModal(id) {
    var outterdiv = document.createElement('div');
    outterdiv.id = "modal" + id;
    outterdiv.className = "modal";
    return outterdiv;
}
function genLink(id) {
    var link = document.createElement('a');
    link.setAttribute("href", "#modal" + id);
    link.className = "waves-effect waves-light btn modal-trigger";
    link.innerText = 'Modal';
    return link;
}
// genServiceRow
// generates a row in the service table including the modal printout
function genServiceRow(r, s) {
    var id = s.id;
    if (id.length > 4) {
        id = id.substring(5);
    }
    var color = "red";
    if (s.status == "Stable" || s.status == "Running") {
        color = "green";
    }
    var status = "<span class=\"new badge " + color + "\" data-badge-caption=\"\">" + s.status + "</span>";
    var cabalService = getService(r.id);
    s.gmbhService = cabalService;
    var addr = "-";
    if (cabalService != null) {
        addr = cabalService.address;
    }
    var icolor = "blue-text";
    if (s.errors.length != 0) {
        icolor = "red-text";
    }
    if (s.pid == -1) {
        s.startTime = "0";
    }
    var row = document.createElement('tr');
    row.innerHTML =
        "<td>" + s.name + "&nbsp;" + status + "</td>\n        <td>" + id + "</td>\n        <td class=\"center-align\"><a class=\"modal-trigger\" href=\"#modal-" + s.id + "\"><i class=\"material-icons " + icolor + "\">info_outline</i></a></td>\n        <td>" + s.pid + "</td>\n        <td>" + addr + "</td>\n        <td>" + timeSince(Date.parse(s.startTime)) + "</td>\n        <td>" + s.mode + "</td>\n        <!--<td>" + s.failTime + "</td>\n        <td>" + s.logPath + "</td>\n        <td>" + s.path + "</td>-->";
    row.appendChild(genModalService(r, s, id, color, addr));
    var td = document.createElement('td');
    td.className = "center-align";
    var res = document.createElement('a');
    res.setAttribute('href', "#");
    res.innerHTML = "<i class=\"material-icons\">cached</i>";
    td.appendChild(res);
    row.appendChild(td);
    $(res).click(function () {
        M.toast({ html: 'Restart sent to ' + s.id });
        $.ajax({
            url: "/api/restart_one",
            method: 'POST',
            data: s.id,
            success: function (data) {
                // console.log("data " + data);
                parsedServices = [];
                parsedRemotes = [];
                setDashboard();
                retrieveData();
            },
            error: function () {
                M.toast({ html: 'Issue restarting ' + s.id });
            },
        });
    });
    return row;
}
// genRemoteHeader
// generates the header content that describes the brief of the remote
function genRemoteHeader(r) {
    var remoteDiv = document.createElement("div");
    remoteDiv.id = "remote-" + r.id;
    remoteDiv.className = "remote";
    // console.log(r);
    remoteDiv.innerHTML =
        "<table class=\"remote-header\">\n    <tr>\n        <td class=\"remote-title\"><h5>Remote " + r.id + "<a class=\"modal-trigger\" href=\"#modal-" + r.id + "\"><i class=\"material-icons\">info_outline</i></a></h5></td>\n        <td class=\"paren\">{</td>\n        <td class=\"remote-data\">\n        <b>Address</b>&nbsp;" + r.address + "<br>\n        <b>Status</b>&nbsp;&nbsp;&nbsp;&nbsp;<span class=\"new badge green\" data-badge-caption=\"\">" + r.status + "</span><br>\n        <b>Uptime</b>&nbsp;&nbsp;&nbsp;" + timeSince(Date.parse(r.startTime)) + "\n        </td>\n        \n    </tr>\n    </table>\n    ";
    return remoteDiv;
}
// genModalRemote
// generates the modal that is opened when clicking the infromation icon next to the remote's name
//
// @param r : the remote object from the server
function genModalRemote(r) {
    var remoteModal = generateModal("-" + r.id);
    $(remoteModal).modal();
    var errorString = "-";
    if (r.errors.length != 0) {
        errorString = "<table>";
        for (var e in r.errors) {
            errorString += "<tr><td>" + r.errors[e] + " </td></tr>";
        }
        errorString += "</table>";
    }
    var remoteContent = document.createElement('div');
    remoteContent.className = "modal-content";
    remoteContent.innerHTML =
        "\n    <span class=\"service-title\">Remote " + r.id + "<span class=\"new badge green\" data-badge-caption=\"\">" + r.status + "</span></span>\n    <a class=\"modal-close\" href=\"#modal-" + r.id + "\"><i class=\"small right material-icons\">close</i></a>\n    <table>\n        <tr>\n            <td class=\"single-attrib\">ID</td>\n            <td>" + r.id + "</td>\n        </tr>\n        <!--<tr>\n            <td class=\"single-attrib\">PID</td>\n            <td>" + r.pid + "</td>\n        </tr>-->\n        <tr>\n            <td class=\"single-attrib\">Address</td>\n            <td>" + r.address + "</td>\n        </tr>\n        <tr>\n            <td class=\"single-attrib\">Uptime</td>\n            <td>" + timeSince(Date.parse(r.startTime)) + "</td>\n        </tr>\n        <tr>\n            <td class=\"single-attrib\">Log Path</td>\n            <td>" + r.logPath + "</td>\n        </tr>\n        <tr>\n            <td class=\"single-attrib\">Warnings</td>\n            <td><span class=\"yellow-text\">-</span></td>\n        </tr>\n        <tr>\n            <td class=\"single-attrib\">Errors</td>\n            <td><span class=\"red-text\">" + errorString + "</span></td>\n        </tr>\n    </table>\n    ";
    remoteModal.appendChild(remoteContent);
    return remoteModal;
}
// genModalRemote 
// generates the modal information for each service
function genModalService(r, s, id, color, addr) {
    var modal = generateModal("-" + s.id);
    $(modal).modal();
    var errorString = "-";
    if (s.errors.length != 0) {
        errorString = "<table>";
        for (var e in s.errors) {
            errorString += "<tr><td>" + s.errors[e] + " </td></tr>";
        }
        errorString += "</table>";
    }
    var mcontent = document.createElement('div');
    mcontent.className = "modal-content";
    mcontent.innerHTML =
        "<span class=\"service-title\">" + s.name + "<span class=\"new badge " + color + "\" data-badge-caption=\"\">" + s.status + "</span></span>\n    <a class=\"modal-close\" href=\"#modal-" + s.id + "\"><i class=\"small right material-icons\">close</i></a>\n    <table>\n        <tr>\n            <td class=\"single-attrib\">ID</td>\n            <td>" + id + "</td>\n        </tr>\n        <tr>\n            <td class=\"single-attrib\">Parent ID</td>\n            <td>" + r.id + "</td>\n        </tr>\n        <tr>\n            <td class=\"single-attrib\">PID</td>\n            <td>" + s.pid + "</td>\n        </tr>\n        <tr>\n            <td class=\"single-attrib\">Address</td>\n            <td>" + addr + "</td>\n        </tr>\n        <tr>\n            <td class=\"single-attrib\">Uptime</td>\n            <td>" + timeSince(Date.parse(s.startTime)) + "</td>\n        </tr>\n        <tr>\n            <td class=\"single-attrib\">Restarts</td>\n            <td>" + s.restarts + "</td>\n        </tr>\n        <tr>\n            <td class=\"single-attrib\">Fails</td>\n            <td>" + s.fails + "</td>\n        </tr>\n        <tr>\n            <td class=\"single-attrib\">Log Path</td>\n            <td>" + s.logPath + "</td>\n        </tr>\n        <tr>\n            <td class=\"single-attrib\">Warnings</td>\n            <td><span class=\"yellow-text\">-</span></td>\n        </tr>\n        <tr>\n            <td class=\"single-attrib\">Errors</td>\n            <td><span class=\"red-text\">" + errorString + "</span></td>\n        </tr>\n    </table>\n    ";
    modal.appendChild(mcontent);
    return modal;
}
