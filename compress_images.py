import os
from PIL import Image


def compress_image(input_path, quality):
    try:
        # 画像を開く
        img = Image.open(input_path)
        # 画像のフォーマットを取得
        format = img.format

        # JPEGの場合
        if format == "JPEG":
            img.save(input_path, format="JPEG", quality=quality, optimize=True)
        # PNGの場合
        elif format == "PNG":
            img.save(input_path, format="PNG", optimize=True, compress_level=9)
        print(f"Compressed and saved {input_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")


def compress_images_in_folder(folder_path, quality):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith((".png", ".jpg", ".jpeg")):
                input_path = os.path.join(root, file)
                compress_image(input_path, quality)


# スクリプトのあるディレクトリを起点にする
base_folder = os.path.dirname(os.path.abspath(__file__))

# 圧縮品質を指定（画質が落ちない程度：85〜95の範囲で設定）
quality = 1

compress_images_in_folder(base_folder, quality)
