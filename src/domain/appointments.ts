import { ITask } from "./task";

export interface IMyAppointments {
    currentPage: number,
    data: IMyAppointmentsData[],
    from: number,
    per_page: number,
    last_page: number,
    to: number,
    total: number
}

export interface IMyAppointmentsData {
    id: number,
    status: string,
    final_time: string,
    task: ITask,
    time_amount: number,
}