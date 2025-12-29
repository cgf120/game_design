from PIL import Image

def process_image():
    input_path = 'src/assets/ui/ui_inventory_item.png'
    output_path = 'src/assets/ui/ui_slot_bg.png'

    print(f"Opening {input_path}...")
    img = Image.open(input_path).convert("RGBA")
    
    # 1. Resize
    # 900KB is large, let's resize to a reasonable UI size, e.g., 200x200
    # Current size check
    print(f"Original size: {img.size}")
    target_size = (150, 150)
    img = img.resize(target_size, Image.Resampling.LANCZOS)
    print(f"Resized to: {img.size}")

    # 2. Convert Black to Transparent
    # We will look for pixels that are very dark and make them transparent
    datas = img.getdata()
    new_data = []

    # Threshold for "Black"
    threshold = 30 

    for item in datas:
        # item is (R, G, B, A)
        r, g, b, a = item
        
        # If dark enough, make transparent
        if r < threshold and g < threshold and b < threshold:
            # Fully transparent
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    
    print(f"Saving to {output_path}...")
    img.save(output_path, "PNG")
    print("Done.")

if __name__ == "__main__":
    process_image()
