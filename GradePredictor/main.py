import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import construct_model, construct_data

model, df = construct_model()
app = Flask(__name__)
CORS(app)


@app.route('/', methods=['POST'])
def predict():
    data = construct_data(df, request)
    graded = [(key, data[key]) for key in data.keys()]

    progression = {key: entry["value"] for (key, entry) in graded if not entry['is_expected']}
    margins = list(reversed(np.linspace(0.6, 1.5, num=17)**2))

    predictions = []

    for index, key in enumerate(progression):
        keys = [k for k in list(progression.keys())[:index + 1]]
        prediction = model.predict([
            [float(entry["value"]) if entry["value"] and k in keys else entry["expected_value"] for k, entry in graded]
        ])[0]

        predictions.append({
            'y_lower': round(max(1, prediction - margins[index]), 1),
            'y_upper': round(min(10, prediction + margins[index]), 1),
            'y_hat': round(prediction, 1)
        })

    return jsonify(predictions)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port="8000")
