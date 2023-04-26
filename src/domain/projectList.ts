export interface IProjectList {
    data: DataObject[],
    links: LinksObject,
    meta: MetaObject
}

export interface DataObject {
    id: number,
    contract_id: number,
    user_id: number,
    name: string,
    observation: string,
    sprint_points: number | null,
    start_date: Date | null,
    test_approval_date: Date | null,
    kickoff_date: Date,
    estimated_delivery: Date,
    go_live: Date
    created_at: Date,
    updated_at: Date
}

export interface LinksObject {
    first: string,
    last: string,
    next: string | null,
    prev: string | null
}

export interface MetaObject {
    current_page: number,
    from: number,
    last_page: number,
    path: string,
    per_page: number,
    to: number,
    total: number
    links: MetaLinksObject[]
}

export interface MetaLinksObject {
    active: boolean,
    label: string,
    url: string | null
}