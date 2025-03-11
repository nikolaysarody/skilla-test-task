import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAppSliceInitialState } from './appSlice.types';

const appSliceInitialState: IAppSliceInitialState = {
    audioPlaying: null,
}

export const appSlice = createSlice({
    name: 'app',
    initialState: appSliceInitialState,
    reducers: {
        setAudioPlaying: (state, action: PayloadAction<string>) => {
            state.audioPlaying = action.payload;
        }
    },
})

export const {
    setAudioPlaying,
} = appSlice.actions

export default appSlice.reducer
