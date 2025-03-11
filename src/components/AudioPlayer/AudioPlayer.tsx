import { useEffect, useRef, useState } from 'react';
import './AudioPlayer.scss';
import { useFetchCallRecordMutation } from '~/shared/api/skilla.ts';
import { formatTime } from '~/components/AudioPlayer/helpers.ts';
import ActionButton from '~/components/AudioPlayer/components/ActionButton.tsx';
import DownloadSvg from '~/assets/icons/download.svg?react';
import { clsx } from 'clsx';
import { useAppDispatch } from '~/redux/store.ts';
import { useSelector } from 'react-redux';
import { SELECT_AUDIO_PLAYING } from '~/redux/slices/appSlice/appSlice.selectors.ts';
import { setAudioPlaying } from '~/redux/slices/appSlice/appSlice.ts';

interface IAudioPlayerProps {
    record: string;
    partnership_id: string;
    className?: string;
    audioId: string;
}

const AudioPlayer = (props: IAudioPlayerProps) => {
    const {
        record,
        partnership_id,
        className,
        audioId,
    } = props;
    
    const dispatch = useAppDispatch();
    const globalAudioId = useSelector(SELECT_AUDIO_PLAYING)

    const [fetchCallRecord] = useFetchCallRecordMutation();

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [isHovering, setIsHovering] = useState<boolean>(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressContainerRef = useRef<HTMLDivElement | null>(null);

    const fetchAudioFile = async (): Promise<void> => {
        setIsLoading(true);

        const res = await fetchCallRecord({ record, partnership_id }).unwrap();
        setAudioUrl(res);

        if (audioRef.current) {
            audioRef.current.load();
        }

        setIsLoading(false);
    };


    const togglePlayPause = (): void => {
        if (!audioUrl && !isLoading) {
            fetchAudioFile();
            setIsPlaying(true);
            return;
        }

        if (isLoading) {
            return;
        }

        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                dispatch(setAudioPlaying(audioId))
                audio.play().catch((err: Error) => {
                    console.error('Error playing audio:', err.message);
                });
            }
            setIsPlaying((prev) => !prev);
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!audioUrl || isLoading || !progressContainerRef.current) return;

        const progressRect = progressContainerRef.current.getBoundingClientRect();
        const clickPosition = (e.clientX - progressRect.left) / progressRect.width;
        const newTime = clickPosition * (duration || 0);

        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!progressContainerRef.current || !duration) return;

        const progressRect = progressContainerRef.current.getBoundingClientRect();
        const hoverPosition = (e.clientX - progressRect.left) / progressRect.width;
        setHoverTime(hoverPosition * duration);
    };

    const calculateProgressPercentage = (): number => {
        if (!duration) return 0;
        return (currentTime / duration) * 100;
    };

    const download = () => {
        const downloadAudio = () => {
            const a = document.createElement('a');
            a.href = String(audioUrl);
            a.download = `audio-${record}-${partnership_id}.mp3`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        if (!audioUrl) {
            fetchAudioFile()
                .then(() => {
                    downloadAudio();
                });
            return;
        }
        downloadAudio();
    };

    useEffect(() => {
        if (globalAudioId !== audioId) {
            audioRef.current?.pause();
            setIsPlaying(false);
        }
    }, [audioId, globalAudioId]);

    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    useEffect(() => {
        if (audioRef.current) {
            const audio = audioRef.current;

            const handleLoadedData = (): void => {
                setDuration(audio.duration);
                setIsLoading(false);

                if (isPlaying) {
                    dispatch(setAudioPlaying(audioId))
                    audio.play()
                        .then(() => {
                            setIsPlaying(true);
                        })
                        .catch((err: Error) => {
                            console.error('Error playing audio:', err.message);
                            setIsPlaying(false);
                        });
                }
            };

            const handleTimeUpdate = (): void => {
                setCurrentTime(audio.currentTime);
            };

            const handleEnded = (): void => {
                setIsPlaying(false);
                setCurrentTime(0);
            };

            audio.addEventListener('loadeddata', handleLoadedData);
            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('ended', handleEnded);

            return () => {
                audio.removeEventListener('loadeddata', handleLoadedData);
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('ended', handleEnded);
            };
        }
    }, [audioRef, audioUrl, isPlaying]);

    return (
        <div className={clsx(className, 'audio-player')}>
            <div className="audio-player__time-display">{formatTime(currentTime)}</div>
            <ActionButton
                onClick={togglePlayPause}
                isLoading={isLoading}
                actionType={isPlaying ? 'pause' : 'play'}
            />
            <div className="audio-player__progress-wrapper">
                {isHovering && hoverTime !== null && (
                    <div
                        className="audio-player__hover-time"
                        style={{ left: `${(hoverTime / duration) * 100}%` }}
                    >
                        {formatTime(hoverTime)}
                    </div>
                )}

                <div
                    ref={progressContainerRef}
                    className="audio-player__progress-container"
                    onClick={handleProgressClick}
                    onMouseMove={handleProgressHover}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <div
                        className="audio-player__progress-filled"
                        style={{ width: `${calculateProgressPercentage()}%` }}
                    ></div>
                </div>
            </div>

            <button
                className="audio-player__download-button"
                onClick={download}
                disabled={isLoading}
                type="button"
            >
                <DownloadSvg/>
            </button>

            <audio ref={audioRef} src={audioUrl || undefined} preload="metadata"/>
        </div>
    );
};

export default AudioPlayer;