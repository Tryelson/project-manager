import { UserObject } from "./user";

export interface IResponsible {
  id: number;
  active: boolean;
  email: string;
  name: string;
  last_name: string;
  profile_photo_url: string;
  role: string;
  initials: string;
}

export interface ITask {
  id: number;
  name: string;
  description: string;
  project: IProjectTask;
  project_id: number;
  tasktype: ITaskType;
  taskstatus: null;
  task_statuses_id: number;
  user: IResponsible;
  user_id: number;
  task_type_id: number;
  estimated_hours: string;
  deadline: string;
  appointments: ITaskUsersAppointments;
  appointments_sum: number;
  timeTracked: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface ITaskUsersAppointments {
  task_total_appointments: number;
  task_users: ITaskUsers[];
}

export interface ITaskUsers {
  appointments_sum: number;
  user: UserObject;
}

export interface IStatusType {
  id: number;
  background: string;
  color: string;
  name: string;
}

export interface ITaskType {
  id: number;
  name: string;
  background: string;
  color: string;
}

export interface IProjectTask {
  contract_id: number;
  id: number;
  user_id: number;
  sprint_points: number;
  name: string;
  observation: string;
}

export interface IUpdateTask {
  id: number;
  name: string;
  description: string;
  deadline: string;
  estimated_hours: string;
  task_type_id: number;
  project_id: number;
  user_id: number;
  task_statuses_id: number;
}

export interface Timer {
  seconds: number;
  minutes: number;
  hours: number;
}

export interface IProjects {
  id: number;
  contract_id: number;
  created_at: string;
  estimated_delivery: string;
  go_live: string;
  kickoff_date: string;
  name: string;
  observation: string;
  sprint_points: number;
  start_date: string;
  test_approval_date: string;
  updated_at: string;
  user_id: number;
}[]