from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from groq import Groq
import os

<<<<<<< HEAD
load_dotenv()

app = Flask(__name__)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)
=======
# ==========================
# Load Environment Variables
# ==========================

load_dotenv()

# API Key
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = Flask(__name__)

# ==========================
# Conversation Memory
# ==========================

conversation_history = [
    {
        "role": "system",
        "content": (
            "You are a friendly AI Voice Assistant. "
            "Give clear, short and helpful answers. "
            "Remember the conversation while chatting."
        )
    }
]

# ==========================
# Home Page
# ==========================
>>>>>>> ed757cadea60d35dd97ec28b8ecd2eccc2126a1d

@app.route("/")
def home():
    return render_template("index.html")

<<<<<<< HEAD
=======
# ==========================
# Chat API
# ==========================

>>>>>>> ed757cadea60d35dd97ec28b8ecd2eccc2126a1d
@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

<<<<<<< HEAD
    user_message = data.get("message")
=======
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({
            "reply": "Please say something."
        })

    # User message save
    conversation_history.append({
        "role": "user",
        "content": user_message
    })
>>>>>>> ed757cadea60d35dd97ec28b8ecd2eccc2126a1d

    try:

        response = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

<<<<<<< HEAD
            messages=[
                {
                    "role":"system",
                    "content":"You are a helpful AI Assistant."
                },
                {
                    "role":"user",
                    "content":user_message
                }
            ]

        )

        answer = response.choices[0].message.content

        return jsonify({
            "reply":answer
=======
            messages=conversation_history,

            temperature=0.7,

            max_tokens=500

        )

        ai_reply = response.choices[0].message.content

        # Assistant reply save
        conversation_history.append({
            "role": "assistant",
            "content": ai_reply
        })

        # Keep memory limited
        if len(conversation_history) > 11:
            conversation_history.pop(1)

        return jsonify({
            "reply": ai_reply
>>>>>>> ed757cadea60d35dd97ec28b8ecd2eccc2126a1d
        })

    except Exception as e:

        return jsonify({
<<<<<<< HEAD
            "reply":str(e)
        })

if __name__=="__main__":
    app.run(debug=True)
=======
            "reply": f"Error: {str(e)}"
        })

# ==========================
# Run App
# ==========================

if __name__ == "__main__":
    app.run()
>>>>>>> ed757cadea60d35dd97ec28b8ecd2eccc2126a1d
