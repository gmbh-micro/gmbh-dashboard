
const version = "1.0.0";

let container = document.getElementById("container");
let nav = document.getElementById("nav-bar")

// @ts-ignore
let parsedServices;
let parsedRemotes;

let cabalServer:string = Cookies.get("cbl");
let controlServer:string = Cookies.get("ctrl");

$(document).ready(function () {

    M.AutoInit();

    setDashboard();
    if (cabalServer == undefined || controlServer == undefined) {
        console.log("get addresses");
        let amodal = getAddress()
        var instance = M.Modal.getInstance(amodal);
        instance.open();
    } else {
        getAddress();
        console.log(cabalServer, controlServer);
        retrieveData(cabalServer, controlServer);
    }    

});    

function getAddress() {
    let addrModal = generateModal("-addr");
    $(addrModal).modal();
    let c = document.getElementById("container");
    c.appendChild(addrModal);


    if (cabalServer == undefined) {
        cabalServer = "localhost:49500";
    }
    if (controlServer == undefined) {
        controlServer = "localhost:59500";
    }

    let addrContent = document.createElement('div');
    addrContent.className = "modal-content";
    addrContent.innerHTML = `
<a class="modal-close" href="#modal-addr"><i class="small right material-icons">close</i></a>
<h4>Set Addresses</h4>
<div class="row">
    <div class="input-field col s12">
        <input value="${controlServer}" id="CtrlServer" type="text">
        <label class="active" for="CabalServer">Control Server</label>
    </div>
</div>
<div class="row">
    <div class="input-field col s12">
        <input value="${cabalServer}" id="CblServer" type="text">
        <label class="active" for="CblServer">Cabal Server</label>
    </div>
</div>
`;
let chadr = document.createElement('a');
chadr.className = "waves-effect waves-light btn-small grey darken-2";
chadr.innerText = "Change";
addrContent.append(chadr);

$(chadr).click(()=>{
    setDashboard();

    let clb = $('#CblServer').val();
    let ctrl = $('#CtrlServer').val()

    if (clb == "" || ctrl == ""){
        M.toast({html: 'Server URL\'s cannot be empty'});

    } else {

        retrieveData(clb,ctrl);

        cabalServer = clb;
        controlServer = ctrl;

        Cookies.set('cbl',clb);
        Cookies.set('ctrl',ctrl);

        var instance = M.Modal.getInstance(addrModal);
        instance.close();
    }
});

addrModal.appendChild(addrContent);
    return addrModal;
}

function buildNav() {
    if (nav == null) {
        console.log("could not get nav bar");
        return
    }
    nav.className += " nav-padding";

    nav.innerHTML =
    `<span class="services-header">ProcM</span>
    <div class="collection info">
        <a href="#!" id="restart-all" class="collection-item">Restart All</a>
        <a href="#!" id="shutdown" class="collection-item">Shutdown</a>
        <a href="#!" id="reload" class="collection-item">Reload</a>
        <a class="collection-item modal-trigger" href="#modal-addr" id="change-addresses" class="collection-item">Change Addresses</a>
    </div>
    `;

    $('#restart-all').click(()=>{
        M.toast({html: 'Restarted'});
        $.ajax({
            url: "/api/restart_all",
            method: 'POST',
            data: controlServer,
            success: (data)=>{
                console.log("data " + data);
                parsedServices = [];
                parsedRemotes = [];
                setDashboard();
                retrieveData(cabalServer,controlServer);
            },
            error: ()=>{
                M.toast({html: 'Issue restarting gmbH.'});
            },
        });
        
    });
    $('#shutdown').click(()=>{
        console.log("shutdown");
        $.ajax({
            url: "/api/shutdown",
            method: 'POST',
            data: controlServer,
            success: (data)=>{
                console.log("data " + data);
                M.toast({html: 'Sent shutdown notif'});
            }
            error: ()=>{
                M.toast({html: 'Issue sending shutdown to gmbH.'});
            },
        });
    });
    $('#reload').click(()=>{
        M.toast({html: 'Reloading'});
        parsedServices = [];
        parsedRemotes = [];
        setDashboard();
        retrieveData(cabalServer,controlServer);
    });    
}


function retrieveData(cabal:string,control:string): void {
    // @ts-ignore
    $.ajax({
        url: "/api/get_services",
        method: 'POST',
        data: cabal,
        success: (data: any) => {
            // console.log(data);
            try {
                parsedServices = JSON.parse(data);
            } catch (err) {
                console.log(data);
            }
            $.ajax({
                url: "/api/get_remotes",
                data: control,
                method: 'POST',
                success: remotes,
                error: gmbherror,
            });
        },
        error: gmbherror,
    });


}

function gmbherror() {
    let content = document.getElementById("main-content");
    if (content == null) {
        console.log("error=could not get main-content div")
        return;
    }
    content.innerHTML =
    `<h3>Dashboard</h3>
    <h5>could not reach gmbh</h5>
    <br>
    <a class="collection-item modal-trigger" href="#modal-addr" id="change-addresses" class="collection-item">Change Addresses</a>
    `;
}

function getService(parentID: string) {
    //@ts-ignore
    for (let s in parsedServices) {
        //@ts-ignore
        let service = parsedServices[s];
        if (service.parentID == parentID) {
            //@ts-ignore
            parsedServices[s] = {};
            return service;
        }
    }
}

function remotes(data: any): void {

    let content = document.getElementById("main-content");
    if (content == null) {
        console.log("error=could not get main-content div")
        return;
    }

    try {
        parsedRemotes = JSON.parse(data);
    } catch {
        console.log("could not parse results");
        content.innerHTML =
        `<h3>Dashboard</h3>
        <h5>could not reach gmbh</h5>
        <br>
        <a class="collection-item modal-trigger" href="#modal-addr" id="change-addresses" class="collection-item">Change Addresses</a>
        `;

        return;
    }

    buildNav();

    content.innerHTML =
        `<h3>Dashboard</h3>
    <h4>Cluster Information</h4>
    `;

    let cluster = document.createElement("div")
    cluster.id = "cluster";

    for (let remote in parsedRemotes) {

        let r = parsedRemotes[remote];

        // generate the header information
        let remoteDiv = genRemoteHeader(r)

        // generate the modal
        remoteDiv.appendChild(genModalRemote(r));

        if (r.services.length > 0) {

            let serviceDiv = document.createElement('div');
            remoteDiv.appendChild(serviceDiv);

            let sheader = document.createElement("span");
            sheader.className = "services-header";
            sheader.innerHTML = `Managed Services`;
            serviceDiv.appendChild(sheader);

            let table = document.createElement('table');
            table.className = "highlight service-tbl";
            table.id = "services-" + r.id;
            remoteDiv.appendChild(table);

            let header = document.createElement('thead');
            header.innerHTML =
                `<thead>
                    <th>Name</td>
                    <th>ID</td>
                    <th class="center-align">Info</td>
                    <th>PID</td>
                    <th>Address</td>
                    <th>Upime</td>
                    <th>Mode</td>
                    <th>Group</td>
                    <th class="center-align">Restart</td>
                    <!--<th>Fail Time</td>
                    <th>Log Path</td>
                    <th>Path</td>-->
                </thead>
                `;
            table.appendChild(header);

            for (let service in r.services) {
                let s = r.services[service];
                table.appendChild(genServiceRow(r, s));
            }

        }
        cluster.appendChild(remoteDiv);
    }
    content.appendChild(cluster);
}

// setDashboard to the loading message
function setDashboard(): void {
    let content = document.getElementById("main-content");
    if (content == null) {
        console.log("error=could not get main-content div")
        return;
    }
    content.innerHTML =
        `<h3>Dashboard</h3>
    <h5>contacting gmbh</h5>
    <div class="progress">
        <div class="indeterminate grey darken-3"></div>
    </div>
    `;
}

// Sky Sanders, stackoverflow; July 5, 2010
// @ts-ignore
function timeSince(date) {
    if (date == "0") {
        return "-"
    }
    // @ts-ignore
    var seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) {
        return "<1m";
    }
    var interval = Math.floor(seconds / 31536000);
    let result = "";
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

function generateModal(id: string) {
    let outterdiv = document.createElement('div');
    outterdiv.id = "modal" + id;
    outterdiv.className = "modal";
    return outterdiv;
}

function genLink(id: string) {
    let link = document.createElement('a');
    link.setAttribute("href", "#modal" + id);
    link.className = "waves-effect waves-light btn modal-trigger";
    link.innerText = 'Modal';
    return link
}



// genServiceRow
// generates a row in the service table including the modal printout
function genServiceRow(r, s) {

    console.log(s);

    let id = s.id
    if (id.length > 4) {
        id = id.substring(5)
    }

    let color = `red`;
    if (s.status == "Stable" || s.status == "Running") {
        color = `green`;
    }
    let status = `<span class="new badge ${color}" data-badge-caption="">${s.status}</span>`

    let cabalService = getService(r.id);
    s.gmbhService = cabalService;

    let addr = "-";
    if (cabalService != null) {
        addr = cabalService.address;
    }
    let icolor = "blue-text";
    if (s.errors.length != 0) {
        icolor = "red-text"
    }

    if (s.pid == -1) {
        s.startTime = "0";
    }

    let name = "";
    if (s.gmbhService != undefined){
        name = s.gmbhService.name;
    }

    let gname = "-";
    if (s.gmbhService != undefined){
        gname = s.gmbhService.groupName;
        if(gname == "") {
            gname = "-";
        }
    }

    let row = document.createElement('tr');
    row.innerHTML =
        `<td>${name}&nbsp;${status}</td>
        <td>${id}</td>
        <td class="center-align"><a class="modal-trigger" href="#modal-${s.id}"><i class="material-icons ${icolor}">info_outline</i></a></td>
        <td>${s.pid}</td>
        <td>${addr}</td>
        <td>${timeSince(Date.parse(s.startTime))}</td>
        <td>${s.mode}</td>
        <td>${gname}</td>
        <!--<td>${s.failTime}</td>
        <td>${s.logPath}</td>
        <td>${s.path}</td>-->`;

    row.appendChild(genModalService(r, s, id, color, addr));

    let td = document.createElement('td');
    td.className = "center-align";

    let res = document.createElement('a')
    res.setAttribute('href',"#");
    res.innerHTML = `<i class="material-icons">cached</i>`;

    td.appendChild(res);
    row.appendChild(td);

    $(res).click(()=>{
        M.toast({html: 'Restart sent to ' + s.id});

        $.ajax({
            url: "/api/restart_one",
            method: 'POST',
            data: s.id + "%" + controlServer,
            success: (data)=>{
                // console.log("data " + data);
                parsedServices = [];
                parsedRemotes = [];
                setDashboard();
                retrieveData(cabalServer,controlServer);
            },
            error: ()=>{
                M.toast({html: 'Issue restarting ' + s.id});
            },
        });

    });

    return row;
}

// genRemoteHeader
// generates the header content that describes the brief of the remote
function genRemoteHeader(r) {
    let remoteDiv = document.createElement("div");
    remoteDiv.id = "remote-" + r.id;
    remoteDiv.className = "remote";

    // console.log(r);
    remoteDiv.innerHTML =
        `<table class="remote-header">
    <tr>
        <td class="remote-title"><h5>Remote ${r.id}<a class="modal-trigger" href="#modal-${r.id}"><i class="material-icons">info_outline</i></a></h5></td>
        <td class="paren">{</td>
        <td class="remote-data">
        <b>Address</b>&nbsp;${r.address}<br>
        <b>Status</b>&nbsp;&nbsp;&nbsp;&nbsp;<span class="new badge green" data-badge-caption="">${r.status}</span><br>
        <b>Uptime</b>&nbsp;&nbsp;&nbsp;${timeSince(Date.parse(r.startTime))}
        </td>
        
    </tr>
    </table>
    `;
    return remoteDiv;
}


// genModalRemote
// generates the modal that is opened when clicking the infromation icon next to the remote's name
//
// @param r : the remote object from the server
function genModalRemote(r) {
    let remoteModal = generateModal("-" + r.id);
    $(remoteModal).modal();

    let errorString = "-";
    if (r.errors.length != 0) {

        errorString = "<table>";
        for (let e in r.errors) {
            errorString += "<tr><td>" + r.errors[e] + " </td></tr>";
        }
        errorString += "</table>"
    }

    let remoteContent = document.createElement('div');
    remoteContent.className = "modal-content";
    remoteContent.innerHTML =
        `
    <span class="service-title">Remote ${r.id}<span class="new badge green" data-badge-caption="">${r.status}</span></span>
    <a class="modal-close" href="#modal-${r.id}"><i class="small right material-icons">close</i></a>
    <table>
        <tr>
            <td class="single-attrib">ID</td>
            <td>${r.id}</td>
        </tr>
        <!--<tr>
            <td class="single-attrib">PID</td>
            <td>${r.pid}</td>
        </tr>-->
        <tr>
            <td class="single-attrib">Address</td>
            <td>${r.address}</td>
        </tr>
        <tr>
            <td class="single-attrib">Uptime</td>
            <td>${timeSince(Date.parse(r.startTime))}</td>
        </tr>
        <tr>
            <td class="single-attrib">Log Path</td>
            <td>${r.logPath}</td>
        </tr>
        <tr>
            <td class="single-attrib">Warnings</td>
            <td><span class="yellow-text">-</span></td>
        </tr>
        <tr>
            <td class="single-attrib">Errors</td>
            <td><span class="red-text">${errorString}</span></td>
        </tr>
    </table>
    `
    remoteModal.appendChild(remoteContent);
    return remoteModal;
}



// genModalRemote 
// generates the modal information for each service
function genModalService(r, s, id: string, color: string, addr: string) {

    let modal = generateModal("-" + s.id);
    $(modal).modal();

    let errorString = "-";
    if (s.errors.length != 0) {

        errorString = "<table>";
        for (let e in s.errors) {
            errorString += "<tr><td>" + s.errors[e] + " </td></tr>";
        }
        errorString += "</table>"
    }

    let mcontent = document.createElement('div');
    mcontent.className = "modal-content";
    mcontent.innerHTML =
        `<span class="service-title">${s.name}<span class="new badge ${color}" data-badge-caption="">${s.status}</span></span>
    <a class="modal-close" href="#modal-${s.id}"><i class="small right material-icons">close</i></a>
    <table>
        <tr>
            <td class="single-attrib">ID</td>
            <td>${id}</td>
        </tr>
        <tr>
            <td class="single-attrib">Parent ID</td>
            <td>${r.id}</td>
        </tr>
        <tr>
            <td class="single-attrib">PID</td>
            <td>${s.pid}</td>
        </tr>
        <tr>
            <td class="single-attrib">Address</td>
            <td>${addr}</td>
        </tr>
        <tr>
            <td class="single-attrib">Uptime</td>
            <td>${timeSince(Date.parse(s.startTime))}</td>
        </tr>
        <tr>
            <td class="single-attrib">Restarts</td>
            <td>${s.restarts}</td>
        </tr>
        <tr>
            <td class="single-attrib">Fails</td>
            <td>${s.fails}</td>
        </tr>
        <tr>
            <td class="single-attrib">Log Path</td>
            <td>${s.logPath}</td>
        </tr>
        <tr>
            <td class="single-attrib">Warnings</td>
            <td><span class="yellow-text">-</span></td>
        </tr>
        <tr>
            <td class="single-attrib">Errors</td>
            <td><span class="red-text">${errorString}</span></td>
        </tr>
    </table>
    `;
    modal.appendChild(mcontent);
    return modal;
}

// from w3c
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }