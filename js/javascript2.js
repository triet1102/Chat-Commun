//declare STUDENT, TOKEN, MESSAGE
let student = {
    "Code": "TRAT11029806"
};
let Token = "";
let messageStruct = document.getElementById("message__id");
var inputText = document.getElementById("message__input");


//send POST request to get TOKEN-------------------------------------------------
loginServer(); 
function loginServer(){
    const xhr = new XMLHttpRequest();
    xhr.open("POST","http://www.kevin-chapron.fr:8080/login", false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function (){
        if (xhr.status == 200){
            console.log("OK");
            let data = xhr.responseText;
            let jsonResponse = JSON.parse(data);
            Token = jsonResponse["Token"];
        }
        if (xhr.status >= 400){
            console.log("PROBLEM")
        }
    };
    xhr.send(JSON.stringify(student));
};

//GET messages from server-------------------------------------------------
getDataServer();
function getDataServer(){
    let xhr = new XMLHttpRequest();
    xhr.open( "GET","http://www.kevin-chapron.fr:8080/messages" , false ); 
    xhr.setRequestHeader("Authorization",'Basic '+Token);
    xhr.onload = function (){
        if (xhr.status == 200){
            console.log("OK");
            let data = xhr.responseText;
            let jsonResponse = JSON.parse(data);
            const keys = Object.keys(jsonResponse)
            for (const key of keys) {
                addMessage(jsonResponse[key].Date,jsonResponse[key].From,jsonResponse[key].Text);
            }
        }
        else{
            console.log("PROBLEM");
        }
    };   
    xhr.send(null);
};


let authen = {
    "auth" : Token
}
//Functions to handle connection with server-------------------------------------------------
let ws = new WebSocket("ws://www.kevin-chapron.fr:8080/ws");
ws.onopen = function (event) {
    ws.send(JSON.stringify(authen));
};

ws.onmessage = function (event) {
    let conn = JSON.parse(event.data)
    addMessage(conn.Date, conn.From,conn.Text);
};

ws.onerror = function(event){
    console.log("Error Websocket : " + event.message);
};


//Send message when click on Button SEN------------------------------------------------- 
function sendMessageServer(){
    let mess = document.getElementById("message__input").value;
    // alert(mess);
    if (mess.length>0){
        let msg = {
            message: mess
        }; 
        ws.send(JSON.stringify(msg));
        document.getElementById("message__input").value = "";
    }
}

//Function Add new message to the chat-------------------------------------------------
function addMessage(DateMess,FromMess,TextMess) {
    let newDiv = document.createElement("div");
    newDiv.setAttribute("class", "message-user");
    let p1 = document.createElement("P"); 
    let p2 = document.createElement("P");  
    let p3 = document.createElement("P");
    p1.innerHTML ="[" + DateMess + "]";
    p2.innerHTML ="(" + FromMess + ") ";
    p3.innerHTML =  TextMess ;  
    newDiv.appendChild(p1);
    newDiv.appendChild(p2);
    newDiv.appendChild(p3);
    messageStruct.appendChild(newDiv);
}
//Function handle Enter button-------------------------------------------------
inputText.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        sendMessageServer();
    }
  });