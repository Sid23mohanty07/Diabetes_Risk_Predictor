from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS  # Allow React frontend

app = Flask(__name__)
CORS(app)

# Load model
model = joblib.load("model.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    data = np.array(data).reshape(1, -1)
    prediction = model.predict(data)[0]
    probability = model.predict_proba(data)[0][1]  # probability of diabetes
    return jsonify({
        "prediction": int(prediction),
        "probability": float(probability)
    })


if __name__ == "__main__":
    app.run(debug=True)
