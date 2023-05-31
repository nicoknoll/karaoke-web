import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Key from '../components/Key';
import { getVideo } from '../utils/api';

const Video = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoProgress, setVideoProgress] = useState(0);
    const videoDuration = videoRef.current?.duration || 0;

    const { id }: any = useParams();

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q');
    const index = searchParams.get('i');

    const goBack = () => {
        navigate(`/?q=${query}&i=${index}`);
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Escape') {
            goBack();
        } else if (e.key === 'ArrowUp') {
            if (videoRef.current) {
                videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 0.3);
            }
        } else if (e.key === 'ArrowDown') {
            if (videoRef.current) {
                videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 0.3);
            }
        } else if (e.key === 'ArrowLeft') {
            if (videoRef.current) {
                videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
            }
        } else if (e.key === 'ArrowRight') {
            if (videoRef.current) {
                videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 5);
            }
        } else if (e.key === ' ') {
            togglePlay();
        }
    };

    useEffect(() => {
        const handleTimeUpdate = () => {
            if (videoRef.current) {
                setVideoProgress(videoRef.current.currentTime || 0);
            }
        };

        const handleEnded = () => {
            goBack();
        };

        videoRef.current?.addEventListener('timeupdate', handleTimeUpdate);
        videoRef.current?.addEventListener('ended', handleEnded);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            videoRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
            videoRef.current?.removeEventListener('ended', handleEnded);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        getVideo(id).then((video: any) => {
            if (videoRef.current && video?.url) {
                videoRef.current.src = video.url;
                videoRef.current.load();
                videoRef.current.play();
            }
        });
    }, [id]);

    return (
        <div onClick={() => togglePlay()} className="bg-black">
            <video
                autoPlay
                playsInline
                className="absolute h-full w-full object-cover"
                ref={videoRef}
                controls={false}
            />

            {videoRef.current && videoRef.current.paused && (
                <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black text-2xl font-medium text-white opacity-50">
                    <span className="mr-2">
                        <Key theme="light">SPACE</Key>
                    </span>{' '}
                    um Wiedergabe fortzusetzen
                </div>
            )}

            <div className="absolute bottom-10 right-10 z-20 text-2xl font-medium text-white opacity-50">
                <div>
                    <span className="mr-1">
                        <Key theme="light">ESC</Key>
                    </span>{' '}
                    um Song zu beenden
                </div>
            </div>

            <div
                className="absolute bottom-0 z-10 h-2 bg-white opacity-50 transition-all duration-300 ease-linear"
                style={{ width: `${(Math.min(videoProgress + 0.3, videoDuration) / videoDuration) * 100}%` }}
            ></div>
        </div>
    );
};

export default Video;
