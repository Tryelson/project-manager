import { useRouter } from "next/router";
import Project from "../";

export default function Task(){

    const router = useRouter()

    return (
        <>
            <Project defaultTaskId={router?.query?.taskId} />
        </>
    )
}