import { createSlice } from "@reduxjs/toolkit";

const initialState: boolean = null

export const appointmentsState = createSlice({
    name: 'appointmentsState',
    initialState,
    reducers: {
        initializeCounter(state, action){
            return action.payload
        }
    }
})

export const { initializeCounter } = appointmentsState.actions
export default appointmentsState.reducer