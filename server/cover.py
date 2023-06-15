import os
from pathlib import Path
from time import sleep
from urllib.parse import quote

import requests

USER_AGENT = "karaoke cover finder/1.0"


def download_cover(song_query, output_path=None):
    print(f"Downloading cover for {song_query}")

    response = requests.get(f"https://api.discogs.com/database/search?q={quote(song_query)}&token=BdrvlufYqSBpRilgmskSDpYquPyqcIpulKKQqDtB", headers={"User-Agent": USER_AGENT})
    if response.status_code >= 400:
        return None

    data = response.json()["results"]
    url = data and data[0] and data[0]["cover_image"]

    print(f"Found image {url}")

    if not url:
        return None

    print(f"Downloading cover from {url}")

    response = requests.get(url, headers={"User-Agent": USER_AGENT})
    response.raise_for_status()

    if not response.content:
        return None

    if not output_path:
        output_path = f"out/cover/{song_query}.jpg"

    with open(output_path, "wb") as f:
        f.write(response.content)

    return output_path


if __name__ == "__main__":
    videos_path = str(Path(__file__).parent.parent / "videos")
    video_files = [f for f in os.listdir(videos_path) if f.endswith(".mp4")]

    for video_file in video_files:
        song_query = os.path.splitext(video_file)[0]
        output_path = f"{videos_path}/{song_query}.jpg"

        if os.path.exists(output_path):
            print(f"Skipping {song_query}")
            continue

        download_cover(song_query, output_path=output_path)

        print("")
        sleep(2)
