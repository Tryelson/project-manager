import React, { useEffect } from "react";
import { Flex, Box, Button, useColorMode, FormControl, FormLabel, Heading, Input, Image, InputGroup, InputLeftElement, useToast, FormHelperText, Link, Fade, InputRightElement, useBoolean } from "@chakra-ui/react";
import { LockIcon, ArrowBackIcon, ViewIcon, ViewOffIcon, InfoIcon } from "@chakra-ui/icons";
import { useState } from "react";
import Head from "next/head";
import { getCookie } from "cookies-next";
import { ThemeSelector } from "../login/index";
import { useSetResetPasswordMutation } from "../../api/user";
import { useRouter } from "next/router";

export default function ResetPassword() {
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
                <title>Hive Project - Resetar Senha</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Flex justifyContent={'center'} alignItems={'center'} minHeight='100vh'>
                <ThemeSelector />
                <ResetPasswordArea />
            </Flex>
        </Box>
    )
}

const ResetPasswordArea = () => {
    const { colorMode } = useColorMode()
    const toast = useToast()
    const route = useRouter()

    const [showPassword, setShowPassword] = useBoolean()
    const [showConfirmPassword, setShowConfirmPassword] = useBoolean()

    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const [setResetPassword, {isLoading, isSuccess, isError}] = useSetResetPasswordMutation()

    const handleFormSubmit = async () => {
        const email = route.query.email
        const token = route.query.slug

        const payload = {email, token, password}
        setResetPassword(payload)
    }

    useEffect(() => {
        if(isSuccess){
            toast({
                title: 'Sucesso!',
                description: 'Sua senha foi redefinida com sucesso!',
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
                        <FormLabel htmlFor="email">Digite a nova senha</FormLabel>

                        <InputGroup>
                        <InputLeftElement pointerEvents={'none'} children={<LockIcon />} />

                        <Input borderColor={'gray'} _placeholder={{color: 'gray'}} type={`${showPassword ? 'text' : 'password'}`} onChange={event => setPassword(event.target.value)} id={'password'} placeholder="Digite a sua senha" />

                        <Fade in={showPassword}>
                            <InputRightElement onClick={setShowPassword.toggle} cursor={'pointer'} children={<ViewOffIcon />} />
                        </Fade>

                        <Fade in={!showPassword}>
                            <InputRightElement onClick={setShowPassword.toggle} cursor={'pointer'} children={<ViewIcon />} />
                        </Fade>
                        </InputGroup>
                    </Box>

                    <Box mt={'1.875rem'}>
                        <FormLabel htmlFor="email">Confirme a senha</FormLabel>

                        <InputGroup>
                            <InputLeftElement pointerEvents={'none'} children={<LockIcon />} />

                            <Input borderColor={'gray'} _placeholder={{color: 'gray'}} type={`${showConfirmPassword ? 'text' : 'password'}`} onChange={event => setConfirmPassword(event.target.value)} id={'confirm-password'} placeholder="Digite a sua senha" />

                            <Fade in={showConfirmPassword}>
                                <InputRightElement onClick={setShowConfirmPassword.toggle} cursor={'pointer'} children={<ViewOffIcon />} />
                            </Fade>

                            <Fade in={!showConfirmPassword}>
                                <InputRightElement onClick={setShowConfirmPassword.toggle} cursor={'pointer'} children={<ViewIcon />} />
                            </Fade>
                        </InputGroup>
                    </Box>

                    <FormHelperText display={'flex'} gap='0.3125rem' alignItems={'center'}><InfoIcon /> Sua senha deve conter no mínimo 8 dígitos</FormHelperText>
                </FormControl>

                <Button onClick={handleFormSubmit} boxShadow={'0 0 0.1875rem black'} isDisabled={password != confirmPassword || !confirmPassword.length || password.length < 8} isLoading={isLoading} loadingText={'Enviando...'} spinnerPlacement={'end'} colorScheme='orange' bg={'#CC953D'} w={'100%'}>Enviar</Button>
            </Box>

            <Box mt={'1.875rem'}>
                <Link href="/login"><ArrowBackIcon /> Login</Link>
            </Box>
        </Box>
    )
}