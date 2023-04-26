import React, { useEffect } from "react";
import { Flex, Box, Button, useColorMode, FormControl, FormLabel, Heading, Input, Image, InputGroup, InputLeftElement, useToast, FormHelperText, Link} from "@chakra-ui/react";
import { EmailIcon, InfoIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { useState } from "react";
import Head from "next/head";
import { getCookie } from "cookies-next";
import { ThemeSelector } from "./index";
import { useSetRecoveryPasswordMutation } from "../../api/user";
import { useRouter } from "next/router";

export default function RecoveryPassword() {
    const token = getCookie('auth_token')
    const route = useRouter()

    useEffect(() => {
        if(token){
            route.push('/dashboard')
        }
    }, [token])

    return (
        <Box>
            <Head>
                <title>Hive Project - Recuperar Senha</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Flex justifyContent={'center'} alignItems={'center'} minHeight='100vh'>
                <ThemeSelector />
                <RecoveryPasswordArea />
            </Flex>
        </Box>
    )
}

const RecoveryPasswordArea = () => {
    const { colorMode } = useColorMode()
    const toast = useToast()
    const route = useRouter()

    const [email, setEmail] = useState<string>('')

    const [setRecoveryPassword, {isLoading, isSuccess, isError}] = useSetRecoveryPasswordMutation()

    const handleFormSubmit = async () => {
        const payload = {email}
        setRecoveryPassword(payload)
    }

    useEffect(() => {
        if(isSuccess){
            toast({
                title: 'Sucesso!',
                description: 'Um link de redefinição de senha foi enviado para seu e-mail!',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
            setTimeout(() => {
                route.push('/login')
            }, 500);
        } 
        
        if(isError){
            toast({
                title: 'Erro!',
                description: "Verifique suas credenciais.",
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: 'top'
            })
        }

    }, [isLoading])

    return (
        <Box as="main" maxW={'37.5rem'} w='calc(100% - 2.5rem)' mx={'auto'} boxShadow={'0 0 1.25rem #00000042'} border={'2px'} borderColor="#CC953D" padding={'2.1875rem'} pb={'1.875rem'} borderRadius='1.25rem'>
            <Box mb={'1.875rem'}>
                <Heading as='h1'>
                    <Flex justifyContent={'center'} flexDirection={['column', 'row']} alignItems={'center'} gap={'1.25rem'}>
                        Bem-vindos a <Image width={'7.5rem'} src={colorMode === 'light' ? '/assets/hivepro_black.png' : '/assets/hivepro_light.png'} />
                    </Flex>
                </Heading>

            </Box>

            <Box as="form">
                <FormControl pt={'1.875rem'} pb={'3.125rem'} isInvalid={isError}>
                    <Box>
                        <FormLabel htmlFor="email">E-mail</FormLabel>

                        <InputGroup>
                            <InputLeftElement pointerEvents={'none'} children={<EmailIcon />} />
                            <Input _placeholder={{color: 'gray'}} borderColor={'gray'} type={'email'} id={'email'} onChange={event => setEmail(event.target.value)} placeholder="Digite seu endereço de E-mail" />
                        </InputGroup>
                    </Box>

                    <FormHelperText display={'flex'} gap='0.3125rem' alignItems={'center'}><InfoIcon /> Você receberá um link em seu e-mail para redefinir sua senha! </FormHelperText>
                </FormControl>

                <Button onClick={handleFormSubmit} boxShadow={'0 0 0.1875rem black'} isLoading={isLoading} loadingText={'Enviando...'} spinnerPlacement={'end'} colorScheme='orange' bg={'#CC953D'} w={'100%'}>Enviar</Button>
            </Box>

            <Box mt={'1.875rem'}>
                <Link href="/login"><ArrowBackIcon /> Login</Link>
            </Box>
        </Box>
    )
}