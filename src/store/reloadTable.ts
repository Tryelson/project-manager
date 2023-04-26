import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isTableLoading: true,
    reloadData: false
}
export interface IReloadTable {
    isTableLoading: boolean
    reloadData: boolean
}

export const reloadTable = createSlice({
    name: 'reloadTable',
    initialState,
    reducers: {
        handleReloadtable(state, action){
            return action.payload
        },
    }
})

export const { handleReloadtable } = reloadTable.actions
export default reloadTable.reducer