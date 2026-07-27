from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from groq import Groq
import os

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

@app.route("/")
def home():
    return render_template("index.html")

# ==========================
# Chat API
# ==========================

@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

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

    try:

        response = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

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
        })

    except Exception as e:

        return jsonify({
            "reply": f"Error: {str(e)}"
        })

# ==========================
# Run App
# ==========================

if __name__ == "__main__":
    app.run()