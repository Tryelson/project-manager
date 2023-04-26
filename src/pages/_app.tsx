import React, { useEffect, useState } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { mode } from "@chakra-ui/theme-tools";
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { Flex, Box } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';
import { useSetRefreshUserTokenMutation } from '../api/user';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { debounce } from 'lodash'
import Layout from '../components/Layout';
import '@styles/globals.css'

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
}

const theme = extendTheme({
  config,
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode('#f7fafc', '#1E1E1E')(props)
      }
    })
  }
})

export default function App({ Component, pageProps }) {
  const renderWithLayout = Component.getLayout || function(page){
    return <Layout>{page}</Layout>
  }

  return (
    <Provider store={store}>
      <RefreshFragment>
        <ChakraProvider theme={theme}>
            <LoadingScreen />
            {
              renderWithLayout(<Component {...pageProps} />)
            }
        </ChakraProvider>
      </RefreshFragment>
    </Provider>
  )
}

export const LoadingScreen = () => {
  const [hideSpinner, setHideSpinner] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setHideSpinner(false)
    }, 1000)
  }, [])

  return (
    <Box position={'relative'} zIndex={100}>
      {hideSpinner &&
        <Flex justifyContent={'center'} alignItems={'center'} position={'fixed'} width={'100%'} height={'100%'} top={0} left={0} backgroundColor={'#000000e3'}>
            <Spinner color='orange' width={'6.25rem'} height={'6.25rem'} borderWidth={'0.3125rem'} />
        </Flex>
      }
    </Box>
  )
}

export const RefreshFragment = (props) => {
  const router = useRouter()
  const token = getCookie('auth_token')
  const [setRefreshUserToken, { error } ] = useSetRefreshUserTokenMutation()

  const handleVerifyUserToken = debounce(async () => {
    await setRefreshUserToken(token as string)
  }, 100)

  useEffect(() => {
      handleVerifyUserToken()
  }, [])

  useEffect(() => {
    if(error){
      router.push('/login')
    }
  }, [error])

  return props.children
}