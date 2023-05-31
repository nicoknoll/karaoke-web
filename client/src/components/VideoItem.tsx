import { useEffect, useRef } from 'react';
import { classnames } from '../utils/classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VideoItem = ({ video, selected, ...props }: any) => {
    const { title, thumbnail, duration, id } = video;
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selected) {
            wrapperRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [selected]);

    return (
        <div
            ref={wrapperRef}
            {...props}
            className={classnames(
                'flex cursor-pointer items-center gap-8 rounded-3xl px-10 py-8 transition-colors duration-300 hover:bg-neutral-800',
                props?.className,
                selected ? 'bg-neutral-800' : ''
            )}
        >
            {thumbnail && (
                <div className="relative rounded-lg">
                    {selected ? (
                        <div
                            className="absolute h-full w-full rounded-lg bg-repeat opacity-5"
                            style={{ backgroundImage: 'url(/images/video_noise.gif)' }}
                        />
                    ) : null}
                    <img src={thumbnail} alt="" className="h-32 rounded-lg object-cover" />
                </div>
            )}

            <div className="flex flex-1 flex-col gap-5">
                <h4 className="text-5xl font-semibold text-white">{title}</h4>
                <p className="flex gap-8 text-4xl font-medium text-neutral-600">
                    <span className="flex items-center gap-2">
                        <span className="text-3xl">
                            <FontAwesomeIcon icon="hashtag" />
                        </span>
                        {id}
                    </span>

                    <span className="flex items-center gap-3">
                        <span className="text-3xl">
                            <FontAwesomeIcon icon="clock-rotate-left" />
                        </span>
                        {duration}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default VideoItem;
