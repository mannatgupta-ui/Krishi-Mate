import os
import shutil
import random

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE_DIR = os.path.join(BASE_DIR, "PlantVillage")
DEST_DIR = os.path.join(BASE_DIR, "dataset")

print("BASE_DIR:", BASE_DIR)
print("SOURCE_DIR exists:", os.path.exists(SOURCE_DIR))


TRAIN_RATIO = 0.7
VAL_RATIO = 0.15
TEST_RATIO = 0.15

os.makedirs(DEST_DIR, exist_ok=True)

for split in ["train", "val", "test"]:
    os.makedirs(os.path.join(DEST_DIR, split), exist_ok=True)

for class_name in os.listdir(SOURCE_DIR):
    class_path = os.path.join(SOURCE_DIR, class_name)
    if not os.path.isdir(class_path):
        continue

    images = os.listdir(class_path)
    random.shuffle(images)

    n_total = len(images)
    n_train = int(n_total * TRAIN_RATIO)
    n_val = int(n_total * VAL_RATIO)

    splits = {
        "train": images[:n_train],
        "val": images[n_train:n_train+n_val],
        "test": images[n_train+n_val:]
    }

    for split, files in splits.items():
        split_class_dir = os.path.join(DEST_DIR, split, class_name)
        os.makedirs(split_class_dir, exist_ok=True)

        for file in files:
            shutil.copy(
                os.path.join(class_path, file),
                os.path.join(split_class_dir, file)
            )

print("✅ Dataset split completed")
