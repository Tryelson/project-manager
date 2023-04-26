import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorMode,
  useDisclosure,
  Text,
  Badge,
  Button,
  FormLabel,
  IconButton,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  List,
  ListItem,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ITask, ITaskUsersAppointments, ITaskUsers } from "../domain/task";
import { getCookie } from "cookies-next";
import { useLazyGetTaskAppointmentsQuery, useLazyGetTasksQuery } from "../api/tasks";

import { FaHourglassHalf } from "react-icons/fa";
import { LoadingScreen } from "../pages/_app";
import secondsToTime from "../utils/secondsToTime";
import TaskDetails from "./TaskDetails";
import CreateNewTask from "./CreateNewTask";
import { formatData } from "../utils/formatData";
import StatusBtn from "./StatusBtn";
import { useRouter } from "next/router";
import TableReloadingEffect from "./TableReloadingEffect";
import { handleReloadtable } from "../store/reloadTable";

interface ITableProps {
  projectId?: number;
  defaultTaskId?: string | string[];
  projectName?: string | string[]
}

export default function TableList({ projectId, defaultTaskId, projectName }: ITableProps) {
  const token = getCookie('auth_token')
  const { colorMode } = useColorMode()
  const scrollBarStyle = {
    "&::-webkit-scrollbar": {
      width: "8px",
      height: "10px",
      borderRadius: "8px",
      backgroundColor: `${colorMode == "dark" ? "#141414" : "#c5c5c5"}`,
    },

    "&::-webkit-scrollbar-thumb": {
      backgroundColor: `#CB943C`,
      borderRadius: "8px",
      height: "10px",
      width: "10px",
    },
  };
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useDispatch()

  const isTableLoading = useSelector((state: RootState) => state.reloadTable)
  
  const [getTasks, tasksResults] = useLazyGetTasksQuery()
  const [todoList, setTodoList] = useState<ITask[]>()
  const [singleTask, setSingleTask] = useState<ITask>()
  const [openNewTaskModal, setOpenNewTaskModal] = useState<boolean>(false)
  const [getTaskDetails] = useLazyGetTaskAppointmentsQuery()
  const [isDetailsLoading, setIsDetailsLoading] = useState<boolean>(false)

  const handleGetAllTasks = async () => {
    dispatch(handleReloadtable([true, false]))
    
    const payload = {
      token,
      projectId: router.query.projectId
    }

    await getTasks(payload)
    dispatch(handleReloadtable([false, false]))
  }

  // open task details modal
  const handleTaskDetails = async (taskId: string | string[]) => {
    setIsDetailsLoading(true)
    router.push(`/project/${router.query.projectId}/task/${taskId}`, undefined, { shallow: true });

    const payload = {
      token,
      taskId: taskId
    }
    const response = await getTaskDetails(payload)
    
    let singleTaskPayload = {
      ...response.data.data,
      appointments: {
        task_total_appointments: response.data.data.task_users,
        task_users: response.data.data.task_total_appointments
      }
    }
    
    onOpen();
    setSingleTask(singleTaskPayload)
    setIsDetailsLoading(false)
  };

  const createNewTaskModal = () => {
    setOpenNewTaskModal(!openNewTaskModal)
  }

  const handleDefaultOpenTaskDetails = () => {
    if(defaultTaskId){
      handleTaskDetails(defaultTaskId)
    }
  }

  const refetchTableData = async () => {
    dispatch(handleReloadtable([false, false]))
    const payload = {
      token,
      projectId: router.query.projectId
    }

    await getTasks(payload)
  }

  useEffect(() => {
    if(isTableLoading[1]){
      refetchTableData()
    }
  }, [isTableLoading[1]])

  useEffect(() => {
    handleGetAllTasks()
  }, [])

  // set todoList in table
  useEffect(() => {
    if(tasksResults){
      setTodoList(tasksResults.data?.data)
    }
  }, [tasksResults])

  useEffect(() => {
    handleDefaultOpenTaskDetails()
  }, [defaultTaskId])

  return (
    <>
      {isTableLoading[0] ? (
        <TableReloadingEffect />
      ) : (
        <>
          <Box mb="30px">
            <Button onClick={() => createNewTaskModal()}>
              + Nova Task
            </Button>
          </Box>

          <TableContainer boxShadow={colorMode == "light" ? "0 0 7px 0px #161616" : "0 0 15px 0px #161616"} borderRadius="6px" overflowY={"auto"} maxH="900px" position={"relative"} sx={scrollBarStyle}>
            <Table variant="simple" overflow={"auto"}>
              <Thead position={"sticky"} top="0" height="50px">
                <Tr bgColor={colorMode == "light" ? "#FFFFFF" : "#1E1E1E"}>
                  <Th borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"} fontWeight={"900"} color={colorMode == "light" ? "#CB943C" : "#CB943C"}>Nome da tarefa</Th>
                  <Th borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"} fontWeight={"900"} color={colorMode == "light" ? "#CB943C" : "#CB943C"}>Status</Th>
                  <Th borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"} fontWeight={"900"} color={colorMode == "light" ? "#CB943C" : "#CB943C"}>Tipo</Th>
                  <Th borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"} fontWeight={"900"} color={colorMode == "light" ? "#CB943C" : "#CB943C"}>Responsável</Th>
                  <Th borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"} fontWeight={"900"} color={colorMode == "light" ? "#CB943C" : "#CB943C"}>Estimativa</Th>
                  <Th borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"} fontWeight={"900"} color={colorMode == "light" ? "#CB943C" : "#CB943C"}>Deadline</Th>
                  <Th borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"} fontWeight={"900"} color={colorMode == "light" ? "#CB943C" : "#CB943C"}>Tempo trackeado</Th>
                </Tr>
              </Thead>

              <Tbody overflow={"auto"} h="fit-content" maxH={"900px"}>
                {
                  todoList?.length > 0 ? (
                    todoList.map((task, index) => {
                      let nameSlice = task.user?.name.split(' ')
                      let { formattedEstimate, formattedDeadline } = formatData(task?.deadline, task?.estimated_hours)
                      let formattedAppointment = secondsToTime(task.appointments_sum)

                      return (
                        <Tr onClick ={() => handleTaskDetails(task.id.toString())} key={task.id} cursor={"pointer"} bgColor={`${index % 2 == 0 ? colorMode == "light" ? "#FFFFFF" : "#1E1E1E" : colorMode == "light" ? "#FFFFFF" : "#2F2F2F" }`} _hover={{backgroundColor: colorMode == "light" ? "#efefef" : "#3b3b3b"}} border={colorMode == "light" ? "1px solid #D0D0D0" : "1px solid transparent"} boxSizing="border-box">
                          <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                            { task.name }
                          </Td>
    
                          <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                            <>
                              {
                                task.taskstatus ? (
                                  <StatusBtn status={task.taskstatus} />
                                ) : (
                                  <Flex h='40px' align='center' justify={'center'} w='100%' maxW={'130px'} bgColor={'transparent'} _hover={{opacity: '0.8'}} border='1px solid gray' borderRadius={'8px'}>
                                    <Badge color={'white'} fontWeight='bold' backgroundColor='unset' p="3px 20px" borderRadius={"5px"} cursor='pointer'>-</Badge>
                                  </Flex>
                                )
                              }
                            </>
                          </Td>

                          <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                            {
                              task?.tasktype ? (
                                <Button bgColor={task.tasktype.background} _hover={{opacity: '0.8'}} w='100%' maxW='130px'>
                                  <Badge color={task.tasktype.color} fontWeight={'bold'} backgroundColor='unset' p="3px 20px" borderRadius={"5px"} cursor='pointer'>{task.tasktype?.name}</Badge>
                                </Button>

                              ) : (
                                <Flex h='40px' align='center' justify={'center'} w='100%' maxW={'130px'} bgColor={'transparent'} _hover={{opacity: '0.8'}} border='1px solid gray' borderRadius={'8px'}>
                                    <Badge color={'white'} fontWeight='bold' backgroundColor='unset' p="3px 20px" borderRadius={"5px"} cursor='pointer'>-</Badge>
                                </Flex>
                              )
                            }
                          </Td>
    
                          <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"} display="flex" alignItems={"center"} gap="20px">
                            <>
                              {
                                task.user ? (
                                  <>
                                    <Flex borderRadius={'100%'} w='50px' h='50px' align={'center'} justify='center' fontWeight={'bold'} bgColor={'#CC953D'}>
                                      { nameSlice[0][0] }
                                      { nameSlice[1] ? nameSlice[1][0] : '' }
                                    </Flex>
                                    <Text>{task.user.name}</Text>
                                  </>
                                ) : (
                                  '-'
                                )
                              }
                            </>
                          </Td>
    
                          <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                            {
                              formattedEstimate && (
                                <>
                                  { formattedEstimate }
                                  <IconButton
                                    aria-label="Editar Estimativa"
                                    bgColor={"transparent"}
                                    icon={<FaHourglassHalf />}
                                    _hover={{backgroundColor: 'unset'}}
                                  />
                                </>
                              )
                            }
                          </Td>

                          <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>{ formattedDeadline }</Td>

                          <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>{ task.appointments_sum ? formattedAppointment.timerFormat : '-' }</Td>
                        </Tr>
                      );
                    })
                  ) : (
                    <Tr bgColor={`${colorMode == "light" ? "#FFFFFF" : "#1E1E1E"}`} border={colorMode == "light" ? "1px solid #D0D0D0" : "1px solid transparent"} boxSizing="border-box" _hover={{backgroundColor: colorMode == "light" ? "#efefef" : "#3b3b3b"}}>
                      <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                        Sem tasks no momento
                      </Td>
                      <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                        -
                      </Td>
                      <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                        -
                      </Td>
                      <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                        -
                      </Td>
                      <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                        -
                      </Td>
                      <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                        -
                      </Td>
                      <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                        -
                      </Td>
                    </Tr>
                  )
                }
              </Tbody>
            </Table>
          </TableContainer>

          {
            isDetailsLoading ? (
                <LoadingScreen />
              ) : (
                <TaskDetails task={singleTask} isOpen={isOpen} onClose={onClose} />
            )
          }

          {
            openNewTaskModal && (
              <CreateNewTask projectName={projectName} isOpen={openNewTaskModal} onClose={createNewTaskModal} />
            )
          }

        </>
      )}
    </>
  );
}

export interface ITotalTaskAppointments {
  appointments: ITaskUsersAppointments
}

export const TotalTaskAppointments = ({ appointments }: ITotalTaskAppointments) => {

  const { colorMode } = useColorMode()
  const scrollBarStyle = {
    "&::-webkit-scrollbar": {
      width: "8px",
      height: "10px",
      borderRadius: "8px",
      backgroundColor: `${colorMode == "dark" ? "#141414" : "#c5c5c5"}`,
    },

    "&::-webkit-scrollbar-thumb": {
      backgroundColor: `#CB943C`,
      borderRadius: "8px",
      height: "10px",
      width: "10px",
    },
  };
  const [userAppointments, setUserAppointments] = useState<ITaskUsers[]>()
  const [timer, setTimer] = useState<string>()

  useEffect(() => {
    const { timerFormat } = secondsToTime(appointments?.task_total_appointments)
    setTimer(timerFormat)

    if(appointments){
      setUserAppointments(appointments.task_users)
    }
  }, [appointments])
  
  return (
    <Flex gap="10px" align={"center"}>
      <FormLabel fontSize={"18px"} fontWeight='bold' m='0'>Apontamentos:</FormLabel>

      <Flex align={'center'} justify='center' h='40px'>
        <Text as='span'>{ timer ? timer : '' }</Text>
      </Flex>

      <Box h='40px'>
        <Popover placement="right" closeOnBlur={true}>
          <Flex align={"center"} gap="5px" borderRadius={"8px"}>
            {/* trigger responsible modal */}
            <PopoverTrigger>
              <IconButton
                aria-label="Editar Estimativa"
                bgColor={"transparent"}
                icon={<FaHourglassHalf />}
              />
            </PopoverTrigger>

            <PopoverContent cursor='default' ml='10px' boxShadow={'0px 0px 10px black'} bgColor='#2e2b2b' color="white" border='0'>
              <PopoverCloseButton mt='5px' />

              <PopoverHeader pt='10px' fontWeight="bold" border="0">
                Lista de apontamentos
              </PopoverHeader>

              <PopoverBody>
                <Flex w='100%'>
                  {
                    userAppointments && userAppointments.length !== 0 ? (
                      <List w='100%' borderRadius={'5px'} bgColor='#1E1E1E' maxH='200px' overflowY={'auto'} sx={scrollBarStyle}>
                        {
                          userAppointments?.map((userAppointments) => {
                            let { timer } = secondsToTime(userAppointments.appointments_sum)

                            let nameSlice = userAppointments.user.name.split(' ')
                            let initials = nameSlice[0][0] + (nameSlice[1] ? nameSlice[1][0] : '')

                            return (
                              <ListItem key={userAppointments.user.id} display={'flex'} alignItems='center' justifyContent={'space-between'} gap='10px' _hover={{backgroundColor: '#2F2F2F'}} p='8px 12px'>
                                <Flex align={'center'} gap='10px'>
                                  <Flex bgColor={'#CC943C'} w='30px' h='30px' borderRadius={'100%'} align='center' justify={'center'} fontSize='12px'>
                                    {initials}
                                  </Flex>
                                  {
                                    userAppointments.user.name.length > 18 ? `${userAppointments.user.name.substring(0, 18)}...` : userAppointments.user.name
                                  }
                                </Flex>
                                <Box>
                                  <Text as='span'>
                                    {
                                      `${timer.hours > 9 ? timer.hours : `0${timer.hours}`}:${timer.minutes > 9 ? `${timer.minutes}:` : `0${timer.minutes}:`}${timer.seconds > 9 ? `${timer.seconds}` : `0${timer.seconds}`}`
                                    }
                                  </Text>
                                </Box>
                              </ListItem>
                            )
                          })
                        }
                      </List>
                    ) : (
                      <Box bgColor='#1E1E1E' p='10px' borderRadius={'6px'} w='100%'>
                        <Text>Sem apontamentos no momento</Text>
                      </Box>
                    )
                  }
                </Flex>
                {/* <Flex align={'center'} justify={'center'} p='12px'>
                  <ThreeDots 
                    height="20" 
                    width="40" 
                    radius="9"
                    color="#CC943C" 
                    ariaLabel="three-dots-loading"
                    visible={true}
                  />
                </Flex> */}
              </PopoverBody>
              
            </PopoverContent>
          </Flex>
        </Popover>
      </Box>
    </Flex>
  )
}