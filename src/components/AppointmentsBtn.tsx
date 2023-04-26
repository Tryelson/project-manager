import { Box, Flex, IconButton, Text } from "@chakra-ui/react"
import { getCookie } from "cookies-next"
import { useState, useEffect } from "react"
import { FaPlay, FaPause } from "react-icons/fa"
import { useSetAppointmentsMutation } from "../api/appointments"
import { Timer } from "../domain/task"
import secondsToTime from "../utils/secondsToTime"
import moment from 'moment'
import { useLazyVerifyActiveAppointmentQuery } from "../api/tasks"
import { useDispatch, useSelector } from "react-redux"
import { initializeCounter } from '../store/appointmentsState'
import { RootState } from "../store/store"

export interface IAppointmentsBtn {
    taskId?: number,
    userId?: number,
    startCounting?: boolean,
    previousAppointment?: number
}

export default function AppointmentsBtn({ taskId, userId, startCounting }: IAppointmentsBtn){

    const [verifyActiveAppointment] = useLazyVerifyActiveAppointmentQuery()
    const dispatch = useDispatch()
    const initializeCountdown = useSelector((state: RootState) => state.appointmentsState);

    const token = getCookie('auth_token')
    const [previousAppointment, setPreviousAppointment] = useState<number>()

    const [setAppointments] = useSetAppointmentsMutation()
    const [timer, setTimer] = useState<Timer>({
      seconds: 0,
      minutes: 0,
      hours: 0
    })
    const [hasAppointments, setHasAppointments] = useState(false)

    const handleInitiateAppointments = async () => {
        dispatch(initializeCounter(true))
        setHasAppointments(true)
    
        const payload = {
            token,
            appointments: {
                status: 'open',
                user_id: userId,
                task_id: taskId
            }
        }
    
        await setAppointments(payload)
    }
    
    const handleSendAppointments = async () => {
        dispatch(initializeCounter(false))
        setHasAppointments(false)
        setPreviousAppointment(0)
        setTimer({...timer, hours: 0, minutes: 0, seconds: 0})

        const payload = {
            token,
            appointments: {
                status: 'closed',
                user_id: userId,
                task_id: taskId
            }
        }
        
        await setAppointments(payload)
    }

    const handleVerifyActiveAppointment = async () => {
        const response = await verifyActiveAppointment(token)

        if(response.data?.active_task){
            setHasAppointments(true)

            let diff = moment().diff(response?.data?.active_task?.appointment?.start_time, 'seconds')
            if(diff > 0){
                setPreviousAppointment(diff)
            }
        } else{
            setHasAppointments(false)
        }
    }

    useEffect(() => {
        handleVerifyActiveAppointment()
    }, [initializeCountdown])

    useEffect(() => {
        if(previousAppointment){
            let { timer: previousTimer } = secondsToTime(previousAppointment)
            setTimer({...timer, hours: previousTimer.hours, minutes: previousTimer.minutes, seconds: previousTimer.seconds})
        }
    }, [previousAppointment])

    useEffect(() => {
      if(hasAppointments){
        const clearTimer =  setInterval(() => {
          setTimer({...timer, seconds: timer.seconds + 1})
  
          if(timer.seconds >= 59){
            setTimer({...timer, minutes: timer.minutes + 1, seconds: 0})
          }
          
          if(timer.minutes >= 59){
            setTimer({...timer, hours: timer.hours + 1, minutes: 0})
          }
        }, 1000)
  
        return () => clearInterval(clearTimer)
      } else {
        setTimer({hours: 0, minutes: 0, seconds: 0})
      }
    }, [hasAppointments, timer.seconds])

    useEffect(() => {
        setHasAppointments(startCounting)
    }, [startCounting])

    return (
        <Flex align={'center'} gap={'15px'}>
            <Flex borderRadius='6px' align={'center'} gap='10px' w='120px' justify={'space-between'}>
                {
                    !hasAppointments ? (
                        <IconButton
                        aria-label="Iniciar Apontamento"
                        icon={<FaPlay color="#CC943C" />}
                        bgColor='transparent'
                        onClick={() => handleInitiateAppointments()}
                        _focusVisible={{border: 0}}
                        />

                    ) : (
                        <IconButton
                        aria-label="Parar Apontamento"
                        icon={<FaPause color="#CC943C" />}
                        bgColor='transparent'
                        onClick={() => handleSendAppointments()}
                        _focusVisible={{border: 0}}
                        />
                    )
                }
                <Text fontSize={'1.125rem'}>{`${timer.hours > 9 ? timer.hours : `0${timer.hours}`}:${timer.minutes > 9 ? timer.minutes : `0${timer.minutes}`}:${timer.seconds > 9 ? timer.seconds : `0${timer.seconds}`}`}</Text>
            </Flex>
        </Flex>
    )
}