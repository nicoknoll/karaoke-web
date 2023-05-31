import json
import os
import ffmpeg
from datetime import timedelta
import subprocess

def generate_thumbnail(in_filename):
    out_filename = os.path.dirname(in_filename) + "/" + os.path.basename(in_filename.split(".")[0]) + ".jpg"
    subprocess.call(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', in_filename, '-ss', '00:01:00.000', '-vframes', '1', out_filename])
    return out_filename


def index_videos():
    """
    Convert videos in the current folder into a json file including thumbnails url, video url, id, title and duration of each song.
    """
    video_files = [f for f in os.listdir(os.path.dirname(__file__) + "/videos") if f.endswith(".mp4")]
    video_files = sorted(video_files, key=lambda x: os.path.basename(x.split(".")[0]))

    videos = []
    for i, file in enumerate(video_files):
        file_path = os.path.dirname(__file__) + "/videos/" + file
        info = ffmpeg.probe(file_path)
        duration = str(timedelta(seconds=round(float(info['format']['duration'])))).split(":", 1)[1]
        thumbnail = generate_thumbnail(file_path)

        videos.append(
            {
                "id": i,
                "title": file.split(".")[0],
                "duration": duration,
                "thumbnail": "./videos/" + os.path.basename(thumbnail),
                "url": "./videos/" + file,
            }
        )

    with open(os.path.dirname(__file__) + "/videos.json", "w") as file:
        json.dump(videos, file)


if __name__ == "__main__":
    index_videos()
