import { useRouter } from "next/router";
import { Container, Tabs, TabList, Tab, Divider, useColorModeValue, TabPanels, TabPanel, Box, Input, keyframes, Heading } from "@chakra-ui/react";
import TableList from "../../../components/TableList";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { useLazyGetSingleProjectQuery, useLazyGetProjectQuery } from "../../../api/projects";

interface IProjectProps {
    defaultTaskId: string | string[];
}

export default function Project({ defaultTaskId }: IProjectProps){
    const token = getCookie('auth_token')
    const router = useRouter()
    const animationKeyframes = keyframes`
        0% { opacity: 0; transform: translateX(300px); position: absolute; }
        50% { opacity: 1; }
        100% { transform: translateX(0); position: relative; }
    `;
    const sliderAnimation = `${animationKeyframes} 0.2s ease-in-out`;

    const [getSingleProject, projectResult] = useLazyGetSingleProjectQuery()

    const [indexTabs, setIndexTabs] = useState<number>()

    const handleGetProject = async () => {
        if(router?.query?.projectId){
            const payload = {
                token,
                id: router.query.projectId
            }
        }
    }

    const handleGetSingleProject = async () => {
        const payload = {
            token,
            projectId: router.query.projectId
        }
        await getSingleProject(payload)
    }

    useEffect(() => {
        handleGetProject()

        if(router.query?.projectId){
            handleGetSingleProject()
            setIndexTabs(0)
        }
    }, [router.query.projectId])

    return (
        <>
            <Box as="header" py='15px' minH='73px'>
                <Container
                    w="100%"
                    maxW={"100%"}
                    display="flex"
                    justifyContent={"space-between"}
                    alignItems="center"
                    gap="10px"
                    p="0 40px"
                    position={"relative"}
                >
                    <Box>
                        <Heading as="h2">{projectResult.isSuccess ? projectResult.data.data.name : ''}</Heading>
                    </Box>
                    <Box position={"absolute"} w='100%' maxW={'500px'} bottom="-35px" right="20px">
                        <Input type={"text"} placeholder="Buscar" />
                    </Box>
                </Container>
            </Box>

            <Container
                mt="4px"
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
                                    <TableList defaultTaskId={defaultTaskId} projectName={projectResult.isSuccess ? projectResult.data.data.name : ''} />
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