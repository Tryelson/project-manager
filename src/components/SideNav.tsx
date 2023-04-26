import React, { ReactNode, useEffect, useState } from "react";
import {
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Image,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Heading,
  useColorMode,
  List,
  ListItem,
  ListIcon,
  keyframes,
  EditablePreview,
  EditableInput,
  Editable,
} from "@chakra-ui/react";

import { IconType } from "react-icons";
import { BsHouseDoorFill } from "react-icons/bs";
import { BiTask, BiExit, BiTimeFive } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { AiTwotoneFolderOpen, AiFillFolder } from "react-icons/ai";
import { ThemeSelector } from "../pages/login";
import { useDispatch } from "react-redux";
import { setProject } from "../store/projectSlice";
import { useGetContractQuery } from "../api/contracts";
import { getCookie } from "cookies-next";
import { useLazyGetProjectQuery } from "../api/projects";
import { DataObject, IProjectList } from "../domain/projectList";
import { ThreeDots } from "react-loader-spinner";
import { IContract } from "../domain/contracts";
import CustomTooltip from "./CustomTooltip";

interface LinkItemProps {
  name: string;
  icon: IconType;
  url: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Página Inicial", icon: BsHouseDoorFill, url: '/project' },
  { name: "Minhas Tarefas", icon: BiTask, url: '/project' },
  { name: "Meus Apontamentos", icon: BiTimeFive, url: '/appointments' },
  { name: "Perfil", icon: CgProfile, url: '/project' },
  { name: "Sair", icon: BiExit, url: '/login' },
];

export default function SideNav({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }}>
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const token = getCookie('auth_token')
  const { colorMode } = useColorMode();
  const scrollBarStyle = {
    '&::-webkit-scrollbar': {
        width: '8px',
        height: '10px',
        borderRadius: '8px',
        backgroundColor: `${colorMode == 'dark' ? '#141414' : '#c5c5c5'}`,
    },

    '&::-webkit-scrollbar-thumb': {
    backgroundColor: `#CB943C`,
    borderRadius: '8px',
    },
  }

  const softEffect = keyframes`
    0%{
      opacity: 0;
      transform: translateY(20px)
    }
    100%{
      opacity: 1;
      transform: translateY(0)
    }`
  ;
  const animationSoftEffect = `${softEffect} 0.4s ease-in-out` 

  const [isListLoading, setIsListLoading] = useState<boolean>(true)
  const dispatch = useDispatch()

  // listing all projects in a contract
  const [projectsList, setProjectsList] = useState<IProjectList>()
  
  // listing all contracts
  const { data } = useGetContractQuery(token)

  // get projects when click in a contract
  const [getProject, results] = useLazyGetProjectQuery()

  // listing contracts in AMS and Jobs
  const [amsContracts, setAMSContracts] = useState<IContract[]>([])
  const [jobsContracts, setJobsContracts] = useState<IContract[]>([])

  // get all projects
  useEffect(() => {
    setProjectsList(results.data)
  }, [results])

  // get all contracts of AMS and Jobs
  useEffect(() => {
    let amsLocalObject = []
    let jobsLocalObject = []

    if(data){
      data.data.map((contract: IContract) => {
        if(contract.type == 'AMS'){
          amsLocalObject.push(contract)
        } else {
          jobsLocalObject.push(contract)
        }
      })

      setAMSContracts(amsLocalObject)
      setJobsContracts(jobsLocalObject)
    }
    
  }, [data])

  const getContract = async (event: React.MouseEvent<HTMLButtonElement>, isExpanded: boolean) => {
    if(!isExpanded){
      let contract = event.target as HTMLButtonElement
      setIsListLoading(true)
  
      const project = {
        token,
        id: contract.getAttribute('dataType')
      }

      await getProject(project)
      setIsListLoading(false)
    } else {
      setIsListLoading(true)
    }
  }
  
  return (
    <Box
      bg={useColorModeValue("white", "#191919")}
      boxShadow="-2px 0 10px black"
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      zIndex={"10"}
      {...rest}
    >
      <Box position={'absolute'} bottom='65px'>
        <ThemeSelector />
      </Box>

      <Flex m='41px 15px' alignItems="center" justifyContent="space-between">
        <Link href="/dashboard">
          <Image
            src={`${
              colorMode == "dark"
                ? "/assets/hivepro_light.png"
                : "/assets/hivepro_black.png"
            }`}
            w="150px"
          />
        </Link>

        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      <Divider mb="30px" borderBottomWidth='2px' borderColor={useColorModeValue('#cdcdcd', '#303030')} />

      {LinkItems.map((link, index) => (
        <NavItem key={index} icon={link.icon} url={link.url}>
          {link.name}
        </NavItem>
      ))}
      
      <Divider mt="30px" borderBottomWidth='2px' borderColor={useColorModeValue('#cdcdcd', '#303030')} />

      <Accordion allowToggle>
        <AccordionItem p="20px 0" borderTop='0'>
          {({ isExpanded }) => (
            <>
              <AccordionButton _hover={{backgroundColor: '#2F2F2F'}}>
                <Heading
                  as="h3"
                  flex="1"
                  textAlign="left"
                  fontSize={"1rem"}
                  display="flex"
                  alignItems={"center"}
                  gap="10px"
                >
                  <Icon as={isExpanded ? AiTwotoneFolderOpen : AiFillFolder} color={'#CC943C'} />
                  AMS
                </Heading>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel>
                <List spacing={3} h='100%' maxH='400px' overflow={'auto'} sx={scrollBarStyle}>
                  <Accordion allowToggle>
                    {
                      amsContracts && (
                        amsContracts.map((project) => {
                          return (
                            <AccordionItem key={project.id} border={0}>
                              {({ isExpanded }) => (
                                <>
                                  <AccordionButton onClick={(event) => getContract(event, isExpanded)} datatype={project.id.toString()} _hover={{backgroundColor: '#2F2F2F', borderRadius: '5px'}} borderRadius={'8px'} justifyContent='space-between'>
                                    <CustomTooltip name={project.name}>
                                      <Flex align={'center'} datatype={project.id.toString()}>
                                        <ListItem cursor='pointer' pointerEvents={'none'} datatype={project.id.toString()}>
                                          <ListIcon as={AiFillFolder} />
                                          {project.name.length > 13 ? `${project.name.substring(0, 13)}...` : project.name}
                                        </ListItem>
                                        <AccordionIcon pointerEvents={'none'} />
                                      </Flex>
                                    </CustomTooltip>
                                    
                                  </AccordionButton>

                                  <AccordionPanel pb={4} pl='20px' display={'flex'} flexDirection='column' gap='15px'>
                                    {
                                      isExpanded && (
                                        isListLoading ? (
                                          <Box display={'flex'} justifyContent='center'>
                                            <ThreeDots 
                                              height="20" 
                                              width="40" 
                                              radius="9"
                                              color="#CC943C" 
                                              ariaLabel="three-dots-loading"
                                              visible={true}
                                            />
                                          </Box>
                                        ) : (
                                          projectsList?.data.length ? (
                                            <>
                                              {
                                                projectsList?.data.map((project) => {                                              
                                                  return (
                                                    <Link key={project.id} href={`/project/${project.id}`} _hover={{textDecoration: 'none'}}>
                                                      <ListItem animation={animationSoftEffect} p='5px' pl='20px' borderRadius='5px' transition='all 0.2s ease-in-out' _hover={{backgroundColor: '#2F2F2F'}} cursor='pointer' display='flex' gap='10px' alignItems={'center'}>
                                                          {/* <ListIcon as={AiFillFolder} /> */}
                                                          <Box w='8px' h='8px' backgroundColor={'#CC943C'} borderRadius='100%'></Box>
                                                          { project.name.length > 13 ? `${project.name.substring(0, 13)}...` : project.name }
                                                      </ListItem>
                                                    </Link>
                                                  )
                                                })
                                              }

                                              <Editable cursor='not-allowed' animation={animationSoftEffect} defaultValue='+ Criar novo item' transition={'all 0.2s ease-in-out'} borderRadius='5px' _hover={{backgroundColor: '#2F2F2F'}} pl='20px' display='flex' alignItems={'center'} gap='10px'>
                                                <EditablePreview pointerEvents={'none'} cursor='not-allowed' />
                                                <EditableInput _focusVisible={{boxShadow: 'none'}} />
                                              </Editable>
                                            </>

                                          ) : (
                                            <Editable cursor='not-allowed' animation={animationSoftEffect} defaultValue='+ Criar novo item' transition={'all 0.2s ease-in-out'} borderRadius='5px' _hover={{backgroundColor: '#2F2F2F'}} pl='20px' display='flex' alignItems={'center'} gap='10px'>
                                              <EditablePreview pointerEvents={'none'} cursor='not-allowed' />
                                              <EditableInput _focusVisible={{boxShadow: 'none'}} />
                                            </Editable>
                                          )
                                        )
                                      )
                                    }
                                  </AccordionPanel>
                                </>
                              )}
                            </AccordionItem>
                          )
                        })
                      )
                    }
                  </Accordion>
                </List>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>

        <Divider borderColor={useColorModeValue('#cdcdcd', '#303030')} borderBottomWidth='2px' />

        <AccordionItem p="20px 0" border='0'>
          {({ isExpanded }) => (
            <>
              <AccordionButton _hover={{backgroundColor: '#2F2F2F'}}>
                <Heading
                  as="h3"
                  flex="1"
                  textAlign="left"
                  fontSize={"1rem"}
                  display="flex"
                  alignItems={"center"}
                  gap="10px"
                >
                  <Icon as={isExpanded ? AiTwotoneFolderOpen : AiFillFolder} color={'#CC943C'} />
                  JOBS
                </Heading>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={4}>
                <List spacing={3} h='100%' maxH='400px' overflow={'auto'} sx={scrollBarStyle} pr='10px'>
                  <Accordion allowToggle>
                    {
                      jobsContracts && (
                        jobsContracts.map((project) => {
                          return (
                            <AccordionItem key={project.id} border={0}>
                              {({ isExpanded }) => (
                                <>
                                  <AccordionButton onClick={(event) => getContract(event, isExpanded)} datatype={project.id.toString()} _hover={{backgroundColor: '#2F2F2F', borderRadius: '5px'}} borderRadius={'8px'} justifyContent='space-between'>
                                    <ListItem cursor='pointer' pointerEvents={'none'} datatype={project.id.toString()}>
                                      <ListIcon as={AiFillFolder} />
                                      {project.name.length > 13 ? `${project.name.substring(0, 13)}...` : project.name}
                                    </ListItem>
                                    <AccordionIcon pointerEvents={'none'} />
                                    
                                  </AccordionButton>

                                  <AccordionPanel pb={4} pl='20px' display={'flex'} flexDirection='column' gap='15px'>
                                    {
                                      isExpanded && (
                                        isListLoading ? (
                                          <Box display={'flex'} justifyContent='center'>
                                            <ThreeDots 
                                              height="20" 
                                              width="40" 
                                              radius="9"
                                              color="#CC943C" 
                                              ariaLabel="three-dots-loading"
                                              visible={true}
                                            />
                                          </Box>
                                        ) : (
                                          projectsList?.data.length ? (
                                            <>
                                              {
                                                projectsList?.data.map((project) => {                                              
                                                  return (
                                                    <Link key={project.id} href={`/project/${project.id}`} _hover={{textDecoration: 'none'}}>
                                                      <ListItem animation={animationSoftEffect} p='5px' pl='20px' borderRadius='5px' transition='all 0.2s ease-in-out' _hover={{backgroundColor: '#2F2F2F'}} cursor='pointer' display='flex' gap='10px' alignItems={'center'}>
                                                          {/* <ListIcon as={AiFillFolder} /> */}
                                                          <Box w='8px' h='8px' backgroundColor={'#CC943C'} borderRadius='100%'></Box>
                                                          { project.name.length > 13 ? `${project.name.substring(0, 13)}...` : project.name }
                                                      </ListItem>
                                                    </Link>
                                                  )
                                                })
                                              }

                                              <Editable cursor='not-allowed' animation={animationSoftEffect} defaultValue='+ Criar novo item' transition={'all 0.2s ease-in-out'} borderRadius='5px' _hover={{backgroundColor: '#2F2F2F'}} pl='20px' display='flex' alignItems={'center'} gap='10px'>
                                                <EditablePreview pointerEvents={'none'} cursor='not-allowed' />
                                                <EditableInput _focusVisible={{boxShadow: 'none'}} />
                                              </Editable>
                                            </>

                                          ) : (
                                            <Editable cursor='not-allowed' animation={animationSoftEffect} defaultValue='+ Criar novo item' transition={'all 0.2s ease-in-out'} borderRadius='5px' _hover={{backgroundColor: '#2F2F2F'}} pl='20px' display='flex' alignItems={'center'} gap='10px'>
                                                <EditablePreview pointerEvents={'none'} cursor='not-allowed' />
                                                <EditableInput _focusVisible={{boxShadow: 'none'}} />
                                            </Editable>
                                          )
                                        )
                                      )
                                    }
                                  </AccordionPanel>
                                </>
                              )}
                            </AccordionItem>
                          )
                        })
                      )
                    }
                  </Accordion>
                </List>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>

        <Divider borderColor={useColorModeValue('#cdcdcd', '#303030')} borderBottomWidth='2px' />

      </Accordion>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  url: string;
}

// principal menu itens
const NavItem = ({ icon, children, url }: NavItemProps) => {
  return (
    <Link
      href={url}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="10px 15px"
        role="group"
        cursor="pointer"
        transition={'all 0.2s ease-in-out'}
        _hover={{
          bg: "#2f2f2f",
          color: "white",
        }}
      >
        {icon && (
          <Icon
            w="18px"
            h="18px"
            mr="4"
            fontSize="16"
            color={'#CC943C'}
            transition={'all 0.2s ease-in-out'}
            _groupHover={{
              color: "#ffbb50",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>
    </Flex>
  );
};