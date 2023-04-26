import { Box, Flex, Text } from "@chakra-ui/react"
import { getCookie } from "cookies-next"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLazyVerifyActiveAppointmentQuery } from "../api/tasks"
import { RootState } from "../store/store"
import AppointmentsBtn from "./AppointmentsBtn"
import SideNav from "./SideNav"
import { useDispatch } from "react-redux"
import { initializeCounter } from '../store/appointmentsState'

export default function Layout({ children }){
    
    const token = getCookie('auth_token')
    const dispatch = useDispatch()

    const initializeCountdown = useSelector((state: RootState) => state.appointmentsState);
    const [verifyActiveAppointment, results] = useLazyVerifyActiveAppointmentQuery()
    const [startCounting, setStartCounting] = useState<boolean>(false)
    const [userId, setUserId] = useState<number>()
    const [taskId, setTaskId] = useState<number>()
    
    const handleVerifyActiveAppointment = async () => {
        const response = await verifyActiveAppointment(token)

        if(response.data?.active_task){
            dispatch(initializeCounter(true))
            setStartCounting(true)
            setUserId(response?.data?.active_task?.appointment?.user_id)
            setTaskId(response?.data?.active_task?.appointment?.task_id)
        } else{
            dispatch(initializeCounter(false))
            setStartCounting(false)
        }
    }

    useEffect(() => {
        handleVerifyActiveAppointment()
    }, [initializeCountdown])

    return (
        <SideNav>
            <Box>{children}</Box>
            {
                startCounting && (
                    <Flex align={'center'} gap='15px' zIndex={'2000'} position={'absolute'} right='50px' bottom='30px' padding={'5px 20px 5px 10px'} bgColor='#232323' boxShadow={'0 0 5px black'} borderRadius='10px'>

                        <AppointmentsBtn taskId={taskId} userId={userId} startCounting={startCounting} />

                        <Text>{results?.data?.active_task?.task?.name}</Text>
                    </Flex>
                )
            }
        </SideNav>
    )
}