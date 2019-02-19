console.log("start")

$(document).ready(function(){
    // $('.collapsible').collapsible();
    setDashboard();
    retrieveData();
    buildNav();
    M.AutoInit();
});

let container = document.getElementById("container");
// let content = document.getElementById("main-content");  
let nav = document.getElementById("nav-bar")

// @ts-ignore
let parsedServices;
let parsedRemotes;


function getAddress(){

}

function buildNav(){
    if(nav == null){
        console.log("could not get nav bar");
        return
    }
    nav.className += " nav-padding";

    nav.innerHTML = 
`<span class="services-header">navigation</span>
<br>
<div class="collection">
<a href="#!" class="collection-item active white">Dashboard</a>
<a href="#!" class="collection-item">Change Addresses</a>
<a href="#!" class="collection-item">Core Settings</a>
<a href="#!" class="collection-item">ProcM Settings</a>
<a href="#!" class="collection-item">Logs</a>
</div>
`;
}


function retrieveData(): void{
    // @ts-ignore
    $.ajax({
        url: "/api/get_services",
        method: 'POST',
        success: (data: any) =>{
            console.log(data);
            try {
                parsedServices = JSON.parse(data);
            } catch(err){
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
    let content = document.getElementById("main-content");
    if (content == null) {
        console.log("error=could not get main-content div")
        return;
    }
    content.innerHTML = 
    `<h3>Dashboard</h3>
    <h5>could not reach gmbh</h5>
    `;
}

function getService(parentID: string) {
    //@ts-ignore
    for(let s in parsedServices){
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
`;
        return;
    }
    
    content.innerHTML = 
`<h3>Dashboard</h3>
<h4>Cluster Information</h4>
`;

    let cluster = document.createElement("div")
    cluster.id = "cluster";

    for(let remote in parsedRemotes){

        let r = parsedRemotes[remote];

        let remoteDiv = document.createElement("div");
        remoteDiv.id = "remote-"+r.id;
        remoteDiv.className = "remote";

        

remoteDiv.innerHTML = 
`<table class="remote-header">
    <tr>
        <td class="remote-title"><h5>Remote ${r.id}</h5></td>
        <td class="paren">{</td>
        <td class="remote-data">
        <b>Address</b>&nbsp;${r.address}<br>
        <b>Status</b>&nbsp;&nbsp;&nbsp;&nbsp;<span class="new badge green" data-badge-caption="">${r.status}</span><br>
        <b>Uptime</b>&nbsp;&nbsp;&nbsp;${timeSince(Date.parse(r.startTime))}
        </td>
    </tr>
</table>
`;
    if (r.services.length > 0) {

        let serviceDiv = document.createElement('div');
        remoteDiv.appendChild(serviceDiv);

        let sheader = document.createElement("span");
        sheader.className = "services-header";
        sheader.innerText = "Managed Services";
        serviceDiv.appendChild(sheader);

        let table = document.createElement('table');
        table.className = "highlight service-tbl";
        table.id = "services-"+r.id;
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
    <th class="center-align">Restart</td>
    <!--<th>Fail Time</td>
    <th>Log Path</td>
    <th>Path</td>-->
</thead>
`;  
        table.appendChild(header);

        for(let service in r.services) {
            let s = r.services[service];

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
            console.log(s);
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

            let row = document.createElement('tr');
            row.innerHTML = 
`<td>${s.name}&nbsp;${status}</td>
<td>${id}</td>
<td class="center-align"><a class="modal-trigger" href="#modal-${s.id}"><i class="material-icons ${icolor}">info_outline</i></a></td>
<td>${s.pid}</td>
<td>${addr}</td>
<td>${timeSince(Date.parse(s.startTime))}</td>
<td>${s.mode}</td>
<td class="center-align"><a href="#"><i class="material-icons">cached</i></a></td>
<!--<td>${s.failTime}</td>
<td>${s.logPath}</td>
<td>${s.path}</td>-->`;
            table.appendChild(row);

            let modal = generateModal("-"+s.id);
            remoteDiv.appendChild(modal);
            $(modal).modal();

            let errorString = "-";
            if (s.errors.length != 0) {

                errorString = "<table>";
                for(let e in s.errors){
                    errorString += "<tr><td>" + s.errors[e] + " </td></tr>";
                }
                errorString += "</table>"
            }

            let mcontent = document.createElement('div');
            mcontent.className="modal-content";
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
`;
            modal.appendChild(mcontent);
        }
        
    }
    cluster.appendChild(remoteDiv);
}
    content.appendChild(cluster);
}

function setDashboard(): void{
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
      seconds -= interval*86400;
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      result += interval + "h";
      seconds -= interval*3600;
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      result += interval + "m";
      seconds -= interval*60;
    }
    if (result == "") {
        return "1m";
    }
    return result;
  }

function generateModal(id: string){
    let outterdiv = document.createElement('div');
    outterdiv.id="modal"+id;
    outterdiv.className="modal";
    return outterdiv;    
}

function genLink(id: string){
    let link = document.createElement('a');
    link.setAttribute("href","#modal"+id);
    link.className="waves-effect waves-light btn modal-trigger";
    link.innerText = 'Modal';
    return link
}