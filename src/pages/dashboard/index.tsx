import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  Box,
  Container,
  Heading,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  keyframes,
  Divider,
  useColorModeValue,
  FormControl,
  FormLabel,
  Flex,
  Text
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import TableList from "../../components/TableList";
import { ProjectState } from "../../store/projectSlice";
import { useLazyVerifyActiveAppointmentQuery } from "../../api/tasks";
import { getCookie } from "cookies-next";

export default function Dashboard() {
    
    const token = getCookie('auth_token')
    const animationKeyframes = keyframes`
        0% { opacity: 0; transform: translateX(300px); position: absolute; }
        50% { opacity: 1; }
        100% { transform: translateX(0); position: relative; }
    `;

    const sliderAnimation = `${animationKeyframes} 0.2s ease-in-out`;

    const project = useSelector((state: RootState) => state.project);
    const initializeCounter = useSelector((state: RootState) => state.appointmentsState);

    const [projectObject, setProjectObject] = useState<ProjectState>()
    const [indexTabs, setIndexTabs] = useState<number>()
    const [verifyActiveAppointment, results] = useLazyVerifyActiveAppointmentQuery()
    const [startCounting, setStartCounting] = useState<boolean>(false)
    const [userId, setUserId] = useState<number>()
    const [taskId, setTaskId] = useState<number>()

    const handleResetSelectedProject = () => {
        setProjectObject(null)
    }
    
    useEffect(() => {
        setProjectObject(project)
    }, [project])

    useEffect(() => {
        if(projectObject){
            setIndexTabs(0)
        }
    }, [projectObject])

    const handleVerifyActiveAppointment = async () => {
        const response = await verifyActiveAppointment(token)

        if(response.isSuccess){
            setStartCounting(true)
            setUserId(response?.data?.active_task?.appointment?.user_id)
            setTaskId(response?.data?.active_task?.appointment?.task_id)
        } else{
            setStartCounting(false)
        }
    }

    useEffect(() => {
        handleVerifyActiveAppointment()
    }, [])

    useEffect(() => {
        if(initializeCounter === false){
            setStartCounting(false)
        } else if(initializeCounter){
            setStartCounting(true)
        }
    }, [initializeCounter, startCounting, results])

    return (
        <>
            <Box p="10px 0" display={"flex"} flexDirection="column">
                <Box as="header" height={"43px"}>
                    <Container
                        w="100%"
                        maxW={"100%"}
                        h="44px"
                        display="flex"
                        justifyContent={"space-between"}
                        alignItems="center"
                        gap="10px"
                        p="0 40px"
                        position={"relative"}
                    >
                        <Box>
                            <Heading as="h2">{projectObject ? projectObject[1] : ''}</Heading>
                        </Box>
                        <Box position={"absolute"} w='100%' maxW={'500px'} bottom="-35px" right="20px">
                            <Input type={"text"} placeholder="Buscar" />
                        </Box>
                    </Container>
                </Box>

                <Container
                mt="24px"
                w="100%"
                maxW={"100%"}
                display="flex"
                justifyContent={"space-between"}
                alignItems="center"
                gap="10px"
                p="0"
                >
                    <Tabs isLazy={true} onChange={(index) => setIndexTabs(index)} index={indexTabs} defaultIndex={-1} variant={"unstyled"} w="100%">
                        <TabList gap="10px" ml="30px">
                            <Tab
                                _selected={{ backgroundColor: '#CB943C', color: 'white'}}
                                _hover={{ backgroundColor: '#F3B34C', color: 'white' }}
                                fontWeight='600'
                                borderRadius="7px"
                            >
                                Lista
                            </Tab>
                            <Tab
                                isDisabled
                                _selected={{ backgroundColor: '#CB943C', color: 'white'}}
                                _hover={{ backgroundColor: '#F3B34C', color: 'white' }}
                                fontWeight='600'
                                borderRadius="7px"
                            >
                                Cronograma
                            </Tab>
                            <Tab
                                isDisabled
                                _selected={{ backgroundColor: '#CB943C', color: 'white'}}
                                _hover={{ backgroundColor: '#F3B34C', color: 'white' }}
                                fontWeight='600'
                                borderRadius="7px"
                            >
                                Quadro
                            </Tab>
                            <Tab
                                isDisabled
                                _selected={{ backgroundColor: '#CB943C', color: 'white'}}
                                _hover={{ backgroundColor: '#F3B34C', color: 'white' }}
                                fontWeight='600'
                                borderRadius="7px"
                            >
                                Sprints
                            </Tab>
                        </TabList>

                        <Divider my="10px" borderBottom="2px" borderColor={useColorModeValue('#cdcdcd', '#303030')} />

                        <TabPanels>
                            <TabPanel overflowX={"hidden"} p="20px 30px">
                                <Box animation={sliderAnimation}>
                                    {
                                        projectObject && projectObject[0] ? (
                                            <TableList projectId={projectObject[0]} />
                                        ) : (
                                            <Text pointerEvents={'none'}>Selecione um projeto AMS ou Jobs</Text>
                                        )
                                    }
                                </Box>
                            </TabPanel>
                            <TabPanel overflowX={"hidden"} p="20px 30px">
                                <Box animation={sliderAnimation}>teste 2</Box>
                            </TabPanel>
                            <TabPanel overflowX={"hidden"} p="20px 30px">
                                <Box animation={sliderAnimation}>teste 3</Box>
                            </TabPanel>
                            <TabPanel overflowX={"hidden"} p="20px 30px">
                                <Box animation={sliderAnimation}>teste 4</Box>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Container>
            </Box>
        </>
    );
}