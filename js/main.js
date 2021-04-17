var arrayTable = new Array();
var span = document.createElement('span');
var subredSeleccionada;

function generarNumeroRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }




function calculate() {
    
   
    //obtiene valores de los input de la direccion ip
    var q1 = document.getElementById("q1").value;
    var q2 = document.getElementById("q2").value;
    var q3 = document.getElementById("q3").value;
    var q4 = document.getElementById("q4").value;
    var cidr = document.getElementById("cidr").value;

    
    //validar input de los campos de direccion
    if(q1 === "" || q2 === "" || q3 === "" || q3 === "" || q4 === "" || cidr === ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Faltan campos por ingresar!',
          })

    }else if (
        q1 >= 0 &&
        q1 <= 255 &&
        q2 >= 0 &&
        q2 <= 255 &&
        q3 >= 0 &&
        q3 <= 255 &&
        q4 >= 0 &&
        q4 <= 255 &&
        cidr >= 0 &&
        cidr <= 32
    ) {
        var verMas = document.getElementById("ver");
        verMas.style.display = 'inline';
    
        var tituloListado = document.getElementById("tituloListado");
        tituloListado.style.display = 'inline';

   

        //conversion de ip a binario
        var ipBin = {};
        ipBin[1] = String("00000000" + parseInt(q1, 10).toString(2)).slice(-8);
        ipBin[2] = String("00000000" + parseInt(q2, 10).toString(2)).slice(-8);
        ipBin[3] = String("00000000" + parseInt(q3, 10).toString(2)).slice(-8);
        ipBin[4] = String("00000000" + parseInt(q4, 10).toString(2)).slice(-8);

      

        //mascara de red
        var mask = cidr;
        var importantBlock = Math.ceil(mask / 8);
        var importantBlockBinary = ipBin[importantBlock];
        var maskBinaryBlockCount = mask % 8;
        if (maskBinaryBlockCount == 0) importantBlock++;
        var maskBinaryBlock = "";
        var maskBlock = "";
        for (var i = 1; i <= 8; i++) {
            if (maskBinaryBlockCount >= i) {
                maskBinaryBlock += "1";
            } else {
                maskBinaryBlock += "0";
            }
        }
        //mascara binario a decimal
        maskBlock = parseInt(maskBinaryBlock, 2);

        //broadcast 
        var netBlockBinary = "";
        var bcBlockBinary = "";
        for (var i = 1; i <= 8; i++) {
            if (maskBinaryBlock.substr(i - 1, 1) == "1") {
                netBlockBinary += importantBlockBinary.substr(i - 1, 1);
                bcBlockBinary += importantBlockBinary.substr(i - 1, 1);
            } else {
                netBlockBinary += "0";
                bcBlockBinary += "1";
            }
        }

       
        var mask = "";
        var maskBinary = "";
        var bc = "";
        var netBinary = "";
        var bcBinary = "";
        var rangeA = "";
        var rangeB = "";
       
        for (var i = 1; i <= 4; i++) {
            if (importantBlock > i) {
               
                mask += "255";
                maskBinary += "11111111";
                netBinary += ipBin[i];
                bcBinary += ipBin[i];
                bc += parseInt(ipBin[i], 2);
            } else if (importantBlock == i) {
                
                mask += maskBlock;
                maskBinary += maskBinaryBlock;
                netBinary += netBlockBinary;
                bcBinary += bcBlockBinary;
                bc += parseInt(bcBlockBinary, 2);
            } else {
               
                mask += 0;
                maskBinary += "00000000";
                netBinary += "00000000";
                bcBinary += "11111111";
                bc += "255";
            }
            //agrega . separador excepto en el ultimo octecto
            if (i < 4) {
                mask += ".";
                maskBinary += ".";
                netBinary += ".";
                bcBinary += ".";
                bc += ".";
            }
        }
        net = convertirIpBinDecimal(hallarDireccionRedHost());
        rangeA = sumarIP(net);
        rangeB = restarIP(bc);


        //Numero de bits para encontrar los hosts
        var numHost = 32 - cidr;
        var canDirecciones = Math.pow(2, numHost) - 2;
        //escribe los resultados en la pagina
        document.getElementById("resIP").innerHTML = q1+"."+q2+"."+q3+"."+q4;
        document.getElementById("resMask").innerHTML = mask;
        document.getElementById("resBC").innerHTML = bc;
        document.getElementById("resRange").innerHTML = rangeA + " - " + rangeB;
        document.getElementById("resNet").innerHTML = net;
        document.getElementById("resNumBitsHost").innerHTML = numHost;
        document.getElementById("resNumBitsRed").innerHTML = cidr;
        document.getElementById("resNumDirecciones").innerHTML = canDirecciones;
       
        span.innerHTML="";
        while (lista.firstChild) {
           lista.removeChild(lista.firstChild);
        }
        var ipAsignada = rangeA;
        lista = document.getElementById("lista");
        listado = document.createElement("LI");
        ip = document.createTextNode(ipAsignada);
        listado.appendChild(ip);
        lista.appendChild(listado);
        lista = document.getElementById("lista");
        var con = 0;

        for (var i = canDirecciones; i > 1; i--) {
            if (con < 3) {
                lista = document.getElementById("lista");
                listado = document.createElement("LI");
                ipAsignada = sumarIP(ipAsignada);
                ip = document.createTextNode(ipAsignada);
                listado.appendChild(ip);
                lista.appendChild(listado);
                con++;
            }
            if (con == 3) {
                span.style.display = 'none';
                span.id = 'more';
                lista.append(span);
                con++;
            }
            if (con > 3) {
                listado = document.createElement("LI");
                ipAsignada = sumarIP(ipAsignada);
                ip = document.createTextNode(ipAsignada);
                listado.appendChild(ip);
                span.append(listado);

            }
        }
    } 
}

function hallarDireccionRedHost() {
    var q1 = document.getElementById("q1").value;
    var q2 = document.getElementById("q2").value;
    var q3 = document.getElementById("q3").value;
    var q4 = document.getElementById("q4").value;
    var cidr = document.getElementById("cidr").value;


    let ipBinario = {};
    ipBinario[1] = String("00000000" + parseInt(q1, 10).toString(2)).slice(-8);
    ipBinario[2] = String("00000000" + parseInt(q2, 10).toString(2)).slice(-8);
    ipBinario[3] = String("00000000" + parseInt(q3, 10).toString(2)).slice(-8);
    ipBinario[4] = String("00000000" + parseInt(q4, 10).toString(2)).slice(-8);
    let mascara = hallarMascara(cidr);

    var ipRed = {};
    for (var i = 1; i <= 4; i++) {

        var auxIp = "";
        var arregloIp = ipBinario[i].split('');
        var arregloMascara = mascara[i].split('');
        var length = arregloIp.length;
        for (var j = 0; j < length; j++) {
            var resul = parseInt(arregloIp[j], 10) + parseInt(arregloMascara[j], 10)
            if ((resul) == 2) {
                auxIp += "1";
            } else {
                auxIp += "0";
            }
        }
        ipRed[i] = auxIp;

    }

    return ipRed;

}

function hallarDireccionRedRandom(ip, cidr) {
    var ipSplit = ip.split('.');
    q1 = ipSplit[0];
    q2 = ipSplit[1];
    q3 = ipSplit[2];
    q4 = ipSplit[3];
    let ipBinario = {};
    ipBinario[1] = String("00000000" + parseInt(q1, 10).toString(2)).slice(-8);
    ipBinario[2] = String("00000000" + parseInt(q2, 10).toString(2)).slice(-8);
    ipBinario[3] = String("00000000" + parseInt(q3, 10).toString(2)).slice(-8);
    ipBinario[4] = String("00000000" + parseInt(q4, 10).toString(2)).slice(-8);
    let mascara = hallarMascara(cidr);

    var ipRed = {};
    for (var i = 1; i <= 4; i++) {

        var auxIp = "";
        var arregloIp = ipBinario[i].split('');
        var arregloMascara = mascara[i].split('');
        var length = arregloIp.length;
        for (var j = 0; j < length; j++) {
            var resul = parseInt(arregloIp[j], 10) + parseInt(arregloMascara[j], 10)
            if ((resul) == 2) {
                auxIp += "1";
            } else {
                auxIp += "0";
            }
        }
        ipRed[i] = auxIp;

    }

    return ipRed;

}


function sumarIP(ip) {
    var bloques = ip.split(".");
    var ipNueva = "";
    var sumado = false
    for (var i = 4; i > 1; i--) {
        if (!sumado) {
            var bloqueActual = parseInt(bloques[i], 10);
            if (bloqueActual < 255) {
                bloqueActual += 1;
                sumado = true;
            } else {
                bloqueActual = 0;
            }
            bloques[i] = bloqueActual;
        }

    }

    for (var i = 0; i < bloques.length - 1; i++) {
        if (i == bloques.length - 2) {
            ipNueva += bloques[i] + "";
        } else {
            ipNueva += bloques[i] + ".";
        }
    }

    return ipNueva;

}

function restarIP(ip) {
    var bloques = ip.split(".");
    var ipNueva = "";
    var restado = false
    for (var i = 4; i > 1; i--) {
        if (!restado) {
            var bloqueActual = parseInt(bloques[i], 10);
            if (bloqueActual > 0) {
                bloqueActual -= 1;
                restado = true;
            } else {
                bloqueActual = 255;
            }
            bloques[i] = bloqueActual;
        }

    }

    for (var i = 0; i < bloques.length - 1; i++) {
        if (i == bloques.length - 2) {
            ipNueva += bloques[i] + "";
        } else {
            ipNueva += bloques[i] + ".";
        }
    }

    return ipNueva;

}


function calculatePunto2() {
  
    var q1 = document.getElementById("q1").value;
    var q2 = document.getElementById("q2").value;
    var q3 = document.getElementById("q3").value;
    var q4 = document.getElementById("q4").value;
    var cidr = document.getElementById("cidr").value;

    //validar input de los campos de direccion
    if(q1 === "" || q2 === "" || q3 === "" || q3 === "" || q4 === "" || cidr === ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Faltan campos por ingresar!',
          })

    }else if (
        q1 >= 0 &&
        q1 <= 255 &&
        q2 >= 0 &&
        q2 <= 255 &&
        q3 >= 0 &&
        q3 <= 255 &&
        q4 >= 0 &&
        q4 <= 255 &&
        cidr >= 0 &&
        cidr <= 32
    ) {
        var verMas = document.getElementById("ver");
        verMas.style.display = 'inline';
    
        var tituloListado = document.getElementById("tituloListado");
        tituloListado.style.display = 'inline';

        
        var ipRed = convertirIpBinDecimal(hallarDireccionRedHost());
        var ipMascara = convertirIpBinDecimal(hallarMascara());
        var rangeA = sumarIP(ipRed);
        var numHost = 32 - cidr;
        var canDirecciones = Math.pow(2, numHost) - 2;
        var ipAsignada = rangeA;



        //Listado de direcciones asignables
        span.innerHTML="";
        while (lista.firstChild) {
           lista.removeChild(lista.firstChild);
        }
        lista = document.getElementById("lista");
        listado = document.createElement("LI");
        ip = document.createTextNode(ipAsignada);
        listado.appendChild(ip);
        lista.appendChild(listado);

        var con = 0;
        for (var i = canDirecciones; i > 2; i--) {
            if (con < 3) {
                lista = document.getElementById("lista");
                listado = document.createElement("LI");
                ipAsignada = sumarIP(ipAsignada);
                ip = document.createTextNode(ipAsignada);
                listado.appendChild(ip);
                lista.appendChild(listado);
                con++;
            }
            if (con == 3) {
                span.style.display = 'none';
                span.id = 'more';
                lista.append(span);
                con++;
            }
            if (con > 3) {
                listado = document.createElement("LI");
                ipAsignada = sumarIP(ipAsignada);
                ip = document.createTextNode(ipAsignada);
                listado.appendChild(ip);
                span.append(listado);

            }



        }
        var broadcast = sumarIP(ipAsignada);
        var rangeB = restarIP(broadcast);

        document.getElementById("resIP").innerHTML = q1 + "." +q2 + "." + q3 + "." + q4;
        document.getElementById("resBC").innerHTML = broadcast;
        document.getElementById("resNumDirecciones").innerHTML = canDirecciones;
        document.getElementById("resRange").innerHTML = rangeA + " - " + rangeB;
        document.getElementById("resNet").innerHTML = ipRed;




    } else {
        alert("Ip ingresada no válida");
    }
}

function convertirIpBinDecimal(ip) {
    var ipString = "";
    for (var i = 1; i <= 4; i++) {
        if (i != 4)
            ipString += parseInt(ip[i], 2) + ".";
        else
            ipString += parseInt(ip[i], 2);
    }


    return ipString;
}



var  tocado = false;
//Boton ver mas 
function verMas() {


    var button = document.getElementById("ver");
    var txt =  button.textContent;
    if (tocado==false){

      span.style.display ="inline" ;
      button.textContent = "Ver menos";
      tocado = true;

//Boton buscar de la subred

    } else{
      span.style.display ="none" ;
      tocado =false;
      button.textContent = "Ver mas";
    }

}

function hallarMascara(mascara) {
    let mascaraBin = {};
    let con = 0;
    let auxPos = 1;
    let octeto = "";
    for (var i = 1; i <= 32; i++) {
        if (con == 8) {
            mascaraBin[auxPos] = octeto;
            con = 0;
            octeto = "";
            auxPos++;
        }
        if (i <= mascara) {
            octeto += "1";

        } else {
            octeto += "0";
        }
        con++;

        if (i == 32) {
            mascaraBin[auxPos] = octeto;
        }
    }
    return mascaraBin;
}

function calculatePunto3() {
    var q1 = document.getElementById("q1").value;
    var q2 = document.getElementById("q2").value;
    var q3 = document.getElementById("q3").value;
    var q4 = document.getElementById("q4").value;
    var cidr = document.getElementById("cidr").value;
    var numBits = document.getElementById("bits").value;

    
    //validar input de los campos de direccion
    if(q1 === "" || q2 === "" || q3 === "" || q3 === "" || q4 === "" || cidr === "" || numBits === ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Faltan campos por ingresar!',
          })

    }else{
    
    var tituloListado = document.getElementById("tituloTabla");
    tituloListado.style.display = 'inline';

    var spanHost = document.getElementById("buscarHost");
    spanHost.style.display = 'none';
    var ubicacionSubred = document.getElementById("ubicacionSubred");
    ubicacionSubred.style.display = 'none';
    var spanSubred = document.getElementById("buscarSubred");
    spanSubred.style.display = 'inline';
    var spanDeterminarSubred = document.getElementById("determinarSubred");
    spanDeterminarSubred.style.display = 'inline';

    var compararIp = document.getElementById("mismaRed");
    compararIp.style.display = 'inline';

    var tituloComparar = document.getElementById("tituloComparar");
     tituloComparar.style.display = 'inline';

   
    document.getElementById("tituloTabla").textContent = "Tabla de subredes:";
    arrayTable = new Array();
   
    var ipRed = convertirIpBinDecimal(hallarDireccionRedHost());
    var ipMascara = convertirIpBinDecimal(hallarMascara(cidr));
    var numSubredes = 0;

    var aux = 32 - (parseInt(numBits, 10) + parseInt(cidr, 10));
    if (aux > 2) {
        numSubredes = Math.pow(2, numBits) - 2;

    }
    arrayTable.push(["# Subred", "Dirección IP", "Rango", "Broadcast"]);
    var cantidadHostXSubred = Math.pow(2, aux);
    var auxIpR = ipRed;
    var auxIp = ipRed;
    var auxRA = auxIp;
    var auxRB;
    var auxBC;
    for (var i = 0; i < numSubredes + 1; i++) {
        auxIpR = auxIp;
        auxRA = sumarIP(auxIp);
        for (var j = 1; j < cantidadHostXSubred; j++) {
            auxIp = sumarIP(auxIp);
        }
        auxRB = restarIP(auxIp);
        auxBC = auxIp
        var d;
        if (i != 0) {
            arrayTable.push(["Subred: " + (i), auxIpR, auxRA + " - " + auxRB, auxBC]);
        }


        auxIp = sumarIP(auxIp);
    }

    document.getElementById("resIP").innerHTML = q1 + "." + q2 + "." + q3 + "." + q4; 
    document.getElementById("resMask").innerHTML = ipMascara;
    document.getElementById("resNumBitsRed").innerHTML = cidr;
    document.getElementById("resNumBitsHost").innerHTML = 32 - (parseInt(numBits,10) + parseInt(cidr,10));
    document.getElementById("resNumDirecciones").innerHTML = cantidadHostXSubred;
    document.getElementById("resNet").innerHTML = ipRed;


    GenerateTable();

}

}

function GenerateTable() {

    var table = document.createElement("TABLE");
    
    table.setAttribute("class", "minimalistBlack");
    
    table.border = "1";
    

    //Obtiene numero de columnas
    var columnCount = arrayTable[0].length;

    //Agrega encbezado en la fila
    var row = table.insertRow(-1);
    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement("TH");
        
        headerCell.innerHTML = arrayTable[0][i];
        row.appendChild(headerCell);
    }

    //Agrega información de la fila
    for (var i = 1; i < arrayTable.length; i++) {
        row = table.insertRow(-1);
        for (var j = 0; j < columnCount; j++) {
            var cell = row.insertCell(-1);
            cell.innerHTML = arrayTable[i][j];
        }
    }

    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}





//Boton buscar de la subred
var tocado = false;
function buscarSubred() {

    

    var copiaArray = new Array();

    copiaArray.push(...arrayTable);

    var numSub = document.getElementById("numSubred").value;

    document.getElementById("tituloTabla").textContent = "Tabla de la subred # " + numSub + ":";

    subredSeleccionada = arrayTable[numSub];

    arrayTable = new Array();
    arrayTable.push(["# Subred", "Dirección IP", "Rango", "Broadcast"]);



    arrayTable.push(subredSeleccionada);

    GenerateTable();

    arrayTable = copiaArray;

    var spanHost = document.getElementById("buscarHost");
    spanHost.style.display = 'inline';

    var listaIp = document.getElementById("listaIP");
    listaIp.style.display = 'inline';

}



function buscarNumHost() {

    var tituloDirHost = document.getElementById("tituloDirHost");
    tituloDirHost.style.display = "inline";
    var numRed = subredSeleccionada[1];

    var numHost = document.getElementById("numHost").value;

    var numHostEncontrado = numRed;

    for (var i = 0; i < parseInt(numHost, 10); i++) {
        numHostEncontrado = sumarIP(numHostEncontrado);
    }

    document.getElementById("hostEncontrado").innerHTML = numHostEncontrado;

}

function determinarSubred() {
    var ubicacionSubred = document.getElementById("ubicacionSubred");
    ubicacionSubred.style.display = "inline";
    var ipObtenida = document.getElementById("numIP").value;
    var mask = document.getElementById("cidr").value;
    var numBits = document.getElementById("bits").value;

    var numSubred = buscarSR(ipObtenida,mask,numBits);
    document.getElementById("ubiIP").innerHTML = numSubred;
}



function compararHost(){
 
    var ip1 = document.getElementById("ipHost1").value;
    var ip2 = document.getElementById("ipHost2").value;
    var mask = document.getElementById("cidr").value;
    var numBits = document.getElementById("bits").value;

    var numS1 =  buscarSR(ip1, mask,numBits  );
    var numS2 =  buscarSR(ip2, mask,numBits  );

    if(numS1 == numS2){
        document.getElementById("respuesComparar").innerHTML = "Ambas IP's están en la subred: " + numS1;
    }else{
        document.getElementById("respuesComparar").innerHTML = "Las IP's ingresadas no pertenecen a la misma subred";
    }

    
}


function buscarSR(ip, mask, numBits){
    var inicioSubred = parseInt(mask, 10);
    var finalSubred = inicioSubred + parseInt(numBits, 10);
    var octetos = ip.split('.');
    let ipBinario = {};
    ipBinario[1] = String("00000000" + parseInt(octetos[0], 10).toString(2)).slice(-8);
    ipBinario[2] = String("00000000" + parseInt(octetos[1], 10).toString(2)).slice(-8);
    ipBinario[3] = String("00000000" + parseInt(octetos[2], 10).toString(2)).slice(-8);
    ipBinario[4] = String("00000000" + parseInt(octetos[3], 10).toString(2)).slice(-8);

    var binaria = ipBinario[1] + ipBinario[2] + ipBinario[3] + ipBinario[4] + "";

    var numSubred = parseInt(binaria.substring(inicioSubred, finalSubred), 2);
    return numSubred;

}


function mostrarHost(){
    var numHost = document.getElementById("numHostMostrar").value;
    var numSubred = document.getElementById("numSubred").value;

    var ipAsignada = arrayTable[numSubred][1];
    ipAsignada = sumarIP(ipAsignada);

    numHost = parseInt(numHost, 10);
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
     }
    for (var i = numHost; i >= 1; i--) {
       
            lista = document.getElementById("lista");
            listado = document.createElement("LI");
            ipAsignada = sumarIP(ipAsignada);
            ip = document.createTextNode(ipAsignada);
            listado.appendChild(ip);
            lista.appendChild(listado);
        
    }

}

function generarRandomPunto1(){
    var mascaraRandom = generarNumeroRandom(16, 29);

    var ipRandom = (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255));
    ipRandom = hallarDireccionRedRandom(ipRandom, mascaraRandom);
    ipRandom = convertirIpBinDecimal(ipRandom);
    var ipS = ipRandom.split('.');
    document.getElementById("q1").value = ipS[0];
    document.getElementById("q2").value = ipS[1];
    document.getElementById("q3").value = ipS[2];
    document.getElementById("q4").value = ipS[3];
    document.getElementById("cidr").value = mascaraRandom;

  }


function generarRandomPunto2(){
    
    var mascaraRandom = generarNumeroRandom(22, 29);
    var ipRandom = (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255));
    var ipS = ipRandom.split('.');
    document.getElementById("q1").value = ipS[0];
    document.getElementById("q2").value = ipS[1];
    document.getElementById("q3").value = ipS[2];
    document.getElementById("q4").value = ipS[3];
    document.getElementById("cidr").value = mascaraRandom

}

function generarRandomPunto3(){
    var mascaraRandom = generarNumeroRandom(16, 28);

    var ipRandom = (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255));
    ipRandom = hallarDireccionRedRandom(ipRandom, mascaraRandom);
    ipRandom = convertirIpBinDecimal(ipRandom);
    var ipS = ipRandom.split('.');

    
    document.getElementById("q1").value = ipS[0];
    document.getElementById("q2").value = ipS[1];
    document.getElementById("q3").value = ipS[2];
    document.getElementById("q4").value = ipS[3];
    document.getElementById("cidr").value = mascaraRandom;
    document.getElementById("bits").value = 30 - generarNumeroRandom(mascaraRandom, 28);


}