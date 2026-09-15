import os
import shutil
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
assets_dir = os.path.join(os.getcwd(), "assets")
backup_dir = os.path.join(assets_dir, "originals_backup")

os.makedirs(backup_dir, exist_ok=True)

video_files = [f for f in os.listdir(assets_dir) if f.endswith(".mp4")]

for video_file in video_files:
    if video_file.startswith("temp_"):
        os.remove(os.path.join(assets_dir, video_file))

print(f"Processing {len(video_files)} video files in assets/")

for video_file in video_files:
    if video_file.startswith("temp_"):
        continue
    input_path = os.path.join(assets_dir, video_file)
    backup_path = os.path.join(backup_dir, video_file)
    
    if not os.path.exists(backup_path):
        print(f"Backing up {video_file} to originals_backup/")
        shutil.copy2(input_path, backup_path)

    temp_output_path = os.path.join(assets_dir, f"temp_{video_file}")
    
    if "ASMR" in video_file:
        cmd = [
            ffmpeg_exe, "-y",
            "-i", backup_path,
            "-vf", "scale='min(1280,iw)':-2",
            "-c:v", "libx264",
            "-crf", "27",
            "-preset", "fast",
            "-movflags", "+faststart",
            "-c:a", "aac",
            "-b:a", "96k",
            temp_output_path
        ]
    else:
        cmd = [
            ffmpeg_exe, "-y",
            "-i", backup_path,
            "-vf", "scale='min(1280,iw)':-2",
            "-c:v", "libx264",
            "-crf", "26",
            "-preset", "fast",
            "-movflags", "+faststart",
            "-an",
            temp_output_path
        ]
        
    print(f"Compressing {video_file}...")
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode == 0:
        orig_size = os.path.getsize(backup_path) / (1024 * 1024)
        new_size = os.path.getsize(temp_output_path) / (1024 * 1024)
        print(f"SUCCESS: {video_file} reduced from {orig_size:.2f} MB to {new_size:.2f} MB ({(1 - new_size/orig_size)*100:.1f}% savings)")
        shutil.move(temp_output_path, input_path)
    else:
        print(f"ERROR compressing {video_file}: {res.stderr}")

print("All video compressions completed!")
