import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
assets_dir = os.path.join(os.getcwd(), "assets")
input_video = os.path.join(assets_dir, "originals_backup", "ASMR PROMEC LAPTOP.mp4")
output_thumb = os.path.join(assets_dir, "hero_showreel_thumb.mp4")

print(f"Creating lightweight hero card thumbnail preview video...")

# Extract 12 second loop, 640x360, CRF 26, faststart, no audio
cmd = [
    ffmpeg_exe, "-y",
    "-ss", "00:00:02",
    "-i", input_video,
    "-t", "12",
    "-vf", "scale=640:-2",
    "-c:v", "libx264",
    "-crf", "25",
    "-preset", "medium",
    "-movflags", "+faststart",
    "-an",
    output_thumb
]

res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
if res.returncode == 0:
    size = os.path.getsize(output_thumb) / 1024
    print(f"SUCCESS: Created hero_showreel_thumb.mp4 (Size: {size:.1f} KB)")
else:
    print(f"ERROR: {res.stderr}")
