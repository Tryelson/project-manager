export interface IContract {
    id: number,
    name: string,
    user_id: number,
    type: string,
    project_value: number,
    contract_number: string,
    estimated_due_date: string,
    hours_sold: number,
    proposal_date: Date,
    whitelabel: number,
    created_at: Date,
    updated_at: Date,
}