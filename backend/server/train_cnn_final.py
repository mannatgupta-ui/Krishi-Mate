import tensorflow as tf
from tensorflow.keras.applications import EfficientNetV2S
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

# ===============================
# CONFIG
# ===============================
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS_STAGE1 = 10
EPOCHS_STAGE2 = 20
NUM_CLASSES = len(os.listdir("backend/dataset/train"))

# ===============================
# DATA GENERATORS (SAFE AUGMENTATION)
# ===============================
train_gen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=25,
    width_shift_range=0.1,
    height_shift_range=0.1,
    zoom_range=0.15,
    brightness_range=[0.85, 1.15],
    horizontal_flip=True
)

val_gen = ImageDataGenerator(rescale=1./255)

train_data = train_gen.flow_from_directory(
    "backend/dataset/train",
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical"
)

val_data = val_gen.flow_from_directory(
    "backend/dataset/val",
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical"
)

# ===============================
# BASE MODEL
# ===============================
base_model = EfficientNetV2S(
    include_top=False,
    weights="imagenet",
    input_shape=(IMG_SIZE, IMG_SIZE, 3)
)

base_model.trainable = False  # STAGE 1

# ===============================
# CUSTOM HEAD
# ===============================
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(512, activation="relu")(x)
x = Dropout(0.4)(x)
output = Dense(NUM_CLASSES, activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=output)

# ===============================
# STAGE 1: TRAIN HEAD
# ===============================
model.compile(
    optimizer=Adam(learning_rate=1e-3),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

callbacks = [
    EarlyStopping(patience=5, restore_best_weights=True),
    ReduceLROnPlateau(patience=3, factor=0.3),
    ModelCheckpoint("plant_disease_best.keras", save_best_only=True)
]

model.fit(
    train_data,
    validation_data=val_data,
    epochs=EPOCHS_STAGE1,
    callbacks=callbacks
)

# ===============================
# STAGE 2: FINE TUNING
# ===============================
# Unfreeze TOP 40% layers
for layer in base_model.layers[int(len(base_model.layers)*0.6):]:
    layer.trainable = True

model.compile(
    optimizer=Adam(learning_rate=5e-6),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.fit(
    train_data,
    validation_data=val_data,
    epochs=EPOCHS_STAGE2,
    callbacks=callbacks
)

# ===============================
# SAVE FINAL MODEL
# ===============================
model.save("plant_disease_efficientnetv2s_final.keras")
print("✅ FINAL MODEL SAVED")
