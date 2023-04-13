import Head from "next/head"
import {Text, Flex, Center, Input, Button} from '@chakra-ui/react';
import Logo from '../../../public/image/logo.svg'
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AuthContext } from "@/context/AuthContext";
import { canSSRGuest } from "@/utils/canSSRGuest";

const Register = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {signUp} = React.useContext(AuthContext);  
  async function handleSingup (){
    if (name === '' && email === '' && password === ''){
      console.log('erro');
    }
    await signUp({
      name,
      email, 
      password
    })
  }
  return (
    <>
     <Head>
       <title>BarberPro - Crie sua conta no BarberPRO</title>
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
          placeholder="Nome da barbearia"
          type='text'
          color='barber.100'
          mb={3}
          _hover={{bg: 'transparent'}}
          outline='none'
          value={name}
          onChange={({target}) => setName(target.value)}
        />
        <Input 
          background='barber.400'
          variant="filled"
          placeholder="Email"
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
          onClick={handleSingup}
        >
          Cadastrar
        </Button>
        <Center>
          <Link href='/login'>
            <Text color='barber.100' cursor='pointer'>Já possui conta? <strong>Faça login</strong> </Text>
          </Link>
        </Center>
      </Flex>
     </Flex>
    </>
  )
}

export default Register;

export const getServerSideProps = canSSRGuest(async(ctx) => {
  return{
    props:{

    }
  }
})