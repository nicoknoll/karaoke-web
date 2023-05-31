import os


def rename_files():
    base_path = os.path.dirname(os.path.dirname(__file__)) + "/tmp/"
    video_files = [f for f in os.listdir(base_path) if f.endswith(".mp4")]

    for file in video_files:
        file_path = base_path + file

        if "｜" in file:

            # Le monde est stone - Starmania ｜ Karaoke Version ｜ KaraFun
            parts = file.split("｜")
            title = parts[0].strip()
            title, artist = title.split(" - ", 1)
            title = title.strip()
            artist = artist.strip()

            print("from " + file_path + " to " + base_path + artist + " - " + title + ".mp4")
            os.rename(file_path, base_path + artist + " - " + title + ".mp4")

        elif ".mp4.mp4" in file:
            print("from " + file_path + " to " + base_path + file.replace(".mp4.mp4", ".mp4"))
            os.rename(file_path, base_path + file.replace(".mp4.mp4", ".mp4"))


if __name__ == "__main__":
    rename_files()
