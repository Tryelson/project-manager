import { createSlice } from "@reduxjs/toolkit";

export interface ProjectState {
    id: number
    name: string
}

const initialState: ProjectState = {
    id: 0,
    name: '',
}

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setProject(state, action){
            return action.payload
        }
    }
})

export const { setProject } = projectSlice.actions
export default projectSlice.reducer