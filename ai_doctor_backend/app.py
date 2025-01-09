from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure the Gemini API key
genai.configure(api_key="AIzaSyAeF-O3jqw0R4lRHo4SZ0piQ8gu6yq-35w")

@app.route('/api/ask', methods=['POST'])
def ask_gemini():
    data = request.json
    print("Received data:", data)

    age = data.get('age', 'not specified')
    gender = data.get('gender', 'not specified')
    height = data.get('height', 'not specified')
    weight = data.get('weight', 'not specified')
    concern = data.get('concern', 'not specified')
    medical_history = data.get('medicalHistory', 'not specified')

    prompt = (
        f"Patient details: Age: {age}, Gender: {gender}, Height: {height} cm, "
        f"Weight: {weight} kg, Medical History: {medical_history}. "
        f"Concern: {concern}. Provide a concise assessment of whether this is a serious issue."
    )

    try:
        # Initialize the generative model
        model = genai.GenerativeModel("gemini-2.0-flash-exp")
        chat = model.start_chat(
            history=[
                {"role": "user", "parts": prompt},
                {"role": "model", "parts": "I'm here to help. What would you like to know?"},
            ]
        )

        # Send the message and get the response
        response = chat.send_message(prompt)
        advice = response.text.strip()
        return jsonify({'advice': advice})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
