import { RootState } from '~/redux/store.ts';

export const SELECT_AUDIO_PLAYING = (state: RootState) => state.app.audioPlaying;