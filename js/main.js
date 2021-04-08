var arrayTable = new Array();
var span = document.createElement('span');
function calculate() {
  //get values from input box
  var q1 = document.getElementById("q1").value;
  var q2 = document.getElementById("q2").value;
  var q3 = document.getElementById("q3").value;
  var q4 = document.getElementById("q4").value;
  var cidr = document.getElementById("cidr").value;

  //validate input value
  if (
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
    //display IP address
    document.getElementById("resIP").innerHTML =
      q1 + "." + q2 + "." + q3 + "." + q4;

    //get IP Address binaries
    var ipBin = {};
    ipBin[1] = String("00000000" + parseInt(q1, 10).toString(2)).slice(-8);
    ipBin[2] = String("00000000" + parseInt(q2, 10).toString(2)).slice(-8);
    ipBin[3] = String("00000000" + parseInt(q3, 10).toString(2)).slice(-8);
    ipBin[4] = String("00000000" + parseInt(q4, 10).toString(2)).slice(-8);

    //decide standart class
    var standartClass = "";
    if (q1 <= 126) {
      standartClass = "A";
    } else if (q1 == 127) {
      standartClass = "loopback IP";
    } else if (q1 >= 128 && q1 <= 191) {
      standartClass = "B";
    } else if (q1 >= 192 && q1 <= 223) {
      standartClass = "C";
    } else if (q1 >= 224 && q1 <= 239) {
      standartClass = "D (Multicast Address)";
    } else if (q1 >= 240 && q1 <= 225) {
      standartClass = "E (Experimental)";
    } else {
      standartClass = "Out of range";
    }

    //netmask
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
    //convert binary mask block to decimal
    maskBlock = parseInt(maskBinaryBlock, 2);

    //net & broadcast addr
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

    //put everything together, create a string container variables
    var mask = "";
    var maskBinary = "";
    var net = "";
    var bc = "";
    var netBinary = "";
    var bcBinary = "";
    var rangeA = "";
    var rangeB = "";
    //loop to put whole strings block together
    for (var i = 1; i <= 4; i++) {
      if (importantBlock > i) {
        //blocks before the important block.
        mask += "255";
        maskBinary += "11111111";
        netBinary += ipBin[i];
        bcBinary += ipBin[i];
        net += parseInt(ipBin[i], 2);
        bc += parseInt(ipBin[i], 2);
      } else if (importantBlock == i) {
        //the important block.
        mask += maskBlock;
        maskBinary += maskBinaryBlock;
        netBinary += netBlockBinary;
        bcBinary += bcBlockBinary;
        net += parseInt(netBlockBinary, 2);
        bc += parseInt(bcBlockBinary, 2);
      } else {
        //block after the important block.
        mask += 0;
        maskBinary += "00000000";
        netBinary += "00000000";
        bcBinary += "11111111";
        net += "0";
        bc += "255";
      }
      //add . separator except the last block
      if (i < 4) {
        mask += ".";
        maskBinary += ".";
        netBinary += ".";
        bcBinary += ".";
        net += ".";
        bc += ".";
      }
    }

    rangeA = sumarIP(net);
    rangeB = restarIP(bc);


    //Numero de bits para encontrar los hosts
    var numHost = 32 - cidr;
    var canDirecciones = Math.pow(2, numHost) - 2;
    //write the results to the page.
    document.getElementById("resMask").innerHTML = mask;
    document.getElementById("resBC").innerHTML = bc;
    document.getElementById("resRange").innerHTML = rangeA + " - " + rangeB;
    document.getElementById("resNet").innerHTML = net;
    document.getElementById("resNumBitsHost").innerHTML = numHost;
    document.getElementById("resNumBitsRed").innerHTML = cidr;
    document.getElementById("resNumDirecciones").innerHTML = canDirecciones;
    
    var ipAsignada=rangeA;
    lista = document.getElementById("lista");
      listado = document.createElement("LI");
      ip = document.createTextNode(ipAsignada);
      listado.appendChild(ip);
      lista.appendChild(listado);

    var con = 0;
   
    for(var i = canDirecciones; i>1;i--){
      if (con<3){
      lista = document.getElementById("lista");
      listado = document.createElement("LI");
      ipAsignada = sumarIP(ipAsignada);
      ip = document.createTextNode(ipAsignada);
      listado.appendChild(ip);
      lista.appendChild(listado);
      con++;
      }
      if (con==3){
       
        //var puntos = document.createTextNode("...");
        //puntos.id = "dots";
        //listado = document.createElement("LI");
        //listado.appendChild(puntos);
        //lista.appendChild(listado);
        
        
        span.style.display ='none';
        span.id ='more';
        
        
        lista.append(span);
       
        con++;
      }
      if (con>3){
      //lista = document.getElementById("lista");
      listado = document.createElement("LI");
      ipAsignada = sumarIP(ipAsignada);
      ip = document.createTextNode(ipAsignada);
      listado.appendChild(ip);
      //lista.appendChild(listado);
      span.append(listado);
      
      }


      
    }

    
    


   
    
        
        

   
    
 
 
  } else {
    alert("invalid value");
  }
  hallarDireccionRedHost();
}



function sumarIP(ip){
  var bloques = ip.split(".");
  var ipNueva= "";
  var sumado=false
  for(var i = 4; i>1;i--){
    if(!sumado){
      var bloqueActual = parseInt(bloques[i], 10);
      if(bloqueActual<255){
        bloqueActual+=1;
        sumado = true;
      }else{
        bloqueActual = 0;
      }
      bloques[i] = bloqueActual;
    }
   
  }

  for(var i =0; i<bloques.length-1;i++){
    if(i==bloques.length-2){
      ipNueva += bloques[i] +"";
    }else{
      ipNueva += bloques[i] +".";
    }
  }

  return ipNueva;

}

function restarIP(ip){
  var bloques = ip.split(".");
  var ipNueva= "";
  var restado=false
  for(var i = 4; i>1;i--){
    if(!restado){
      var bloqueActual = parseInt(bloques[i], 10);
      if(bloqueActual>0){
        bloqueActual-=1;
        restado = true;
      }else{
        bloqueActual = 255;
      }
      bloques[i] = bloqueActual;
    }
   
  }

  for(var i =0; i<bloques.length-1;i++){
    if(i==bloques.length-2){
      ipNueva += bloques[i] +"";
    }else{
      ipNueva += bloques[i] +".";
    }
  }

  return ipNueva;

}


function calculatePunto2(){
  var q1 = document.getElementById("q1").value;
  var q2 = document.getElementById("q2").value;
  var q3 = document.getElementById("q3").value;
  var q4 = document.getElementById("q4").value;
  var cidr = document.getElementById("cidr").value;

  //validate input value
  if (
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

    var ipRed = convertirIpBinDecimal(hallarDireccionRedHost());
    var ipMascara = convertirIpBinDecimal(hallarMascara());
    var rangeA = sumarIP(ipRed);
    var numHost = 32 - cidr;
    var canDirecciones = Math.pow(2, numHost) - 2;
    var ipAsignada=rangeA;



    //Listado de direcciones asignables
    for(var i=1;i<=canDirecciones;i++){
      lista = document.getElementById("lista");
      listado = document.createElement("LI");
      if(i!=1)
        ipAsignada = sumarIP(ipAsignada);
      ip = document.createTextNode(ipAsignada);
      listado.appendChild(ip);
      lista.appendChild(listado);
    }

    var broadcast = sumarIP(ipAsignada);
    var rangeB = restarIP(broadcast);

    

  }else{
    alert("Ip ingresada no válida");
  }
}

function convertirIpBinDecimal(ip){
  var ipString = "";
  for(var i =1;i<=4;i++){
    if(i!=4)
      ipString += parseInt(ip[i], 2) + ".";
    else
     ipString += parseInt(ip[i], 2);
  }

  return ipString;
}
function hallarDireccionRedHost(){
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
  for(var i = 1;i<=4;i++){

    var auxIp="";
    var arregloIp = ipBinario[i].split('');
    var arregloMascara = mascara[i].split('');
    var length = arregloIp.length;
    for(var j =0;j<length;j++){
      var resul = parseInt(arregloIp[j], 10) + parseInt(arregloMascara[j], 10)
      if((resul) ==2){
        auxIp += "1";
      }else{
        auxIp += "0";
      }
    }
    ipRed[i] = auxIp;

  }

return ipRed;

}
function hallarMascara(mascara){
  let mascaraBin = {};
  let con=0;
  let auxPos=1;
  let octeto = "";
  for(var i =1;i<=32;i++){
    if(con==8){
        mascaraBin[auxPos] = octeto;
        con=0;
        octeto = "";
        auxPos++;
      } 
        if(i<=mascara){
          octeto += "1";
          con++;
        }else{
          octeto += "0";
        }
        
        if(i==32){
          mascaraBin[auxPos] = octeto;
        }
  }
  return mascaraBin;
}

function calculatePunto3(){
  var q1 = document.getElementById("q1").value;
  var q2 = document.getElementById("q2").value;
  var q3 = document.getElementById("q3").value;
  var q4 = document.getElementById("q4").value;
  var cidr = document.getElementById("cidr").value;
  var numBits = document.getElementById("bits").value;

  var ipRed = convertirIpBinDecimal(hallarDireccionRedHost());
  var ipMascara = convertirIpBinDecimal(hallarMascara());
  var numSubredes=0;

  var aux =  32 - (parseInt(numBits,10) + parseInt(cidr, 10));
  if(aux > 2){
    numSubredes = Math.pow(2, numBits) -2;
    
  }
  arrayTable.push(["# Subred","Dirección IP", "Rango", "Broadcast"]);
  var cantidadHostXSubred=Math.pow(2, aux);
  var auxIpR = ipRed;
  var auxIp = ipRed;
  var auxRA = auxIp;
  var auxRB;
  var auxBC;
  for(var i =0;i<numSubredes+1;i++){
    auxIpR = auxIp;
    auxRA = sumarIP(auxIp);
    for(var j =1;j<cantidadHostXSubred;j++){
      auxIp = sumarIP(auxIp);
    }
    auxRB = restarIP(auxIp);
    auxBC = auxIp
    var d;
    if(i!=0){
      arrayTable.push(["Subred: " + (i), auxIpR, auxRA + " - " + auxRB, auxBC]);
    }
     

    auxIp = sumarIP(auxIp);
  }


GenerateTable();

}

function GenerateTable() {
  
  var table = document.createElement("TABLE");
  table.border = "1";

  //Get the count of columns.
  var columnCount = arrayTable[0].length;

  //Add the header row.
  var row = table.insertRow(-1);
  for (var i = 0; i < columnCount; i++) {
      var headerCell = document.createElement("TH");
      headerCell.innerHTML = arrayTable[0][i];
      row.appendChild(headerCell);
  }

  //Add the data rows.
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


var  tocado = false;
//Boton ver mas 
function verMas() {
  
    console.log("aaaaaaaaaaaaaaaa")
    
    var button = document.getElementById("ver");
    var txt =  button.textContent;
    if (tocado==false){

      span.style.display ="inline" ;
      button.textContent = "Ver menos";
      tocado = true;


    } else{
      span.style.display ="none" ;
      tocado =false;
      button.textContent = "Ver mas";
    }

  

}
