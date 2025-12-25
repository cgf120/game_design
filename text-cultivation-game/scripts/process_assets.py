import os
from PIL import Image

def process_image(file_path):
    try:
        img = Image.open(file_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # item is (R, G, B, A)
            # Check for white-ish pixel
            # Threshold: if all RGB > 240, consider it background
            if item[0] > 230 and item[1] > 230 and item[2] > 230:
                # Make it transparent
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(file_path, "PNG")
        print(f"Processed: {file_path}")
    except Exception as e:
        print(f"Failed to process {file_path}: {e}")

def main():
    target_dir = 'src/assets/ui'
    if not os.path.exists(target_dir):
        print(f"Directory not found: {target_dir}")
        return

    for filename in os.listdir(target_dir):
        if filename.endswith(".png"):
            process_image(os.path.join(target_dir, filename))

if __name__ == "__main__":
    main()
