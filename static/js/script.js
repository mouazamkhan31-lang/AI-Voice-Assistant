<<<<<<< HEAD
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
=======
// ======================================
// AI Voice Assistant
// Part 1
// ======================================

// Buttons
const micButton = document.getElementById("mic-btn");
const clearButton = document.getElementById("clear-btn");
const downloadButton = document.getElementById("download-btn");

// UI
const chatBox = document.getElementById("chat-box");
const statusText = document.getElementById("status");
const orb = document.getElementById("orb");
const visualizer = document.getElementById("visualizer");

// Speech Recognition
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// ======================================
// Add Message
// ======================================

function addMessage(sender, text, type) {

    const now = new Date();

    const time = now.toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

    });

    const message = document.createElement("div");

    message.className = "message " + type;

    message.innerHTML = `
        <strong>${sender}</strong>
        <p>${text}</p>
        <small>${time}</small>
    `;

    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;

    return message;

}

// ======================================
// Start Listening
// ======================================

micButton.addEventListener("click", () => {

    // Stop old speech
    window.speechSynthesis.cancel();

    statusText.innerHTML = "🎤 Listening...";

    orb.className = "circle listening";

    visualizer.classList.add("active");

    recognition.start();

});

// ======================================
// Clear Chat
// ======================================

clearButton.addEventListener("click", () => {

    chatBox.innerHTML = "";

    statusText.innerHTML = "🗑️ Chat Cleared";

});

// ======================================
// Recognition Result
// ======================================

recognition.onresult = async function(event) {
        const transcript = event.results[0][0].transcript;

    // Show user message
    addMessage("🧑 You", transcript, "user");

    statusText.innerHTML = "🤖 Thinking...";

    orb.className = "circle thinking";

    visualizer.classList.remove("active");

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: transcript
            })

        });

        const data = await response.json();

        // Empty assistant message
        const assistantMessage = addMessage("🤖 Assistant", "", "ai");

        const textElement = assistantMessage.querySelector("p");

        let i = 0;

        function typeWriter() {

            if (i < data.reply.length) {

                textElement.innerHTML += data.reply.charAt(i);

                chatBox.scrollTop = chatBox.scrollHeight;

                i++;

                setTimeout(typeWriter, 15);

            } else {

                statusText.innerHTML = "🔊 Speaking...";

                orb.className = "circle speaking";

                const speech = new SpeechSynthesisUtterance(data.reply);

                speech.lang = "en-US";
                speech.rate = 1;
                speech.pitch = 1;
                speech.volume = 1;

                speech.onend = function () {

                    statusText.innerHTML = "✅ Ready";

                    orb.className = "circle";

                };

                window.speechSynthesis.cancel();

                window.speechSynthesis.speak(speech);

            }

        }

        typeWriter();

    }

    catch(error){

        addMessage("🤖 Assistant","Error connecting to AI.","ai");

        statusText.innerHTML = "❌ Error";

        orb.className = "circle";

    }

};
// ======================================
// Recognition Error
// ======================================

recognition.onerror = function (event) {

    statusText.innerHTML = "❌ Speech not recognized.";

    orb.className = "circle";

    visualizer.classList.remove("active");

    console.log(event.error);

};

// ======================================
// Recognition End
// ======================================

recognition.onend = function () {

    visualizer.classList.remove("active");

    if (statusText.innerHTML === "🎤 Listening...") {

        statusText.innerHTML = "✅ Ready";

        orb.className = "circle";

    }

};

// ======================================
// Download Chat
// ======================================

downloadButton.addEventListener("click", () => {

    let chatText = "";

    const messages = document.querySelectorAll(".message");

    messages.forEach(msg => {

        const sender = msg.querySelector("strong").innerText;
        const text = msg.querySelector("p").innerText;

        chatText += sender + "\n";
        chatText += text + "\n\n";

    });

    const blob = new Blob([chatText], {
        type: "text/plain"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "AI_Chat_History.txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

});

// ======================================
// Ready State
// ======================================

statusText.innerHTML = "✅ Ready";
>>>>>>> ed757cadea60d35dd97ec28b8ecd2eccc2126a1d
