#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

def create_placeholder(output_path, text, width=600, height=600, bg_color="#2d1b4e", text_color="#e91e8c"):
    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Draw decorative circle
    circle_color = "#3d2b5e"
    draw.ellipse([width//4, height//4, 3*width//4, 3*height//4], fill=circle_color)
    
    # Draw icon placeholder
    draw.ellipse([width//2-40, height//2-60, width//2+40, height//2-0], fill="#e91e8c")
    
    # Draw text
    bbox = draw.textbbox((0, 0), text, font=font_small)
    text_width = bbox[2] - bbox[0]
    x = (width - text_width) // 2
    draw.text((x, height//2 + 30), text, fill=text_color, font=font_small)
    
    # Draw border
    draw.rectangle([2, 2, width-3, height-3], outline="#e91e8c", width=2)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, 'JPEG', quality=85)

men_products = [
    ("m1", "Male Masturbator"), ("m2", "Cock Ring"), ("m3", "Auto Stroker"),
    ("m4", "Penis Pump"), ("m5", "Prostate Massager"), ("m6", "Extension Sleeve"),
    ("m7", "Cock Cage"), ("m8", "Anal Beads"), ("m9", "Bullet Vibrator"),
    ("m10", "Fleshlight"), ("m11", "Ball Stretcher"), ("m12", "Anal Plug"),
    ("m13", "Electric Pump"), ("m14", "G-Spot Stimulator"), ("m15", "Butt Plug"),
    ("m16", "Penis Massager"), ("m17", "Edge Trainer"), ("m18", "Prostate Vibe"),
    ("m19", "Chastity Device"), ("m20", "Ring Set"), ("m21", "Dong Vibrator"),
    ("m22", "Enlargement Cream"), ("m23", "Delay Spray"), ("m24", "Pump Set"),
    ("m25", "Masturbator Cup")
]

women_products = [
    ("w1", "Bullet Vibrator"), ("w2", "Rabbit Vibrator"), ("w3", "Silicone Dildo"),
    ("w4", "Egg Vibrator"), ("w5", "Wand Massager"), ("w6", "Finger Vibrator"),
    ("w7", "Anal Beads"), ("w8", "Butt Plug"), ("w9", "Panty Toy"),
    ("w10", "Double Toy"), ("w11", "Nipple Cups"), ("w12", "Magic Wand"),
    ("w13", "Suction Toy"), ("w14", "G-Spot Vibrator"), ("w15", "Couples Toy"),
    ("w16", "Lingerie Toy"), ("w17", "Kegel Balls"), ("w18", "Glass Dildo"),
    ("w19", "Remote Panty"), ("w20", "Lipstick Vibra"), ("w21", "Medium Plug"),
    ("w22", "Tongue Toy"), ("w23", "Massage Oil"), ("w24", "Nipple Clamps"),
    ("w25", "Deluxe Wand")
]

base = "/tmp/opencode/18-toys-kuwait/images/products"

for pid, name in men_products:
    for i in range(1, 5):
        path = f"{base}/men/{pid}-{i}.jpg"
        create_placeholder(path, name, bg_color="#2d1b4e", text_color="#e91e8c")

for pid, name in women_products:
    for i in range(1, 5):
        path = f"{base}/women/{pid}-{i}.jpg"
        create_placeholder(path, name, bg_color="#1a0a2e", text_color="#ff69b4")

print("All placeholder images created!")
