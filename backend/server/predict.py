import os
import tensorflow as tf
import json
import numpy as np
from tensorflow.keras.preprocessing import image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# model is in backend/
model_path = os.path.join(BASE_DIR, "..", "plant_disease_model.keras")
model = tf.keras.models.load_model(model_path)

# class names are in project root
with open(os.path.join(BASE_DIR, "..", "..", "class_names.json")) as f:
    class_names = json.load(f)

# load image
img_path = os.path.join(BASE_DIR, "test_images", "leaf.jpg")
img = image.load_img(img_path, target_size=(224, 224))

img = image.img_to_array(img) / 255.0
img = np.expand_dims(img, axis=0)

pred = model.predict(img)
pred_class = class_names[str(np.argmax(pred))]
confidence = np.max(pred)

print("Predicted disease:", pred_class)
print("Confidence:", confidence)
