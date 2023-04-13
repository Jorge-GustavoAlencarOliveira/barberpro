import React from 'react'
import Head from 'next/head'
import { Flex, Text, Heading, Box, Input, Button } from '@chakra-ui/react'
import SideBar from '@/Components/SideBar'
import Link from 'next/link'
import { canSSRAuth } from '@/utils/canSSRAuth'
import { AuthContext } from '@/context/AuthContext'
import { setupAPIClient } from '@/services/api'
import { api } from '@/services/apiClient'
import Router from 'next/router'

interface userProps{
  id: string,
  name: string,
  email: string,
  endereco: string | null
}

interface profileProps{
  user: userProps,
  premium: boolean
}

const Profile = ({user, premium}: profileProps) => {
  const {logoutUser} = React.useContext(AuthContext);
  const [name, setName] = React.useState(user.name)
  const [endereco, setEndereco] = React.useState(user.endereco || '')
  
  async function handleUptade(){
    if(name === ''){
      return;
    }
    await api.put('/uptade', {
      name: name,
      endereco: endereco
    })
    Router.reload()
  }
  async function handleLogout(){
    await logoutUser()
  }
  
  return (
    <>
      <Head>
        <title>Minha conta - BarberPRO</title>
      </Head>
      <SideBar>
        <Flex direction='column' alignItems='flex-start' justifyContent='flex-start'>
          <Flex w='100%' direction='row' alignItems='center' justifyContent='flex-start'>
            <Heading fontSize='3xl' mt={4} mb={4} mr={4} color='orange.900'>Minha conta</Heading>
          </Flex>
          <Flex pt={8} pb={8} background='barber.400' maxW='700px' w='100%' direction='column' alignItems='center' justifyContent='center'>
            <Flex direction='column' w='85%'>
              <Text mb={2} fontSize='xl' fontWeight='bold'>
                Nome da barbearia:
              </Text>
              <Input
                w='100%'
                background='gray.900'
                placeholder='Nome da sua barbearia'
                size='lg'
                type='text'
                mb={3}
                value={name}
                onChange={({target}) => setName(target.value)}
              />
              <Text mb={2} fontSize='xl' fontWeight='bold'>
                Endereço:
              </Text>
              <Input
                w='100%'
                background='gray.900'
                placeholder='Endereço da barbearia'
                size='lg'
                type='text'
                mb={3}
                value={endereco}
                onChange={({target}) => setEndereco(target.value)}
              />
              <Text mb={2} fontSize='xl' fontWeight='bold'>
                Plano atual:
              </Text>
              <Flex 
                direction='row'
                w='100%'
                mb={3}
                p={1}
                borderWidth={1}
                rounded={6}
                background='barber.900'
                alignItems='center'
                justifyContent='space-between'
              >
                <Text p={2} fontSize='lg' color={premium ? '#fba931' : '#4dffb4'}>
                  {premium ? 'Plano Premium' : 'Plano Grátis'}
                </Text>
                <Link href='/planos'>
                  <Box cursor='pointer' p={1} pl={2} pr={2} background='#00cd52' rounded={4} color='white'>
                    Mudar plano
                  </Box>
                </Link>
              </Flex>
              <Button w='100%' mt={3} mb={4} bg='button.cta' size='lg' _hover={{bg: '#ffb13e'}}
               onClick={handleUptade}
              >
                Salvar
              </Button>
              <Button w='100%' mb={4} bg='transparent' size='lg' color='red.500' borderWidth={2} borderColor='red.500' _hover={{bg: 'transparent'}} onClick={handleLogout}>
                Sair da conta
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </SideBar>
    </>
  )
}

export default Profile


export const getServerSideProps = canSSRAuth(async(ctx) =>{
  try{
    const apiClient = setupAPIClient(ctx)
    const response = await apiClient.get('/me');
    const user = {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      endereco: response.data?.endereco
    }
    return{
      props: {
        user: user,
        premium: response.data.subscriptions?.status === 'active' ? true : false,
      }
    }
  }catch(err){
    console.log(err);
    return{
      redirect:{
        destination: '/dashboard',
        permanent: false 
      }
    }
  }
})