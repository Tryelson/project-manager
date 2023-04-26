import { EditIcon } from "@chakra-ui/icons";
import { Avatar, AvatarGroup, Badge, Box, Button, Divider, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Flex, FormControl, FormLabel, Heading, IconButton, Input, List, ListItem, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Textarea, useColorMode, useToast, Text } from "@chakra-ui/react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaHourglassHalf } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useGetAllProjectsQuery } from "../api/projects";
import { useLazyGetStatusesQuery } from "../api/statuses";
import { useCreateNewTaskMutation, useLazyGetTasksQuery, useLazyGetTaskTypeQuery } from "../api/tasks";
import { useLazyGetAllUsersQuery } from "../api/user";
import { DataObject, IProjectList } from "../domain/projectList";
import { IStatusType, ITaskType, IResponsible } from "../domain/task";
import CustomTooltip from "./CustomTooltip";

interface ICreateNewTaskProps {
    projectName?: string | string[],
    isOpen: boolean,
    onClose: () => void
}

export default function CreateNewTask({ isOpen, onClose, projectName }: ICreateNewTaskProps){
    const router = useRouter()
    const token = getCookie('auth_token')
    const { colorMode } = useColorMode();
    const toast = useToast()
    const [createNewTask] = useCreateNewTaskMutation()
    const [getTasks, tableListResults] = useLazyGetTasksQuery()
    const [newTaskPayload, setNewTaskPayload] = useState({
        name: '',
        description: '',
        deadline: '',
        estimated_hours: '',
        task_type_id: null,
        project_id: parseInt(router.query.projectId as string),
        user_id: null,
        task_statuses_id: null
    })
    const [currentStatus, setCurrentStatus] = useState<IStatusType>()
    const [currentType, setCurrentType] = useState<ITaskType>()
    const [selectedResponsible, setSelectedResponsible] = useState<IResponsible>()
    const [currentProject, setCurrentProject] = useState<string | string[]>(projectName)
    const projectList = useGetAllProjectsQuery(token)
    const [getAllUsers, results] = useLazyGetAllUsersQuery()
    const [getStatuses, statusesList] = useLazyGetStatusesQuery()
    const [getTaskType, typesList] = useLazyGetTaskTypeQuery()
    const [usersList, setUsersList] = useState<IResponsible[]>([])
    const [statusList, setStatusList] = useState<IStatusType[]>([])
    const [taskTypeList, setTaskTypeList] = useState<ITaskType[]>([])
    const [projects, setProjects] = useState<IProjectList>()
    const [estimated, setEstimated] = useState<string>('')
    const [estimatedHours, setEstimatedHours] = useState<string>('')

    // change current status and set in store
    const getSelectedStatus = (item: IStatusType) => {
            setCurrentStatus(item)
        setNewTaskPayload({...newTaskPayload, task_statuses_id: item.id})
    }
    
    const getSelectedTaskType = (item : ITaskType) => {
        setCurrentType(item)
        setNewTaskPayload({...newTaskPayload, task_type_id: item.id})
    }

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

    // change current responsible task user
    const handleSelectedResponsible = (user: IResponsible) => {
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

        setNewTaskPayload({...newTaskPayload, user_id: user.id})
    }

    // change current project
    const handleSelectedProject = (project: DataObject) => {
        setCurrentProject(project.name)
        setNewTaskPayload({...newTaskPayload, project_id: project.id})
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

    const handleSetEstimatedHours = () => {
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
        setNewTaskPayload({...newTaskPayload, estimated_hours: formattedTime})
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

    const handleCreateNewTask = async () => {
      if(newTaskPayload.name.length > 4 && newTaskPayload.project_id !== null){
        const payload = {
            token,
            newTaskPayload
        }

        await createNewTask(payload)

        if(router?.query?.projectId){
          const refreshTable = {
              token,
              projectId: router?.query?.projectId
          }

          toast({
              title: 'Task criada com sucesso!',
              status: 'success',
              duration: 3000,
              isClosable: true,
              position: 'top'
          })

          await getTasks(refreshTable)

        } else {
          const refreshTable = {
            token,
            projectId: router.query.projectId
          }

          toast({
            title: 'Task criada com sucesso!',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top'
          })

          await getTasks(refreshTable)
        }
      } else {
        toast({
            title: 'Preencha alguns campos obrigatórios',
            description: 'Nome da task e Projeto são obrigatórios',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top'
        })
      }
    }

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

    useEffect(() => {
        if(projectList){
          setProjects(projectList.data)
        }
    }, [projectList])

    return (
        <Drawer
          size={"xl"}
          placement={"right"}
          onClose={onClose}
          isOpen={isOpen}
        >
          <DrawerOverlay />
          <DrawerContent bgColor="#1E1E1E">
            <DrawerHeader borderBottomWidth="1px">
              <Box display="flex" justifyContent={"space-between"} alignItems="center">
                <Heading as='h2' color={'#CC953D'}>Criar nova task</Heading>
    
                <Popover placement="right" closeOnBlur={true}>
                  <Flex align={"center"} w='100%' maxW='220px' gap="20px" borderRadius={"8px"}>
                    {/* trigger status modal */}
                    <Text>Status:</Text>
                    <PopoverTrigger>
                      <Button overflow={'hidden'} w='100%' onClick={() => handleGetAllStatuses()} bgColor='unset' _hover={{backgroundColor: 'unset'}} p='0'>
                        {
                          currentStatus ? (
                            <Flex h='100%' align='center' justify={'center'} w='100%' bgColor={currentStatus.background} _hover={{opacity: '0.8'}}>
                              <Badge color={currentStatus.color} fontWeight='bold' backgroundColor='unset' p="3px 20px" borderRadius={"5px"} cursor='pointer'>{currentStatus.name}</Badge>
                            </Flex>
                          ) : (
                            <Flex h='100%' align='center' justify={'center'} w='100%' bgColor={'transparent'} _hover={{opacity: '0.8'}} border='1px solid gray' borderRadius={'8px'}>
                              <Badge color={'white'} fontWeight='bold' backgroundColor='unset' p="3px 20px" borderRadius={"5px"} cursor='pointer'>-</Badge>
                            </Flex>
                          )
                        }
                      </Button>
                    </PopoverTrigger>
    
                    <PopoverContent cursor='default' mt='15px' ml='10px' w='200px' boxShadow={'0px 0px 10px black'} bgColor='#2e2b2b' color="white" border='0'>
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
                                    <Button bgColor={item.background} _hover={{opacity: '0.8'}} w='100%' onClick={() => getSelectedStatus(item)}>
                                      <Badge color={item.color} fontWeight={'bold'} backgroundColor='unset' p="3px 20px" borderRadius={"5px"} cursor='pointer'>{item.name}</Badge>
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
              </Box>
            </DrawerHeader>
    
            <DrawerBody pt="30px" flex='unset'>
              <Box>
                <FormControl as="form">
                  <Flex gap="20px" align={"center"}>
                    <FormLabel fontSize={"18px"} fontWeight='bold' m='0'>Nome da task: <Text as='span' fontWeight={'bolder'} color={'#CC943C'}>*</Text></FormLabel>
                    <Input fontSize={"18px"} onChange={(event) => setNewTaskPayload({...newTaskPayload, name: event.target.value})} maxW={"500px"} pl="10px" ml="-10px" />
                  </Flex>
    
                  <Flex mt="40px" direction={'column'} gap='15px'>
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
                      <Input type='date' maxW={'200px'} h='34px' pl='5px' boxShadow='0' onChange={(event) => setNewTaskPayload({...newTaskPayload, deadline: event.target.value})} />
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
                                  <Text as='span'>{ currentProject }</Text>
                                </>
                              ) : (
                                <Text as='span'>-</Text>
                              )
                            }
                          </Flex>
    
                          <PopoverTrigger>
                            <Flex align={'center'} gap='12px'>
                              <IconButton
                                aria-label="Selecionar projeto"
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
                                    projects.data?.map((project) => {
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
                        <Flex align={"center"} w='100%' maxW='130px' gap="5px" borderRadius={"8px"}>
                          {/* trigger status modal */}
                          <PopoverTrigger>
                            <Button overflow={'hidden'} w='100%' onClick={() => handleGetAllTaskTypes()} bgColor='unset' _hover={{backgroundColor: 'unset'}} p='0'>
                              {
                                currentType ? (
                                  <Flex h='100%' align='center' justify={'center'} w='100%' bgColor={currentType.background} _hover={{opacity: '0.8'}}>
                                    <Badge color={currentType.color} fontWeight='bold' backgroundColor='unset' p="3px 20px" borderRadius={"5px"} cursor='pointer'>{currentType.name}</Badge>
                                  </Flex>
                                ) : (
                                  <Flex h='100%' align='center' justify={'center'} w='100%' bgColor={'transparent'} _hover={{opacity: '0.8'}} border='1px solid gray' borderRadius={'8px'}>
                                    <Badge color={'white'} fontWeight='bold' backgroundColor='unset' p="3px 20px" borderRadius={"5px"} cursor='pointer'>-</Badge>
                                  </Flex>
                                )
                              }
                            </Button>
                          </PopoverTrigger>
    
                          <PopoverContent cursor='default' mt='15px' ml='10px' w='200px' boxShadow={'0px 0px 10px black'} bgColor='#2e2b2b' color="white" border='0'>
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
                                          <Button bgColor={item.background} _hover={{opacity: '0.8'}} w='100%' onClick={() => getSelectedTaskType(item)}>
                                            <Badge color={item.color} fontWeight={'bold'} backgroundColor='unset' p="3px 20px" borderRadius={"5px"} cursor='pointer'>{item.name}</Badge>
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
                      <Textarea mt='10px' h='300px' resize={'none'} pl='5px' boxShadow='0' onChange={(event) => setNewTaskPayload({...newTaskPayload, description: event.target.value})} />
                    </Box>
    
                    <Button mt='20px' bgColor={'#CC943C'} isLoading={tableListResults.isLoading} loadingText={'Enviando...'} spinnerPlacement='end' onClick={() => handleCreateNewTask()}>
                      Criar nova Task
                    </Button>
                  </Flex>
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