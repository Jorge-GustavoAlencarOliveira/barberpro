import Head from "next/head"
import {Text, Flex} from '@chakra-ui/react';

export default function Home(){  
  return(
    <>
     <Head>
       <title>BarberPro - Seu Sistema Completo d</title>
     </Head>
     <Flex background='barber.900' height='100vh' alignItems='center' justifyContent="center">
      <Text color='barber.100'> Pagina Home </Text>
     </Flex>
    </>
  )
}