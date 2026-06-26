#!/usr/bin/env python3
"""
Regenerate the two QR codes used on the deck's end card.

HOW TO REPLACE THE LINKS:
  1. Edit the two URLs below (FEEDBACK_URL and BEER_URL).
  2. Run:  python3 regen-qr.py
  3. Refresh the deck in your browser. Done.

No other files need to change.
"""

# ----------------------------------------------------------------------
# 👇 REPLACE THESE TWO LINES WITH YOUR REAL LINKS
FEEDBACK_URL = "https://forms.gle/your-feedback-form"   # Google Form for feedback
BEER_URL     = "https://ko-fi.com/yourname"             # Ko-fi / GCash / PayPal "buy me a beer"
# ----------------------------------------------------------------------

import os
import qrcode
from qrcode.constants import ERROR_CORRECT_M

# Always write the PNGs next to this script (slides/assets/), regardless of CWD.
HERE = os.path.dirname(os.path.abspath(__file__))

def make(url, path):
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_M,
        box_size=12,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    # On-brand colors: near-black background, off-white modules (matches deck)
    img = qr.make_image(fill_color="#0a0e0a", back_color="#f4f1ea")
    img.save(path)
    print(f"  wrote {path}  ->  {url}")

if __name__ == "__main__":
    print("Generating QR codes...")
    make(FEEDBACK_URL, os.path.join(HERE, "qr-feedback.png"))
    make(BEER_URL, os.path.join(HERE, "qr-beer.png"))
    print("Done. Refresh the deck.")
