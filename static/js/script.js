const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const micBtn = document.getElementById("mic-btn");
const clearBtn = document.getElementById("clear-btn");
const statusText = document.getElementById("status");
const orb = document.getElementById("orb");

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;

if(SpeechRecognition){

recognition = new SpeechRecognition();

recognition.lang = "en-US";

recognition.interimResults = false;

recognition.maxAlternatives = 1;

}

function addMessage(sender,text,type){

const message=document.createElement("div");

message.className="message "+type;

message.innerHTML=`
<strong>${sender}</strong>
<p>${text}</p>
`;

chatBox.appendChild(message);

chatBox.scrollTop=chatBox.scrollHeight;

}

async function askAI(message){

statusText.innerHTML="🤖 Thinking...";

try{

const response=await fetch("/chat",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
message:message
})

});

const data=await response.json();

addMessage("🤖 Assistant",data.reply,"ai");

statusText.innerHTML="🔊 Speaking...";

const speech=new SpeechSynthesisUtterance(data.reply);

speech.lang="en-US";

speech.rate=1;

speech.pitch=1;

speech.onstart=function(){

orb.classList.add("listening");

};

speech.onend=function(){

orb.classList.remove("listening");

statusText.innerHTML="✅ Ready";

};

window.speechSynthesis.cancel();

window.speechSynthesis.speak(speech);

}catch(error){

addMessage("System","Server Error","ai");

statusText.innerHTML="❌ Error";

}

}

sendBtn.addEventListener("click",()=>{

const text=userInput.value.trim();

if(text==="") return;

addMessage("🧑 You",text,"user");

userInput.value="";

askAI(text);

});

userInput.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

sendBtn.click();

}

});

if(recognition){

micBtn.addEventListener("click",()=>{

window.speechSynthesis.cancel();

recognition.start();

statusText.innerHTML="🎤 Listening...";

orb.classList.add("listening");

});

recognition.onresult=function(event){

const transcript=event.results[0][0].transcript;

addMessage("🧑 You",transcript,"user");

orb.classList.remove("listening");

askAI(transcript);

};

recognition.onerror=function(){

statusText.innerHTML="❌ Speech Error";

orb.classList.remove("listening");

};

}

clearBtn.addEventListener("click",()=>{

chatBox.innerHTML="";

statusText.innerHTML="🗑 Chat Cleared";

});