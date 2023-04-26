import { TableContainer, Thead, Tbody, Tr, Td, Th, Table, useColorMode, Box, Flex, Text, FormControl, FormLabel, Input, Heading, Container, useColorModeValue, Divider, IconButton, Link, Button, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, useToast, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { useGetMyAppointmentsMutation, useEditMyAppointmentMutation, useSetManualAppointmentMutation, useDeleteAppointmentMutation } from "@api/appointments";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { IMyAppointments } from "@domain/appointments";
import secondsToTime from "@utils/secondsToTime";
import TableReloadingEffect from "@components/TableReloadingEffect";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { formatData } from "@utils/formatData";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "@store/store";
import { useDispatch } from "react-redux";
import { handleReloadtable } from "@store/reloadTable";
import { useLazyGetTasksQuery } from "@api/tasks";
import Select from 'react-select'
import { IProjects, ITask } from "@domain/task";
import { useGetUserQuery } from "@api/user";
import ModalDeleteAppointment from "@components/myappointments/ModalDeleteAppointment";
import ModalEditAppointment from "@components/myappointments/ModalEditAppointment";

export interface IRangeDates {
  startDate: string | Date,
  endDate: string | Date
}

interface IMyAppointmentsProps {
  projectListRaw: IProjects[]
}

export default function MyAppointments({ projectListRaw }: IMyAppointmentsProps) {

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
    const toast = useToast()
    const isTableLoading = useSelector((state: RootState) => state.reloadTable)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [getMyAppointments, myAppointmentsResult] = useGetMyAppointmentsMutation()
    const { data: userData } = useGetUserQuery(token)
    const [setManualAppointment, { isError, isLoading: loading, isSuccess }] = useSetManualAppointmentMutation()
    const [getTasks] = useLazyGetTasksQuery()

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [myAppointmentsList, setMyAppointmentsList] = useState<IMyAppointments>()
    const [selectedProject, setSelectedProject] = useState<{label: string, value: number}>()
    const [selectedTask, setSelectedTask] = useState<{label: string, value: number}>()

    const [optionsProject, setOptionsProject] = useState([])
    const [optionsTasks, setOptionsTasks] = useState([])

    const [rangeDates, setRangeDates] = useState<IRangeDates>({
      startDate: '',
      endDate: ''
    })

    const [rangeDateTime, setRangeDateTime] = useState<IRangeDates>({
      startDate: '',
      endDate: ''
    })

    const handleGetMyAppointments = async (rangeDates?: IRangeDates) => {
      setIsLoading(true)
      setMyAppointmentsList(null)

      // return modal old state
      setOptionsTasks([])
      setSelectedTask(null)
      setSelectedProject(null)

      const startOfMonth = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      const endOfMonth   = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');

      if(!rangeDates?.endDate){
        const payload = {
          token,
          appointments: {
            limit: 999,
            page: 1,
            date_range: {
              date_from: startOfMonth,
              date_to: endOfMonth
            }
          }
        }

        await getMyAppointments(payload)
      } else {
        let newEndDate = moment(rangeDates.endDate)
        const payload = {
          token,
          appointments: {
            limit: 999,
            page: 1,
            date_range: {
              date_from: moment(rangeDates.startDate).format('YYYY-MM-DD HH:mm:ss'),
              date_to: newEndDate.endOf('day').format('YYYY-MM-DD HH:mm:ss')
            }
          }
        }
        
        await getMyAppointments(payload)
      }
      setIsLoading(false)
    }

    const handleGetTasks = async () => {
      const payload = {
        token,
        projectId: selectedProject.value
      }

      const response = await getTasks(payload)

      response.data.data.map((task: ITask) => {
        setOptionsTasks(optionsTasks => [...optionsTasks, {label: task.name, value: task.id}])
      })
    }

    const handleCreateAppointment = async () => {
      let formattedStartDate = moment(rangeDateTime.startDate)
      let formattedEndDate = moment(rangeDateTime.endDate)

      const payload = {
        token,
        appointments: {
            start_time: formattedStartDate.format('YYYY-MM-DD HH:mm:ss'),
            final_time: formattedEndDate.format('YYYY-MM-DD HH:mm:ss'),
            user_id: userData?.id,
            task_id: selectedTask.value
        }
      }

      await setManualAppointment(payload)
      handleGetMyAppointments()
      onClose()
    }

    useEffect(() => {
      if(isSuccess){
        toast({
          title: 'Apontamento criado com sucesso!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        })
      }

      if(isError){
        toast({
          title: 'Erro ao criar apontamento!',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        })
      }

      if(projectListRaw && !optionsProject.length){
        projectListRaw.map((project) => {
          setOptionsProject(optionsProject => [...optionsProject, {label: project.name, value: project.id}])
        })
      }
    }, [isSuccess, isError, projectListRaw])

    useEffect(() => {
        handleGetMyAppointments(rangeDates)
    }, [rangeDates.endDate])

    useEffect(() => {
      if(isTableLoading[1]){
        handleGetMyAppointments()
      }
    }, [isTableLoading[1]])
    
    useEffect(() => {
      if(selectedProject?.label){
        handleGetTasks()
      }

      if(myAppointmentsResult?.data?.appointments && !myAppointmentsList?.data.length){
        setMyAppointmentsList(myAppointmentsResult?.data?.appointments)
      }
    }, [selectedProject?.label, myAppointmentsResult])

    return (
      <>
        <Box as="header" pt='45px' pb='29px'>
            <Container
              w="100%"
              maxW={"100%"}
              gap="10px"
              p="0 30px"
              position={"relative"}
            >
              <Box>
                  <Heading as="h2">Meus Apontamentos</Heading>
              </Box>
            </Container>
        </Box>

        <Divider my="10px" borderBottom="2px" borderColor={useColorModeValue('#cdcdcd', '#303030')} />

        <Container 
          mt="24px"
          maxW={"100%"}
          p="20px 30px"
        >
          <Heading as='h3' fontSize={'22px'}>Escolha uma data para filtrar os seus apontamentos:</Heading>

          <FormControl mt='20px'>
            <Flex direction='column' gap='10px'>
              <Flex align='center'>
                <FormLabel htmlFor='range-start' w='100%' maxW='100px' m='0'>Data início:</FormLabel>
                <Input onChange={(event) => setRangeDates({...rangeDates, startDate: event.target.value})} id='range-start' type='date' maxW='200px' />
              </Flex>

              <Flex align='center'>
                <FormLabel htmlFor='range-end' w='100%' maxW='100px' m='0'>Data fim:</FormLabel>
                <Input onChange={(event) => setRangeDates({...rangeDates, endDate: event.target.value})} id='range-end' type='date' maxW='200px' />
              </Flex>
            </Flex>
          </FormControl>

          <Box mt='30px'>
            <Button onClick={onOpen}>+ Criar Apontamento</Button>
          </Box>

          <Modal isOpen={isOpen} onClose={() => {
            setOptionsTasks([])
            setSelectedTask(null)
            setSelectedProject(null)
            onClose()
          }} isCentered>
            <ModalOverlay />
            <ModalContent bgColor={'#1E1E1E'}>
              <ModalHeader>
                <Heading as='h4' fontSize={'1.375rem'} color={'#CC943C'}>Criar Apontamento</Heading>
              </ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                <Box>
                  <Text as='span'>Selecione um projeto:</Text>
                  <Select onChange={(event) => {
                    setOptionsTasks([])
                    setSelectedProject({label: event.label, value: event.value})}
                  }
                   options={optionsProject} className='project-select' theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: 'black',
                      primary: 'black'
                    }
                  })} />
                </Box>

                {
                  selectedProject && (
                    <Box my='15px'>
                      <Text as='span'>Selecione uma task:</Text>
                      <Select onChange={(value) => setSelectedTask(value)} options={optionsTasks} className='project-select' theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary25: 'black',
                          primary: 'black'
                        }
                      })} />
                    </Box>
                  )
                }

                {
                  selectedTask && (
                    <>
                      <Box my='15px'>
                        <Text as='span'>Selecione a data inicial:</Text>
                        <Input mt='10px' type={'datetime-local'} onChange={(event) => setRangeDateTime({...rangeDateTime, startDate: event.target.value})} />
                      </Box>

                      <Box mt='15px'>
                        <Text as='span'>Selecione a data final:</Text>
                        <Input mt='10px' type={'datetime-local'} onChange={(event) => setRangeDateTime({...rangeDateTime, endDate: event.target.value})} />
                      </Box>
                    </>
                  )
                }

              </ModalBody>

              <ModalFooter>
                <Button bgColor={'#CC943C'} mr={3} onClick={handleCreateAppointment} isDisabled={!rangeDateTime.endDate || loading}>
                  Salvar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Container>

        {
          isLoading ? (
            <Container
              maxW={"100%"}
              p="20px 30px"
            >
              <TableReloadingEffect />
            </Container>
          ) : (
            <Container
              maxW={"100%"}
              p="20px 30px"
              position='relative' 
              zIndex={'20'}
            >
              {
                <TableContainer boxShadow={colorMode == "light" ? "0 0 7px 0px #161616" : "0 0 15px 0px #161616"} borderRadius="6px" maxH="700px" minH='280px' overflowY={'scroll'} position={"relative"} sx={scrollBarStyle}>
                    <Table variant="simple" overflow={"auto"}>
                      <Thead position={"sticky"} zIndex={'10'} top="0" height="50px">
                        <Tr bgColor={colorMode == "light" ? "#FFFFFF" : "#1E1E1E"}>
                          <Th borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"} fontWeight={"900"} color={colorMode == "light" ? "#CB943C" : "#CB943C"}>Nome da task</Th>
                          <Th borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"} fontWeight={"900"} color={colorMode == "light" ? "#CB943C" : "#CB943C"}>Tempo Trackeado</Th>
                          <Th borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"} fontWeight={"900"} color={colorMode == "light" ? "#CB943C" : "#CB943C"}>Data do apontamento</Th>
                          <Th borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"} fontWeight={"900"} color={colorMode == "light" ? "#CB943C" : "#CB943C"}>Ações</Th>
                        </Tr>
                      </Thead>

                      <Tbody overflow={"auto"} h="fit-content" maxH={"900px"}>
                        {
                          myAppointmentsList?.data.length > 0 ? (
                            myAppointmentsList.data.map(data => {
                              const { timer } = secondsToTime(data.time_amount)
                              const { formattedDeadline: formattedDate } = formatData(data.final_time)

                              return (
                                <Tr key={data.id} bgColor={`${colorMode == "light" ? "#FFFFFF" : "#1E1E1E"}`} border={colorMode == "light" ? "1px solid #D0D0D0" : "1px solid transparent"} boxSizing="border-box" _hover={{backgroundColor: colorMode == "light" ? "#efefef" : "#3b3b3b"}}>
                                    <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                                      <Link fontWeight={'600'} href={`/project/${data.task.project_id}/task/${data.task.id}`}>{data.task.name}</Link>
                                    </Td>

                                    <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                                      <Flex align='center' gap='10px'>
                                        <Text as='span'>
                                          {
                                          `${timer.hours > 9 ? timer.hours : `0${timer.hours}`}:${timer.minutes > 9 ? `${timer.minutes}:` : `0${timer.minutes}:`}${timer.seconds > 9 ? `${timer.seconds}` : `0${timer.seconds}`}`
                                          }
                                        </Text>

                                      </Flex>
                                    </Td>

                                    <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                                      { formattedDate }
                                    </Td>

                                    <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                                      <Flex align='center' gap='10px' ml="-12px">
                                        <ModalEditAppointment appointmentId={data.id} />
                                        <ModalDeleteAppointment appointmentId={data.id} />
                                      </Flex>
                                    </Td>
                                </Tr>
                              )
                            })
                          ) : (
                            <Tr bgColor={`${colorMode == "light" ? "#FFFFFF" : "#1E1E1E"}`} border={colorMode == "light" ? "1px solid #D0D0D0" : "1px solid transparent"} boxSizing="border-box" _hover={{backgroundColor: colorMode == "light" ? "#efefef" : "#3b3b3b"}}>
                              <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                                Sem apontamentos no momento
                              </Td>

                              <Td border={0} borderColor={colorMode == "light" ? "#d0d0d0" : "#3b3b3b"}>
                                <Flex align='center' gap='10px'>
                                  <Text as='span'>
                                    -
                                  </Text>
                                </Flex>
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
              }
            </Container>
          )
        }
      </>
    )
}

export async function getStaticProps(){
  const token = getCookie('auth_token')
  const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL_API+'/v1/project', {headers: {'authorization': `Bearer ${token}`}})
  const { data: projectListRaw } = await response.json()

  return {
    props: {
      projectListRaw,
    },
    revalidate: 10
  }
}