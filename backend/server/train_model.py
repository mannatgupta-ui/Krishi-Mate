import os
import json
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import EfficientNetV2B2
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import ModelCheckpoint, ReduceLROnPlateau, EarlyStopping

# =========================
# PATHS
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "..", "dataset")

TRAIN_DIR = os.path.join(DATASET_DIR, "train")
VAL_DIR = os.path.join(DATASET_DIR, "val")
TEST_DIR = os.path.join(DATASET_DIR, "test")

# =========================
# CONFIG
# =========================
IMG_SIZE = (224, 224)
BATCH_SIZE = 16  # EfficientNetV2B2 might need smaller batch size for 224x224 on standard GPUs
EPOCHS_STAGE_1 = 5
EPOCHS_STAGE_2 = 25

# =========================
# DATA GENERATORS
# =========================
# EfficientNetV2 expects inputs in [0, 255], so NO rescale=1./255
train_gen = ImageDataGenerator(
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode="nearest"
)

val_gen = ImageDataGenerator() # No rescale
test_gen = ImageDataGenerator() # No rescale

train_data = train_gen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical"
)

val_data = val_gen.flow_from_directory(
    VAL_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical"
)

test_data = test_gen.flow_from_directory(
    TEST_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False
)

NUM_CLASSES = train_data.num_classes

# =========================
# MODEL – EFFICIENTNET V2 B2
# =========================
base_model = EfficientNetV2B2(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

# Freeze base model (Stage 1)
base_model.trainable = False

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(512, activation="relu")(x)
x = Dropout(0.3)(x) # Slightly reduced dropout for EfficientNet
outputs = Dense(NUM_CLASSES, activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=outputs)

# =========================
# CALLBACKS
# =========================
checkpoint = ModelCheckpoint(
    "plant_disease_efficientnetv2b2.keras",
    monitor="val_accuracy",
    save_best_only=True,
    mode="max",
    verbose=1
)

reduce_lr = ReduceLROnPlateau(
    monitor="val_loss",
    factor=0.2,
    patience=3,
    min_lr=1e-6,
    verbose=1
)

early_stop = EarlyStopping(
    monitor="val_accuracy",
    patience=7,
    restore_best_weights=True,
    verbose=1
)

# =========================
# STAGE 1 TRAINING
# =========================
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

print("\n🚀 Starting Stage 1: Frozen Base Model...")
model.fit(
    train_data,
    validation_data=val_data,
    epochs=EPOCHS_STAGE_1,
    callbacks=[checkpoint]
)

# =========================
# FINE TUNING – STAGE 2
# =========================
# Unfreeze top layers
base_model.trainable = True

# Fine-tune with a very low learning rate
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

print("\n🚀 Starting Stage 2: Fine Tuning...")
model.fit(
    train_data,
    validation_data=val_data,
    epochs=EPOCHS_STAGE_2,
    callbacks=[checkpoint, reduce_lr, early_stop]
)

# =========================
# SAVE METADATA
# =========================
# Save class indices for inference mapping
with open("disease_class_indices.json", "w") as f:
    json.dump(train_data.class_indices, f)

model.save("plant_disease_efficientnetv2b2.keras")

print("✅ Training complete. Model saved as plant_disease_efficientnetv2b2.keras")
