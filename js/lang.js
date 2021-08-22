var langEN = {
    description1: "The best IPv4 calculator",
    description2: "Calculates IP addresses for hosts and network",
    redirectionIndex: "IP Calculator",
    point1: "Point 1",
    point2: "Point 2",
    point3: "Point 3",
    developedBy: "Developed by: ",
    information: "Information",
    descriptionp1: "Calculates the ip address of a network and the subnet mask.",
    descriptionp2: "Calculates a host's ip address and subnet mask.",
    descriptionp3: "Identifies the subnets of an ip address with its subnet mask.",
    goTo: "Go to..."
};

var langES = {
    description1: "La mejor calculadora IPv4",
    description2: "Calcula direcciones de IP para hosts y red"
};

var langURL;
window.onload = function(){
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    if(urlParams.has('lang')){
        var lang = urlParams.get('lang');
        langURL = lang;
        if(lang.localeCompare("EN") == 0){
            setLangEN();
        }else{
            setLangES();
        }
    }else{
        langURL = "ES";
    }
}

function redireccion(){
    if(!langURL){
        langURL = "ES";
    }
    window.location.assign('?lang=' + langURL);

}

function redireccionP1(){
    var url = "punto1.html?lang=" + langURL;
    document.getElementById("redirectionP1").href = url;
}

function redireccionP2(){
    var url = "punto2.html?lang=" + langURL;
    document.getElementById("redirectionP2").href = url;
}

function redireccionP3(){
    var url = "punto3.html?lang=" + langURL;
    document.getElementById("redirectionP3").href = url;
}


function setLangEN(){
    document.getElementById("description1").innerHTML = langEN.description1;
    document.getElementById("description2").innerHTML = langEN.description2;
    document.getElementById("redirectionIndex").innerHTML = langEN.redirectionIndex;
    document.getElementById("redirectionP1").innerHTML = langEN.point1;
    document.getElementById("redirectionP2").innerHTML = langEN.point2;
    document.getElementById("redirectionP3").innerHTML = langEN.point3;
    document.getElementById("developedby").innerHTML = langEN.developedBy;
    document.getElementById("point1").innerHTML = langEN.point1;
    document.getElementById("point2").innerHTML = langEN.point2;
    document.getElementById("point3").innerHTML = langEN.point3;
    document.getElementById("information").innerHTML = langEN.information;
    document.getElementById("descriptionp1").innerHTML = langEN.descriptionp1;
    document.getElementById("descriptionp2").innerHTML = langEN.descriptionp2;
    document.getElementById("descriptionp3").innerHTML = langEN.descriptionp3;
    document.getElementById("goto1").innerHTML= langEN.goTo;
    document.getElementById("goto2").innerHTML= langEN.goTo;
    document.getElementById("goto3").innerHTML= langEN.goTo;

}

function setLangES(){
    document.getElementById("description1").innerHTML = langES.description1;
}