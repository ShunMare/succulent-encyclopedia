import os
from PIL import Image


def convert_images_to_webp(input_folder):
    for root, dirs, files in os.walk(input_folder):
        for file in files:
            if file.lower().endswith((".png", ".jpg", ".jpeg", ".bmp", ".tiff")):
                input_path = os.path.join(root, file)
                output_path = os.path.splitext(input_path)[0] + ".webp"
                img = Image.open(input_path)
                img.save(output_path, "webp")
                print(f"Converted {input_path} to {output_path}")


input_folder = r"C:\Users\okubo\OneDrive\ドキュメント\001_repositories\succulent-encyclopedia\public\assets\images\succulent"

convert_images_to_webp(input_folder)
