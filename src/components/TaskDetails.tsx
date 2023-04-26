import { EditIcon } from "@chakra-ui/icons";
import { Avatar, AvatarGroup, Badge, Box, Button, Divider, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Editable, EditableInput, EditablePreview, Flex, FormControl, FormLabel, Heading, IconButton, Input, List, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Textarea, useColorMode, useDisclosure, useEditableControls, useToast, Text } from "@chakra-ui/react";
import { getCookie } from "cookies-next";
import { useEffect, useRef, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BsCalendar2Date } from "react-icons/bs";
import { FaHourglassHalf, FaRegTrashAlt } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useGetAllProjectsQuery } from "../api/projects";
import { useLazyGetStatusesQuery } from "../api/statuses";
import { useDeleteTaskMutation, useLazyGetTasksQuery, useLazyGetTaskTypeQuery, useLazyVerifyActiveAppointmentQuery, useUpdateTaskMutation } from "../api/tasks";
import { useGetUserQuery, useLazyGetAllUsersQuery } from "../api/user";
import { DataObject, IProjectList } from "../domain/projectList";
import { IProjectTask, IResponsible, IStatusType, ITask, ITaskType, IUpdateTask } from "../domain/task";
import { TotalTaskAppointments } from "./TableList";
import AppointmentsBtn from "./AppointmentsBtn";
import { useDispatch } from "react-redux";
import { handleReloadtable } from "../store/reloadTable";
import { formatData } from "../utils/formatData";
import CustomTooltip from "./CustomTooltip";

interface ITaskDetailsProps {
    task: ITask,
    isOpen: boolean,
    onClose: () => void,
}

export default function TaskDetails({task, isOpen, onClose}: ITaskDetailsProps){
    const token = getCookie('auth_token')
    const { colorMode } = useColorMode();
    const dispatch = useDispatch()
    const toast = useToast()
  
    const dateRef = useRef<HTMLInputElement>()
  
    const [updateTask] = useUpdateTaskMutation()
    const [deleteTask] = useDeleteTaskMutation()
  
    const { data: userData } = useGetUserQuery(token)
  
    const { isOpen: modalIsOpen, onOpen, onClose: onModalClose} = useDisclosure()
    // change scroll bar style
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
  
    const [updateTaskPayload, setUpdateTaskPayload] = useState<IUpdateTask | undefined>()
  
    // set and change current task status
    const [currentStatus, setCurrentStatus] = useState<IStatusType>()
    // set and change current task type
    const [currentType, setCurrentType] = useState<ITaskType>()
    // changing task responsible
    const [selectedResponsible, setSelectedResponsible] = useState<IResponsible>()
    // changing task project
    const [currentProject, setCurrentProject] = useState<IProjectTask>()
    
    // get all projects
    const projectList = useGetAllProjectsQuery(token)
    // return all users in a list
    const [getAllUsers, results] = useLazyGetAllUsersQuery()
    // return all statuses types in a list
    const [getStatuses, statusesList] = useLazyGetStatusesQuery()
    // return all tasks types in a list
    const [getTaskType, typesList] = useLazyGetTaskTypeQuery()
  
    // get all users and set in this variable to map
    const [usersList, setUsersList] = useState<IResponsible[]>([])
    // get all statuses and set in this variable to map
    const [statusList, setStatusList] = useState<IStatusType[]>([])
    // get all tasks types and set in this variable to map
    const [taskTypeList, setTaskTypeList] = useState<ITaskType[]>([])
    // get all projects and set in this variable to map
    const [projects, setProjects] = useState<IProjectList>()
  
    const [estimated, setEstimated] = useState<string>('')
  
    const [estimatedHours, setEstimatedHours] = useState<string>('')
  
    const [deadline, setDeadline] = useState<string>("")
  
    const [timer, setTimer] = useState(null)
  
    // change current status
    const getSelectedStatus = async (item: IStatusType) => {
      setCurrentStatus(item)
      setUpdateTaskPayload({...updateTaskPayload, task_statuses_id: item.id})
      
      const payload = {
        token,
        updateTask: {
          ...updateTaskPayload,
          task_statuses_id: item.id
        }
      }

      await updateTask(payload)
    }
  
    // chage current task type
    const getSelectedTaskType = async (item : ITaskType) => {
      setCurrentType(item)
      setUpdateTaskPayload({...updateTaskPayload, task_type_id: item.id})
      
      const payload = {
        token,
        updateTask: {
          ...updateTaskPayload,
          task_type_id: item.id
        }
      }
      await updateTask(payload)
    }
  
    // change current responsible task user
    const handleSelectedResponsible = async (user: IResponsible) => {
      let userNameLetters = user.name.split(" ")
      
      if(userNameLetters[1]){
        let initialLetters = userNameLetters[0][0] + userNameLetters[1][0]
        let userObj = {
          ...user,
          initials: initialLetters
        }
        setSelectedResponsible(userObj)
  
      }else{
        let initialLetters = userNameLetters[0][0]
        let userObj = {
          ...user,
          initials: initialLetters
        }
        setSelectedResponsible(userObj)
      }
      
      const payload = {
        token,
        updateTask: {
          ...updateTaskPayload,
          user_id: user.id
        }
      }
      await updateTask(payload)
      setUpdateTaskPayload({...updateTaskPayload, user_id: user.id})
    }
    
    // change current project
    const handleSelectedProject = async (project: DataObject) => {
      setCurrentProject(project)
      setUpdateTaskPayload({...updateTaskPayload, project_id: project.id})
  
      const payload = {
        token,
        updateTask: {
          ...updateTaskPayload,
          project_id: project.id
        }
      }
      await updateTask(payload)
    }
    
    // get all users
    const handleGetAllUsers = async () => {
      await getAllUsers(token)
    }
  
    // get all statuses
    const handleGetAllStatuses = async () => {
      await getStatuses(token)
    }
  
    // get all tasks types
    const handleGetAllTaskTypes = async () => {
      await getTaskType(token)
    }
  
    const handleSetEstimatedHours = async () => {
      let inputedHours = ''
  
      if(!inputedHours.match(/[h]?[m]/)){
        inputedHours = estimatedHours + 'm'
      }    
  
      if(inputedHours.match(/\s/)){
        inputedHours = inputedHours.replace(/\s{1,8}/, '')
      }    
  
      let fullHours: string[] = []
      let hours = ''
      let fullMinutes: string[] = []
      let minutes = ''
      let formattedTime = ''
      let finalTime = ''
  
      // get only hours
      if(inputedHours.match(/[0-9]{1,3}[h]/g)){
        fullHours = inputedHours.split("h")
        hours = fullHours[0]
      }
  
      // get only minutes
      if(inputedHours.match(/[0-9]{1,3}[m]/g)){
        fullMinutes = inputedHours.match(/[0-9]{1,3}[m]/g)[0].split("m")
        minutes = fullMinutes[0]
      }
  
      if(hours){
        if(parseInt(minutes) > 59){
          let hour = Math.floor(parseInt(minutes) / 60) + parseInt(hours)
          let minute = parseInt(minutes) % 60
          hours = hour.toString()
          minutes = minute.toString()
        }
      } else {
        let hour = Math.floor(parseInt(minutes) / 60)
        let minute = parseInt(minutes) % 60
        hours = hour.toString()
        minutes = minute.toString()
      }
  
      // formatting time to send to backend
      if(hours && minutes){
        formattedTime = `${hours}:${minutes}:00`
        finalTime = `${hours}h ${minutes}m`
      } else if(hours && !minutes){
        formattedTime = `${hours}:00:00`
        finalTime = `${hours}h`
      } else if(!hours && minutes){
        formattedTime = `00:${minutes}:00`
        finalTime = `${minutes}m`
      }
  
      setEstimated(finalTime)
      setEstimatedHours(finalTime)
      setUpdateTaskPayload({...updateTaskPayload, estimated_hours: formattedTime})
  
      const payload = {
        token,
        updateTask: {
          ...updateTaskPayload,
          estimated_hours: formattedTime
        }
      }
      await updateTask(payload)
    }
  
    const handleSetEstimatedHoursRegex = (value: string) => {
      if(value.match(/^([0-9]{1,3}[m])/)){
        setEstimatedHours(value.replace(/(\d{2})(\d{2})/g, "$1h $2m").replace(/[^0-9 ^hm]/, "").replace(/[hm]{2}/, "").substring(0, 4))
      } else if(value.match(/([0-9]{1,3}[h])\s([0-9]{1,3}[h])/) || value.match(/([0-9]{1,3}[h]){2}/)){
        setEstimatedHours(value.replace(/(\d{2})(\d{2})/g, "$1h $2m").replace(/[^0-9 ^hm]/, "").replace(/.$/, "m"))
      } else if(value.match(/[0-9]{1,3}[h]/)){
        setEstimatedHours(value.replace(/(\d{2})(\d{2})/g, "$1h $2m").replace(/[^0-9 ^hm]/, "").replace(/[hm]{2}/, "").substring(0, 8))
      } else if(value.match(/[0-9]{1,3}\s/)){
        setEstimatedHours(value.replace(/(\d{2})(\d{2})/g, "$1h $2m").replace(/[^0-9 ^hm]/, "").replace(/[hm]{2}/, "").replace(/.$/, "h ").substring(0, 8))
      } else {
        setEstimatedHours(value.replace(/(\d{2})(\d{2})/g, "$1h $2m").replace(/[^0-9 ^hm]/, "").replace(/[hm]{2}/, "").substring(0, 7))
      }
    }
  
    const handleUpdateDescription = async (value: string) => {
      setUpdateTaskPayload({...updateTaskPayload, description: value})
      clearTimeout(timer)
  
      const payload = {
        token,
        updateTask: {
          ...updateTaskPayload,
          description: value
        }
      }
      
      const newTime = setTimeout(async () => {
        await updateTask(payload)
      }, 800);
  
      setTimer(newTime)
    }
  
    const handleUpdateTaskName = async (value: string) => {
      setUpdateTaskPayload({...updateTaskPayload, name: value})
  
      clearTimeout(timer)
  
      const payload = {
        token,
        updateTask: {
          ...updateTaskPayload,
          name: value
        }
      }
  
      const newTimer = setTimeout(async () => {
        await updateTask(payload)
      }, 800);
  
      setTimer(newTimer)
    }
  
    const handleUpdateDeadline = async (value: string) => {
      setUpdateTaskPayload({...updateTaskPayload, deadline: value})

      let deadlineObject = new Date(value)
      let day = deadlineObject.getDate() + 1
      let month = deadlineObject.getMonth() + 1
      let fullYear = deadlineObject.getFullYear()
      let formattedDeadline = `${day}/${month < 10 ? `0${month}` : month}/${fullYear}`
  
      setDeadline(formattedDeadline)
  
      const payload = {
        token,
        updateTask: {
          ...updateTaskPayload,
          deadline: value
        }
      }
  
      await updateTask(payload)
    }
  
    const handleDeletetask = async () => {
      const payload = {
       token,
       taskId: task?.id
      }
      
      onModalClose()
      onClose()
      await deleteTask(payload)
      toast({
        title: 'Task deletada com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
    }

    const [verifyActiveAppointment] = useLazyVerifyActiveAppointmentQuery()
    const [startCounting, setStartCounting] = useState<boolean>(false)

    const handleVerifyActiveAppointment = async () => {
        const response = await verifyActiveAppointment(token)

        if(task?.id === response?.data?.active_task?.appointment?.task_id){
            setStartCounting(true)
        }
    }

    const handleRefetchTableData = () => {
      dispatch(handleReloadtable([false, true]))
      onClose()
    }

    useEffect(() => {
        handleVerifyActiveAppointment()
    }, [])
  
    useEffect(() => {
      if(projectList){
        setProjects(projectList.data)
      }
    }, [projectList])
  
    useEffect(() => {
      if(task?.taskstatus){
        setCurrentStatus(task?.taskstatus)
      } else{
        setCurrentStatus(null)
      }
      
      if(task?.tasktype){
        setCurrentType(task?.tasktype)
      } else{
        setCurrentType(null)
      }
  
      if(task?.user){
        setSelectedResponsible(task?.user)
        let userNameLetters = task?.user?.name.split(" ")
      
        if(userNameLetters[1]){
          let initialLetters = userNameLetters[0][0] + userNameLetters[1][0]
          let userObj = {
            ...task?.user,
            initials: initialLetters
          }
          setSelectedResponsible(userObj)
    
        }else{
          let initialLetters = userNameLetters[0][0]
          let userObj = {
            ...task?.user,
            initials: initialLetters
          }
          setSelectedResponsible(userObj)
        }
      } else{
        setSelectedResponsible(null)
      }
  
      if(task?.estimated_hours){
        let newEstimateHours = task?.estimated_hours.toString().split(":")
        let formattedEstimate = `${newEstimateHours[0]}h ${newEstimateHours[1]}m`
        setEstimated(formattedEstimate)
      } else {
        setEstimated(null)
      }
  
      if(task?.deadline){
        let { formattedDeadline } = formatData(task?.deadline)
  
        setDeadline(formattedDeadline)
      } else {
        setDeadline(null)
      }
  
      if(task?.project){
        setCurrentProject(task?.project)
      } else{
        setCurrentProject(null)
      }
  
      setUpdateTaskPayload({
        ...updateTaskPayload,
        id: task?.id,
        name: task?.name,
        description: task?.description,
        deadline: task?.deadline,
        estimated_hours: task?.estimated_hours,
        task_type_id: task?.task_type_id,
        project_id: task?.project_id,
        user_id: task?.user_id,
        task_statuses_id: task?.task_statuses_id
      })

    }, [task])
  
    // get all users
    useEffect(() => {
      if(results){
        setUsersList(results.data?.data)
      }
    }, [results])
  
    // get all statuses
    useEffect(() => {
      if(statusesList){
        setStatusList(statusesList.data?.data)
      }
    }, [statusesList])
  
    // get all types
    useEffect(() => {
      if(typesList){
        setTaskTypeList(typesList.data?.data)
      }
    }, [typesList])
  
    const EditableControls = () => {
        const { getEditButtonProps } = useEditableControls();
  
        return (
            <Flex>
                <IconButton
                aria-label="Editar nome"
                bgColor={"transparent"}
                icon={<EditIcon w="15px" />}
                {...getEditButtonProps()}
                />
            </Flex>
        )
    };

    return(
        <Drawer
        size={"xl"}
        placement={"right"}
        onClose={handleRefetchTableData}
        isOpen={isOpen}
        >
        <DrawerOverlay />
        <DrawerContent bgColor="#1E1E1E">
            <DrawerHeader borderBottomWidth="1px">
                <Flex justify={"space-between"} align="center">
                    <Heading as='h2' color={'#CC953D'}>Detalhes da task</Heading>
        
                    <AppointmentsBtn taskId={task?.id} userId={userData?.id} startCounting={startCounting} />
                </Flex>
            </DrawerHeader>
    
            <DrawerBody pt="30px" flex='unset'>
                <Box>
                    <FormControl as="form">
                        <Editable defaultValue={task?.name}>
                            <Flex gap="20px" align={"center"}>
                            <EditablePreview
                                as="h2"
                                fontSize={"24px"}
                                pl="10px"
                                py="0"
                                ml="-10px"
                            />
                            <Input fontSize={"24px"} maxW={"500px"} onChange={(event) => handleUpdateTaskName(event.target.value)} as={EditableInput} pl="10px" ml="-10px" />
                            <EditableControls />
                            </Flex>
                        </Editable>
            
                        <Flex mt="40px" direction={'column'} gap='15px'>
                            <Popover placement="right" closeOnBlur={true}>
                              <Flex align={"center"} gap="20px" borderRadius={"8px"}>
                                  {/* trigger status modal */}
                                  <FormLabel fontSize={"18px"} fontWeight='bold' m="0">Status:</FormLabel>
                                  <PopoverTrigger>
                                    <Button overflow={'hidden'} minW='130px' onClick={() => handleGetAllStatuses()} bgColor='unset' _hover={{backgroundColor: 'unset'}} p='0'>
                                        {
                                        currentStatus ? (
                                            <Flex h='100%' align='center' justify={'center'} w='fit-content' minW='130px' p='0 10px' bgColor={currentStatus.background} _hover={{opacity: '0.8'}}>
                                              <Badge color={currentStatus.color} fontWeight='bold' backgroundColor='unset' p='0' borderRadius={"5px"} cursor='pointer'>{currentStatus.name}</Badge>
                                            </Flex>
                                        ) : (
                                            <Flex h='100%' align='center' justify={'center'} w='100%' bgColor={'transparent'} _hover={{opacity: '0.8'}} border='1px solid gray' borderRadius={'8px'}>
                                              <Badge color={'white'} fontWeight='bold' backgroundColor='unset' p="3px 20px" borderRadius={"5px"} cursor='pointer'>-</Badge>
                                            </Flex>
                                        )
                                        }
                                    </Button>
                                  </PopoverTrigger>
              
                                  <PopoverContent cursor='default' mt='15px' ml='10px' w='100%' maxW={'300px'} boxShadow={'0px 0px 10px black'} bgColor='#2e2b2b' color="white" border='0'>
                                    <PopoverCloseButton />
                
                                    <PopoverHeader pt={4} fontWeight="bold" border="0">
                                        Status
                                    </PopoverHeader>
                
                                    <PopoverBody>
                                        <List borderRadius={'5px'} bgColor='#1E1E1E' maxH='200px' overflowY={'auto'} sx={scrollBarStyle}>
                                        {
                                            statusList ? (
                                            statusList.map((item) => {
                                                return (
                                                <ListItem key={item.id} display={'flex'} alignItems='center' gap='10px' cursor='pointer' p='8px' mx='auto'>
                                                    <Button bgColor={item.background} _hover={{opacity: '0.8'}} p='0 10px' w='100%' minW='130px' onClick={() => getSelectedStatus(item)}>
                                                      <Badge color={item.color} fontWeight={'bold'} backgroundColor='unset' p="0" borderRadius={"5px"} cursor='pointer'>{item.name}</Badge>
                                                    </Button>
                                                </ListItem>
                                                )
                                            })
                                            ) : (
                                            <Flex align={'center'} justify={'center'} p='12px'>
                                                <ThreeDots 
                                                height="20" 
                                                width="40" 
                                                radius="9"
                                                color="#CC943C" 
                                                ariaLabel="three-dots-loading"
                                                visible={true}
                                                />
                                            </Flex>
                                            )
                                        }
                                        </List>
                                    </PopoverBody>
                                  </PopoverContent>
                              </Flex>
                            </Popover>
            
                            <Flex gap="20px" align={"center"}>
                              <FormLabel fontSize={"18px"} fontWeight='bold' m="0">
                                  Responsável:{" "}
                              </FormLabel>
              
                              {
                                  selectedResponsible && (
                                  <AvatarGroup size='md' max={2}>
                                      <CustomTooltip name={selectedResponsible.name}>
                                      {
                                          <Flex w='45px' h='45px' boxSizing="border-box" borderRadius={'100%'} bg='#CC943C' align='center' justify='center' cursor={'default'}>
                                          { selectedResponsible.initials }
                                          </Flex>
                                      }
                                      </CustomTooltip>
                                  </AvatarGroup>
                                  )
                              }
            
                              <Popover placement="right" closeOnBlur={true}>
                                  <Flex align={"center"} gap="5px" borderRadius={"8px"}>
                                  {/* trigger responsible modal */}
                                  <PopoverTrigger>
                                      <Button onClick={handleGetAllUsers} bgColor="unset" p='0' _hover={{ backgroundColor: "unset" }} gap='15px'>
                                      <AvatarGroup>
                                          <CustomTooltip name='Atribuir responsável'>
                                            <Avatar w='45px' h='45px' _hover={{opacity: '0.9'}} icon={<AiOutlineUserAdd fontSize={'1.5rem'} />} />
                                          </CustomTooltip>
                                      </AvatarGroup>
                                      </Button>
                                  </PopoverTrigger>
              
                                  <PopoverContent w='fit-content' cursor='default' ml='10px' boxShadow={'0px 0px 10px black'} bgColor='#2e2b2b' color="white" border='0'>
                                      <PopoverCloseButton />
              
                                      <PopoverHeader pt={4} fontWeight="bold" border="0">
                                      Adicionar responsável
                                      </PopoverHeader>
              
                                      <PopoverBody>
                                      <List borderRadius={'5px'} bgColor='#1E1E1E' maxH='200px' overflowY={'auto'} sx={scrollBarStyle}>
                                          {
                                          usersList ? (
                                              usersList.map((user, index) => {
                                              let initialLetters = user.name.split(' ')
                                              return (
                                                  <ListItem key={user.id} display={'flex'} onClick={() => handleSelectedResponsible(user)} alignItems='center' gap='10px' _hover={{backgroundColor: '#2F2F2F'}} cursor='pointer' p='8px 20px'>
                                                  <Flex w='40px' h='40px' borderRadius={'100%'} bg='#CC943C' align='center' justify='center'>
                                                      {initialLetters[0][0]}
                                                      {initialLetters[1] ? initialLetters[1][0] : ''}
                                                  </Flex>
                                                  { user.name }
                                                  </ListItem>
                                              )
                                              })
                                          ) : (
                                              <Flex align={'center'} justify={'center'} p='12px'>
                                              <ThreeDots 
                                                  height="20" 
                                                  width="40" 
                                                  radius="9"
                                                  color="#CC943C" 
                                                  ariaLabel="three-dots-loading"
                                                  visible={true}
                                              />
                                              </Flex>
                                          )
                                          }
                                      </List>
                                      </PopoverBody>
                                      
                                  </PopoverContent>
                                  </Flex>
                              </Popover>
                            </Flex>
            
                            <Flex gap="10px" align={"center"}>
                              <FormLabel fontSize={"18px"} fontWeight='bold' m='0'>Deadline:</FormLabel>
                              <Text>{ deadline ? deadline : '' }</Text>
              
                              <IconButton
                                  aria-label="Editar Deadline"
                                  bgColor={"transparent"}
                                  icon={<BsCalendar2Date />}
                                  // _hover={{backgroundColor: 'unset'}}
                                  onClick={() => { dateRef?.current?.showPicker() }}
                              />
                              <Input ref={dateRef} _focusVisible={{border: 0}} ml='-35px' pointerEvents='none' fontSize={"16px"} type='date' w='0' border='0' onChange={(event) => handleUpdateDeadline(event.target.value)} pl="10px" />
                            </Flex>
            
                            <Flex gap="10px" align={"center"}>
                              <FormLabel fontSize={"18px"} fontWeight='bold' m='0'>Estimativa:</FormLabel>
            
                              <Flex align={'center'} justify='center' h='40px'>
                                  <Text>{estimated}</Text>
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
            
                                        <PopoverContent w='fit-content' cursor='default' ml='10px' boxShadow={'0px 0px 10px black'} bgColor='#2e2b2b' color="white" border='0'>
                                        <PopoverCloseButton />
            
                                        <PopoverHeader pt={4} fontWeight="bold" border="0">
                                            Adicionar estimativa
                                        </PopoverHeader>
            
                                        <PopoverBody>
                                            <Flex direction={'column'} gap='12px' justify={'start'}>
                                            <Input type='text' placeholder="Ex.: 8h 20m ou 5h" maxW={'200px'} h='34px' pl='5px' boxShadow='0' 
                                            onChange={(event) => handleSetEstimatedHoursRegex(event.target.value)}
                                            value={estimatedHours} />
            
                                            <Button isDisabled={!estimatedHours} bgColor={"#CC943C"} h='30px' fontSize='14px' onClick={() => handleSetEstimatedHours()}>
                                                Salvar
                                            </Button>
                                            </Flex>
                                        </PopoverBody>
                                        </PopoverContent>
                                    </Flex>
                                  </Popover>
                              </Box>
                            </Flex>
            
                            <TotalTaskAppointments appointments={task?.appointments} />
            
                            <Flex gap='10px' align={'center'}>
                              <Popover placement="right" closeOnBlur={true}>
                                  <Flex align={"center"} gap="5px" borderRadius={"8px"}>
                                  {/* trigger responsible modal */}
                                  <FormLabel fontSize={"18px"} fontWeight='bold' m='0'>Projeto: <Text as='span' fontWeight={'bolder'} color={'#CC943C'}>*</Text></FormLabel>
                                  <Flex align={'center'} gap='10px' ml='10px'>
                                      {
                                      currentProject ? (
                                          <>
                                          <Box bgColor={'#CC953D'} w='8px' h='8px' borderRadius={'100%'}></Box>
                                          <Text as='span'>{ currentProject.name }</Text>
                                          </>
                                      ) : (
                                          <Text as='span'>-</Text>
                                      )
                                      }
                                  </Flex>
              
                                  <PopoverTrigger>
                                      <Flex align={'center'} gap='12px'>
                                      <IconButton
                                          onClick={handleGetAllUsers}
                                          aria-label="Editar nome"
                                          bgColor={"transparent"}
                                          icon={<EditIcon w="15px" />}
                                      />
                                      </Flex>
                                  </PopoverTrigger>
              
                                  <PopoverContent w='fit-content' cursor='default' ml='10px' boxShadow={'0px 0px 10px black'} bgColor='#2e2b2b' color="white" border='0'>
                                      <PopoverCloseButton />
              
                                      <PopoverHeader pt={4} fontWeight="bold" border="0">
                                      Projetos
                                      </PopoverHeader>
              
                                      <PopoverBody>
                                      <List borderRadius={'5px'} bgColor='#1E1E1E' maxH='200px' overflowY={'auto'} sx={scrollBarStyle}>
                                          {
                                          projects ? (
                                              projects.data?.map((project, index) => {
                                              return (
                                                  <ListItem key={project.id} display={'flex'} onClick={() => handleSelectedProject(project)} alignItems='center' gap='10px' _hover={{backgroundColor: '#2F2F2F'}} cursor='pointer' p='8px 20px'>
                                                  { project.name }
                                                  </ListItem>
                                              )
                                              })
                                          ) : (
                                              <Flex align={'center'} justify={'center'} p='12px'>
                                              <ThreeDots 
                                                  height="20" 
                                                  width="40" 
                                                  radius="9"
                                                  color="#CC943C" 
                                                  ariaLabel="three-dots-loading"
                                                  visible={true}
                                              />
                                              </Flex>
                                          )
                                          }
                                      </List>
                                      </PopoverBody>
                                      
                                  </PopoverContent>
                                  </Flex>
                              </Popover>
                            </Flex>
            
                            <Flex gap='12px' align={'center'}>
                              <FormLabel fontSize={"18px"} fontWeight='bold' m='0'>Tipo:</FormLabel>

                              <Popover placement="right" closeOnBlur={true}>
                                  <Flex align={"center"} gap="5px" borderRadius={"8px"}>
                                    {/* trigger status modal */}
                                    <PopoverTrigger>
                                        <Button overflow={'hidden'} w='100%' onClick={() => handleGetAllTaskTypes()} bgColor='unset' _hover={{backgroundColor: 'unset'}} p='0'>
                                        {
                                            currentType ? (
                                              <Flex h='100%' align='center' justify={'center'} w='100%' minW='130px' bgColor={currentType.background} _hover={{opacity: '0.8'}}>
                                                  <Badge color={currentType.color} fontWeight='bold' backgroundColor='unset' p="3px 20px" borderRadius={"5px"} cursor='pointer'>{currentType.name}</Badge>
                                              </Flex>
                                            ) : (
                                              <Flex h='100%' align='center' justify={'center'} w='100%' minW='130px' bgColor={'transparent'} _hover={{opacity: '0.8'}} border='1px solid gray' borderRadius={'8px'}>
                                                  <Badge color={'white'} fontWeight='bold' backgroundColor='unset' p="3px 20px" borderRadius={"5px"} cursor='pointer'>-</Badge>
                                              </Flex>
                                            )
                                        }
                                        </Button>
                                    </PopoverTrigger>
              
                                    <PopoverContent cursor='default' mt='15px' ml='10px' w='100%' maxW='300px' boxShadow={'0px 0px 10px black'} bgColor='#2e2b2b' color="white" border='0'>
                                        <PopoverCloseButton />
                
                                        <PopoverHeader pt={4} fontWeight="bold" border="0">
                                          Tipo de task
                                        </PopoverHeader>
                
                                        <PopoverBody>
                                          <List borderRadius={'5px'} bgColor='#1E1E1E' maxH='200px' overflowY={'auto'} sx={scrollBarStyle}>
                                              {
                                              taskTypeList ? (
                                                  taskTypeList.map((item) => {
                                                  return (
                                                    <ListItem key={item.id} display={'flex'} alignItems='center' gap='10px' cursor='pointer' p='8px' mx='auto'>
                                                      <Button bgColor={item.background} _hover={{opacity: '0.8'}} p='0 10px' w='100%' minW='130px' onClick={() => getSelectedTaskType(item)}>
                                                        <Badge color={item.color} fontWeight={'bold'} backgroundColor='unset' p="0" borderRadius={"5px"} cursor='pointer'>{item.name}</Badge>
                                                      </Button>
                                                    </ListItem>
                                                  )
                                                  })
                                              ) : (
                                                  <Flex align={'center'} justify={'center'} p='12px'>
                                                  <ThreeDots 
                                                      height="20" 
                                                      width="40" 
                                                      radius="9"
                                                      color="#CC943C" 
                                                      ariaLabel="three-dots-loading"
                                                      visible={true}
                                                  />
                                                  </Flex>
                                              )
                                              }
                                          </List>
                                        </PopoverBody>
                                    </PopoverContent>
                                  </Flex>
                              </Popover>
                            </Flex>
            
                            <Box>
                              <FormLabel fontSize={"18px"} fontWeight='bold' m='0'>Descrição:</FormLabel>
                              <Textarea mt='10px' h='300px' resize={'none'} pl='5px' boxShadow='0' onChange={(event) => handleUpdateDescription(event.target.value)} value={updateTaskPayload?.description || ''} />
                            </Box>
                        </Flex>
            
                        <Flex justify={'flex-end'}>
                            <Button bgColor={'#ad0606'} mt='20px' onClick={onOpen}>
                            <Flex gap='10px' align='center'>
                                Deletar task
                                <FaRegTrashAlt />
                            </Flex>
                            </Button>
                        </Flex>
            
                        <Modal onClose={onModalClose} isOpen={modalIsOpen} isCentered>
                            <ModalOverlay />
                            <ModalContent bgColor='#1E1E1E'>
                            <ModalHeader fontWeight={'900'}>Deletar task</ModalHeader>
                            <ModalCloseButton />
            
                            <ModalBody>
                                <Text as='span'>Tem certeza que deseja excluir essa task?</Text>
                            </ModalBody>
                            
                            <ModalFooter>
                                <Flex gap='20px' align={'center'}>
                                <Button onClick={onModalClose}>Close</Button>
                                <Button onClick={handleDeletetask} bgColor={'#CC943C'}>Excluir</Button>
                                </Flex>
                            </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </FormControl>
                </Box>
            </DrawerBody>
    
            <Divider my='30px' />
    
            <Box px='25px' pb='25px'>
            <Text as='h3' fontSize='18px' fontWeight={'bold'}>
                Comentários
            </Text>
            </Box>
        </DrawerContent>
        </Drawer>
    )
}