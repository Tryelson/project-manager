import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { Container, Tabs, TabList, Tab, Divider, useColorModeValue, TabPanels, TabPanel, Box, FormControl, Flex, FormLabel, Input, keyframes, Text, Heading } from "@chakra-ui/react";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLazyGetTasksQuery } from "../../api/tasks";
import { ProjectState } from "../../store/projectSlice";
import { RootState } from "../../store/store";
import { handleReloadtable } from "../../store/reloadTable";
import { useLazyGetProjectQuery } from "../../api/projects";

export default function Project(){
    const token = getCookie('auth_token')
    const router = useRouter()
    const dispatch = useDispatch()

    const animationKeyframes = keyframes`
        0% { opacity: 0; transform: translateX(300px); position: absolute; }
        50% { opacity: 1; }
        100% { transform: translateX(0); position: relative; }
    `;

    const sliderAnimation = `${animationKeyframes} 0.2s ease-in-out`;

    const project = useSelector((state: RootState) => state.project);
    const initializeCounter = useSelector((state: RootState) => state.appointmentsState);
    const isTableLoading = useSelector((state: RootState) => state.reloadTable)

    const [getProject, projectResult] = useLazyGetProjectQuery()

    const [projectObject, setProjectObject] = useState<ProjectState>()
    const [indexTabs, setIndexTabs] = useState<number>()
    const [startCounting, setStartCounting] = useState<boolean>(false)
    const [getTasks, tasksResults] = useLazyGetTasksQuery()
    
    const handleGetAllTasks = async () => {
        dispatch(handleReloadtable([true, false]))
        
        const payload = {
          token,
          projectId: router.query.projectId
        }
    
        if(router?.query?.projectId){
            await getTasks(payload)
            dispatch(handleReloadtable([false, false]))
        }
    }

    const handleGetProject = async () => {
        if(router?.query?.projectId){
            const payload = {
                token,    
                id: router.query.projectId
            }
    
            await getProject(payload)
        }
    }

    const handleRefreshTableData = async () => {
        const payload = {
            token,
            projectId: router?.query?.projectId
        }
        await getTasks(payload)
    }

    useEffect(() => {
        if(isTableLoading[1]){
            handleRefreshTableData()
        }
    }, [isTableLoading[1]])
    
    useEffect(() => {
        setProjectObject(project)
    }, [project])

    useEffect(() => {
        if(projectObject){
            setIndexTabs(0)
        }
    }, [projectObject])

    useEffect(() => {
        if(initializeCounter === false){
            setStartCounting(false)
        } else if(initializeCounter){
            setStartCounting(true)
        }
    }, [initializeCounter, startCounting])

    useEffect(() => {
        handleGetAllTasks()
        handleGetProject()
    }, [router.query.projectId])

    return (
        <>
            <Container
                w="100%"
                maxW={"100%"}
                display="flex"
                justifyContent={"space-between"}
                alignItems="center"
                gap="10px"
                p="0"
                pt="77px"
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
                                    <Text>Selecione um projeto AMS ou Jobs</Text>
                                </Box>
                            </TabPanel>
                            <TabPanel overflowX={"hidden"} p="20px 30px">
                                <Box animation={sliderAnimation}>teste 2</Box>
                            </TabPanel>
                            <TabPanel overflowX={"hidden"} p="20px 30px">
                                <Box animation={sliderAnimation}>teste 3</Box>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
            </Container>
        </>
    )
}