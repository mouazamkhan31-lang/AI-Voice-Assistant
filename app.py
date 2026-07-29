from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from groq import Groq
import os

load_dotenv()

app = Flask(__name__)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    user_message = data.get("message")

    try:

        response = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

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
        })

    except Exception as e:

        return jsonify({
            "reply":str(e)
        })

if __name__=="__main__":
    app.run(debug=True)