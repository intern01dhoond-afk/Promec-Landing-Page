import numpy as np
from PIL import Image, ImageFilter

img = Image.open("2nd section images/ChatGPT Image Sep 12, 2026, 11_40_21 AM.png").convert("RGB")
w, h = img.size
print(f"Image size: {w}x{h}")

arr = np.array(img, dtype=np.float32)

# Mask around the device:
# device bounds: x from ~265 to ~640, y from ~320 to ~705
mask = np.zeros((h, w), dtype=bool)

# Define exact device shape outline
for y in range(int(0.36*h), int(0.81*h)):
    for x in range(int(0.145*w), int(0.355*w)):
        mask[y, x] = True

# Also cover the yellow base reflection on floor
for y in range(int(0.81*h), int(0.98*h)):
    for x in range(int(0.16*w), int(0.30*w)):
        mask[y, x] = True

# Fast Harmonic Inpainting (iterative Laplace solver for continuous interpolation from boundary)
output = arr.copy()

# Boundary pixel coordinates and colors
b_coords = []
b_colors = []

pad = 8
for y in range(h):
    for x in range(w):
        if mask[y, x]:
            continue
        # Check if neighbor is in mask
        is_border = False
        for dy in range(-pad, pad+1):
            for dx in range(-pad, pad+1):
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and mask[ny, nx]:
                    is_border = True
                    break
            if is_border:
                break
        if is_border:
            b_coords.append((y, x))
            b_colors.append(arr[y, x])

b_coords = np.array(b_coords, dtype=np.float32) # (N, 2)
b_colors = np.array(b_colors, dtype=np.float32) # (N, 3)

# For every masked pixel, compute inverse-distance weighted color from closest boundary points
mask_y, mask_x = np.where(mask)
num_mask = len(mask_y)
print(f"Inpainting {num_mask} pixels from {len(b_coords)} boundary points...")

# Batch process to fit memory
batch_size = 5000
for i in range(0, num_mask, batch_size):
    my = mask_y[i:i+batch_size]
    mx = mask_x[i:i+batch_size]
    
    # Points shape (B, 1, 2) vs Boundary shape (1, N, 2)
    pts = np.stack([my, mx], axis=1)[:, None, :]
    dists = np.linalg.norm(pts - b_coords[None, :, :], axis=2) # (B, N)
    
    # Take top 25 nearest boundary points for sharp local interpolation
    k = min(30, len(b_coords))
    near_idx = np.argpartition(dists, k, axis=1)[:, :k]
    
    near_dists = np.take_along_axis(dists, near_idx, axis=1) # (B, k)
    near_colors = b_colors[near_idx] # (B, k, 3)
    
    weights = 1.0 / (near_dists ** 2 + 1e-4)
    weights /= np.sum(weights, axis=1, keepdims=True)
    
    interp_colors = np.sum(near_colors * weights[:, :, None], axis=1)
    
    for idx in range(len(my)):
        output[my[idx], mx[idx]] = interp_colors[idx]

clean_img = Image.fromarray(np.clip(output, 0, 255).astype(np.uint8))
# Apply light gaussian blur only inside mask for ultimate smoothness
mask_img = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))
clean_img_blurred = clean_img.filter(ImageFilter.GaussianBlur(3))

final_arr = np.array(clean_img, dtype=np.float32)
blur_arr = np.array(clean_img_blurred, dtype=np.float32)
mask_alpha = np.array(mask_img, dtype=np.float32)[:, :, None] / 255.0

result_arr = final_arr * (1 - mask_alpha * 0.5) + blur_arr * (mask_alpha * 0.5)
result_img = Image.fromarray(np.clip(result_arr, 0, 255).astype(np.uint8))

result_img.save("scratch/test_no_device.png")

result_1080 = result_img.resize((1920, 1080), Image.Resampling.LANCZOS)
result_1080.save("assets/bg_homecare_sofa_nodevice.png")
print("Successfully generated seamless clean background image!")
