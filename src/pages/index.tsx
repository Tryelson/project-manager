import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const route = useRouter()

  useEffect(() => {
    route.push('/login')
  })
  
  return (
    <>
      <Head>
        <title>Hive Project</title>
        <meta name="description" content="Hive Project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
    </>
  )
}