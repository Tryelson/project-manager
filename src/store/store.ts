import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from "../api/user";
import { contractsApi } from "../api/contracts"
import { projectsApi } from "../api/projects"
import projectReducer from "../store/projectSlice"
import tasksReducer from "../store/tasksSlice"
import taskListReducer from "../store/taskList"
import reloadTableReducer from "../store/reloadTable"
import { tasksApi } from "../api/tasks";
import { statusesApi } from "../api/statuses";
import { appointmentsApi } from "../api/appointments";
import appointmentsReducer from "../store/appointmentsState"

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        project: projectReducer,
        taskSlice: tasksReducer,
        appointmentsState: appointmentsReducer,
        taskList: taskListReducer,
        reloadTable: reloadTableReducer,
        [contractsApi.reducerPath]: contractsApi.reducer,
        [projectsApi.reducerPath]: projectsApi.reducer,
        [tasksApi.reducerPath]: tasksApi.reducer,
        [statusesApi.reducerPath]: statusesApi.reducer,
        [appointmentsApi.reducerPath]: appointmentsApi.reducer
    },
    
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware).concat(contractsApi.middleware).concat(projectsApi.middleware).concat(tasksApi.middleware).concat(statusesApi.middleware).concat(appointmentsApi.middleware)
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch