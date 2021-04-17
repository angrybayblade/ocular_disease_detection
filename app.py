import numpy as np
import cv2
import tensorflow as tf

from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model_name = "mobilenet"
label_classes = [
    "Normal",
    "Diabetes",
    "Glaucoma",
    "Cataract",
    "AMD",
    "Hypertension",
    "Myopia",
    "Other diseases/abnormalities"
]

with open(f"./models/{model_name}/model.json", "r") as model:
    model: tf.keras.Model = tf.keras.models.model_from_json(model.read())
    model.load_weights(f"./models/{model_name}/model")


def crop_and_resize(im,):
    im_ = im.mean(axis=-1)
    ymin, *_, ymax = np.where(im_.sum(axis=1) > 0)[0]
    xmin, *_, xmax = np.where(im_.sum(axis=0) > 0)[0]

    im = im[ymin:ymax, xmin:xmax]
    im = cv2.resize(im, (224, 224), interpolation=cv2.INTER_AREA)

    return im[:, :, ::-1]


def read_image(file,) -> np.ndarray:
    im_array = np.fromstring(file.read(), np.uint8)
    return crop_and_resize(cv2.imdecode(im_array, cv2.IMREAD_COLOR))


@app.route("/predict", methods=['GET', 'POST'])
def predict():
    if request.method == "POST":
        right_eye = read_image(request.files['right'])
        left_eye = read_image(request.files['left'])

        im_in = np.hstack((left_eye.reshape(1, 224, 224, 3),
                           right_eye.reshape(1, 224, 224, 3)))
        # de_in = np.array([[float(request.form.get("age"))/100,
        #                    int(request.form.get("gender") == "Male")]])
        de_in = np.array([[0.8, 1]])
        output, = model.predict((im_in, de_in))
        label = label_classes[output.argmax(axis=-1)]

        return {
            "output": label,
            "probability": float(output.max())
        }

    return {
        "output": "Test"
    }


if __name__ == '__main__':
    app.run(
        host="localhost",
        port=80,
    )
