import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { classnames } from '../utils/classnames';
import VideoItem from '../components/VideoItem';
import Key from '../components/Key';
import SearchField from '../components/SearchField';
import { IVideo, randomSongs, refreshIndex, searchSongs } from '../utils/api';

const Search = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q');
    const index = searchParams.get('i');

    const wrapperRef = useRef(null);

    const [searchValue, setSearchValue] = useState('');

    const [videos, setVideos]: [IVideo[], any] = useState([]);

    const [selectedVideo, setSelectedVideo] = useState(0);
    const [pressedKey, setPressedKey] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // initial load
        updateSearchValue(query || '');
        setSelectedVideo(index ? parseInt(index) : 0);
    }, [query]);

    const updateSearchValue = (value: string) => {
        setSearchValue(value);
        setSelectedVideo(0);

        setLoading(true);

        if (value === '') {
            randomSongs().then((videos: any) => {
                setVideos(() => videos || []);
            }).catch((err) => {
                setError(err.message);
            }).finally(() => {
                setLoading(false);
            });
        } else {
            searchSongs(value).then((videos: any) => {
                setVideos(() => videos || []);
            }).catch((err) => {
                setError(err.message);
            }).finally(() => {
                setLoading(false);
            });
        }
    };

    const selectNextVideo = () => {
        if (selectedVideo < videos.length - 1) {
            setSelectedVideo(selectedVideo + 1);
        } else {
            setSelectedVideo(0);
        }
    };

    const selectPreviousVideo = () => {
        if (selectedVideo > 0) {
            setSelectedVideo(selectedVideo - 1);
        } else {
            setSelectedVideo(videos.length - 1);
        }
    };

    const startVideo = (videoId: any) => {
        if (videoId === undefined || videoId === null) return;
        navigate(`/${videoId}?q=${searchValue}&i=${videos.findIndex((v: any) => v.id === videoId)}`);
    };

    const handleListScroll = (e: any) => {
        const delta = e.deltaY;
        if (delta > 0) {
            selectNextVideo();
        } else {
            selectPreviousVideo();
        }
    };

    useEffect(() => {
        const handleShortcut = (e: any) => {
            setPressedKey(e.key);
            if (e.key === 'ArrowUp') {
                // select previous video
                e.preventDefault();
                selectPreviousVideo();
            } else if (e.key === 'ArrowDown') {
                // select next video
                e.preventDefault();
                selectNextVideo();
            } else if (e.key === 'Enter') {
                // start video
                e.preventDefault();
                if (selectedVideo >= 0) {
                    startVideo(videos[selectedVideo]?.id);
                }
            } else if (e.key === 'Escape') {
                // clear search
                e.preventDefault();
                updateSearchValue('');
            } else if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
                // refresh index, then reload
                e.preventDefault();
                setLoading(true);
                refreshIndex().then(() => {
                    updateSearchValue('');
                }).catch((err) => {
                    setError(err.message);
                }).finally(() => {
                    setLoading(false);
                });
            }
        };

        window.addEventListener('keydown', handleShortcut);
        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [selectedVideo, videos]);

    useEffect(() => {
        if (!wrapperRef.current) return;

        const onResize = () => {
            const wrapper = wrapperRef.current as any;
            const screenHeight = window.innerHeight;
            wrapper.style.transform = `scale(${Math.min(screenHeight / (wrapper.offsetHeight + 60), 1)})`;
        };

        onResize();
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [wrapperRef.current]);

    return (
        <div className="flex h-[100vh] w-full items-center justify-center gap-10 bg-neutral-900 py-10">
            <div className="flex w-[1500px] flex-col gap-4" ref={wrapperRef}>
                <div className="flex flex-col gap-4">
                    <SearchField value={searchValue} onChange={(e: any) => updateSearchValue(e.target.value)} />

                    <div className="flex justify-between gap-4 px-10 py-1 text-2xl font-medium text-neutral-600">
                        <div>
                            <span className="mr-1">
                                <Key selected={pressedKey === 'ArrowUp'}>
                                    <FontAwesomeIcon icon="arrow-up" />
                                </Key>{' '}
                                /{' '}
                                <Key selected={pressedKey === 'ArrowDown'}>
                                    <FontAwesomeIcon icon="arrow-down" />
                                </Key>{' '}
                            </span>
                            um Song auszuwählen
                        </div>

                        <div>
                            <span className="mr-1">
                                <Key selected={pressedKey === 'Enter'}>Enter</Key>
                            </span>{' '}
                            um Song zu starten
                        </div>

                        <div>
                            <span className="mr-1">
                                <Key selected={pressedKey === 'Escape'}>ESC</Key>
                            </span>{' '}
                            um Suchfeld zu leeren
                        </div>
                    </div>
                </div>

                <div className="relative">

                    {loading && (
                        <div className="flex flex-col items-center justify-center gap-4 absolute w-full h-full text-neutral-600">
                            <FontAwesomeIcon icon="spinner" spin size="3x" />
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center justify-center gap-4 absolute w-full h-full text-neutral-600">
                            <span className="text-2xl font-medium">Fehler: {error}</span>
                        </div>
                    )}

                    {!loading && !error && videos.length === 0 && (
                        <div className="flex flex-col items-center justify-center gap-4 absolute w-full h-full text-neutral-600">
                            <span className="text-2xl font-medium">Keine Treffer</span>
                        </div>
                    )}


                    <div className="absolute top-0 z-10 h-10 w-full bg-gradient-to-b from-neutral-900 to-transparent"></div>

                    <div
                        className={classnames(
                            'flex snap-y flex-col gap-4 overflow-hidden py-10 transition-[height]',
                            'h-[900px]'
                        )}
                        onWheel={handleListScroll}
                    >
                        {!loading && !error && videos.map((video: any, index: number) => (
                            <div className="snap-center">
                                <VideoItem
                                    key={video.id}
                                    video={video}
                                    selected={index === selectedVideo}
                                    onClick={() => startVideo(video.id)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="absolute bottom-0 z-10 h-10 w-full bg-gradient-to-t from-neutral-900 to-transparent"></div>
                </div>
            </div>
        </div>
    );
};

export default Search;
