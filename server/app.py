import os
import ffmpeg
from datetime import timedelta
from flask import Flask, render_template, send_from_directory, request
from pathlib import Path
import random
from settings import SERVER_URL

app = Flask(__name__)

VIDEO_CACHE = []


def get_video_files():
    parents = [
        str(Path(__file__).parent.parent / "videos"),
        "/mnt/videos",
        "/mnt/usb/videos",
    ]

    all_video_files = []

    for parent in parents:
        if not os.path.exists(parent):
            continue

        video_files = [f for f in os.listdir(parent) if f.endswith(".mp4")]
        # get full path
        video_files = [os.path.join(parent, f) for f in video_files]

        all_video_files.extend(video_files)

    return sorted(all_video_files, key=lambda x: os.path.basename(x.split(".")[0]))


def refresh_cache():
    global VIDEO_CACHE

    videos = []
    for i, file_path in enumerate(get_video_files()):
        file = os.path.basename(file_path)

        #info = ffmpeg.probe(file_path)
        #duration = str(timedelta(seconds=round(float(info['format']['duration'])))).split(":", 1)[1]

        thumbnail = os.path.join(os.path.dirname(file_path), f"{os.path.basename(os.path.splitext(file_path)[0])}.jpg")
        if not os.path.exists(thumbnail):
            thumbnail = ""

        videos.append(
            {
                "id": i,
                "title": os.path.splitext(file)[0],
                "duration": None, # duration,
                "thumbnail": thumbnail,
                "thumbnail_url": thumbnail and f"{SERVER_URL}/api/videos/{i}/thumbnail",
                "url": f"{SERVER_URL}/api/videos/{i}/stream",
                "file": file,
                "path": file_path,
            }
        )

    VIDEO_CACHE = videos


def ensure_cache(f):
    def wrapper(*args, **kwargs):
        if not VIDEO_CACHE:
            refresh_cache()
        return f(*args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper


@app.route('/api')
def api_view():
    return "OK", 200


@app.route('/api/videos')
@ensure_cache
def api_videos_view():
    videos = sorted(VIDEO_CACHE, key=lambda x: x["title"].lower())

    if request.args.get("search"):
        videos = [v for v in videos if request.args.get("search").lower() in v["title"].lower()]

    if request.args.get("random"):
        random.shuffle(videos)

    if request.args.get("limit"):
        videos = videos[:int(request.args.get("limit"))]

    return videos


@app.route('/api/videos/refresh')
def api_videos_refresh_view():
    refresh_cache()
    return api_videos_view()


@app.route('/api/videos/<int:video_id>')
@ensure_cache
def api_video_view(video_id):
    return VIDEO_CACHE[video_id] if video_id < len(VIDEO_CACHE) else {}


@app.route('/api/videos/<int:video_id>/stream')
@ensure_cache
def api_video_stream_view(video_id):
    video = VIDEO_CACHE[video_id] if video_id < len(VIDEO_CACHE) else {}
    directory = os.path.dirname(video["path"])
    return send_from_directory(directory, video["file"])


@app.route('/api/videos/<int:video_id>/thumbnail')
@ensure_cache
def api_video_thumbnail_view(video_id):
    video = VIDEO_CACHE[video_id] if video_id < len(VIDEO_CACHE) else {}
    directory = os.path.dirname(video["thumbnail"])
    return send_from_directory(directory, os.path.basename(video["thumbnail"]))


@app.after_request
def handle_options(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
