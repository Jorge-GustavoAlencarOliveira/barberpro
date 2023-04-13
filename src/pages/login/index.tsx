import Head from "next/head"
import {Text, Flex, Center, Input, Button} from '@chakra-ui/react';
import Logo from '../../../public/image/logo.svg'
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { canSSRGuest } from "@/utils/canSSRGuest";
const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {signIn} = useContext(AuthContext)
  async function handleLogin () {
    if (email === '' || password === ''){
      return
    }
    await signIn({
      email,
      password
    })
  }
  return (
    <>
     <Head>
       <title>BarberPro - Seu Sistema Completo</title>
     </Head>
     <Flex background='barber.900' height='100vh' alignItems='center' justifyContent="center">
      <Flex width={640} direction='column' p={14} rounded={8}>
        <Center p={4}>
          <Image 
            src={Logo} 
            alt='Logo'
            quality={100}
            width={240}
          />
        </Center>
        <Input 
          background='barber.400'
          variant="filled"
          placeholder="email"
          type='text'
          color='barber.100'
          mb={3}
          _hover={{bg: 'transparent'}}
          outline='none'
          value={email}
          onChange={({target}) => setEmail(target.value)}
        />
        <Input 
          background='barber.400'
          variant="filled"
          placeholder="********"
          type='password'
          color='barber.100'
          _hover={{bg: 'transparent'}}
          mb={6}
          value={password}
          onChange={({target}) => setPassword(target.value)}
        />
        <Button 
          background='button.cta'
          color='gray.900'
          size='lg'
          _hover={{bg: '#ffb13e'}}
          mb={6}
          onClick={handleLogin}
        >
          Acessar
        </Button>
        <Center>
          <Link href='/register'>
            <Text color='barber.100' cursor='pointer'>Ainda não possui conta? <strong>Cadastre-se</strong> </Text>
          </Link>
        </Center>
      </Flex>
     </Flex>
    </>
  )
}

export default Login;


export const getServerSideProps = canSSRGuest(async(ctx) => {
  return{
    props:{

    }
  }
})