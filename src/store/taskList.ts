import { createSlice } from "@reduxjs/toolkit";
import { ITask } from "../domain/task";

const initialState: ITask[] = [
    {
        id: null,
        name: '',
        taskstatus: null,
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
        user_id: null,
        appointments: null,
        appointments_sum: null
    }
]

export const taskList = createSlice({
    name: 'taskList',
    initialState,
    reducers: {
        setTaskList(state, action){
            return action.payload
        }
    }
})

export const { setTaskList } = taskList.actions
export default taskList.reducer