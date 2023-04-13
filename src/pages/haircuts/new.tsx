import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import SideBar from '@/Components/SideBar'
import { Flex, Text, Heading, Button, Input, Box, Center } from '@chakra-ui/react'
import {FiChevronLeft} from 'react-icons/fi'
import { canSSRAuth } from '@/utils/canSSRAuth' 
import { setupAPIClient } from '@/services/api'
import { api } from '@/services/apiClient'
import Router from 'next/router'

interface SubscriptionProps {
  subscription: boolean,
  count: number
}

const New = ({subscription, count }:SubscriptionProps) => {
  const [name, setName] = React.useState('');
  const [preco, setPreco] = React.useState('');


  async function handleNewHaircut(){
    if (name === '' || preco === ''){
      return;
    }
    try{
      await api.post('/haircut', {
        name: name,
        price: Number(preco)
      });
      Router.push('/haircuts')    
    }catch(err){
      console.log(err)
      alert("erro ao cadastrar")
    }
  }

  return (
    <>
      <Head>
        <title>Novo modelo de corte - BarberPRO</title>
      </Head>
      <SideBar>
        <Flex 
          direction='row' 
          alignItems='center' 
          justifyContent='center'
        >
          <Flex 
            w='100%' 
            direction='row'
            alignItems='center'  
            justifyContent='flex-start' 
            mb={4}
          >
            <Link href='/haircuts'>
              <Button bg='gray.700' h={8}>
                <FiChevronLeft color='#fff' size={24}/>
                Voltar
              </Button>
            </Link>
            <Heading 
              fontSize='3xl' 
              mr={4}
              ml={4} 
              color='orange.900'
            >
              Modelos de Cortes
            </Heading>
          </Flex>
        </Flex>
        <Flex pt={8} pb={8} background='barber.400' maxW='700px' w='100%' direction='column' alignItems='center' justifyContent='center'>
            <Flex direction='column' w='85%' alignItems='center'>
              <Heading mb={6} fontSize='3xl'>
                  Cadastrar modelo
              </Heading>
              <Input
                w='100%'
                background='gray.900'
                placeholder='Nome do corte'
                size='lg'
                type='text'
                mb={3}
                disabled={!subscription && count >= 3}
                value={name}
                onChange={({target}) => setName(target.value)}
              />
              <Input
                w='100%'
                background='gray.900'
                placeholder='Preço exemplo: 45.90'
                size='lg'
                type='text'
                mb={3}
                disabled={!subscription && count >= 3}
                value={preco}
                onChange={({target}) => setPreco(target.value)}
              />
              <Button w='100%' mt={3} mb={4} bg='button.cta' size='lg' _hover={{bg: '#ffb13e'}} isDisabled={!subscription && count >= 3} onClick={handleNewHaircut}>
                Cadastrar
              </Button>
              {!subscription && count >= 3 &&(
                <Flex>
                  <Text mr={1}>Você atingiu seu limite de cortes. </Text>
                  <Link href='/planos'>
                    <Text color='#4dffb4' fontWeight='bold' cursor='pointer'>
                      Seja premium.
                    </Text>
                  </Link>
                </Flex>
              )}
            </Flex>
        </Flex>
      </SideBar>
    </>
  )
}

export default New


export const getServerSideProps = canSSRAuth(async(ctx) =>{
  try{
    const api = setupAPIClient(ctx)
    const response = await api.get('/haircut/check');
    const count = await api.get('/haircut/active');
    return{
      props:{
         subscription: response.data?.subscriptions?.status === 'active' ? true : false,
         count: count.data 
      }
    }

  }catch(err){
    return{
      redirect:{
        destination: '/dashboard',
        permanent: false
      }
    }
  }
  
})