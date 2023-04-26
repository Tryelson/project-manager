import { createSlice } from "@reduxjs/toolkit";
import { ITask } from "../domain/task";

const initialState: ITask = {
    id: null,
    name: '',
    taskstatus: null,
    appointments: null,
    appointments_sum: null,
    task_statuses_id: null,
    tasktype: null,
    task_type_id: null,
    description: '',
    estimated_hours: null,
    deadline: null,
    timeTracked: null,
    project: null,
    project_id: null,
    user: null,
    user_id: null
}

export const tasksSlice = createSlice({
    name: 'tasksSlice',
    initialState,
    reducers: {
        setTask(state, action){
            return action.payload
        },
    }
})

export const { setTask } = tasksSlice.actions
export default tasksSlice.reducer