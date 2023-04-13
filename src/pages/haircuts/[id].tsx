import React, {ChangeEvent} from 'react'
import Head from 'next/head'
import { Flex, Text, Heading, Button, useMediaQuery, Input, Stack, Switch , Center} from '@chakra-ui/react'
import SideBar from '@/Components/SideBar'
import {FiChevronLeft} from 'react-icons/fi'
import Link from 'next/link'
import { canSSRAuth } from '@/utils/canSSRAuth'
import { setupAPIClient } from '@/services/api'
import { api } from '@/services/apiClient'
import Router from 'next/router'

interface haircutItems{
  id: string,
  name: string,
  price: number | string,
  status: boolean
}

interface SubscriptionsProps {
  id: string,
  status: string | null
}

interface haircutProps{
  haircut: haircutItems
  subscription: SubscriptionsProps | null
}



const EditHaircut = ({haircut, subscription}:haircutProps) => {
  const [isMobile] = useMediaQuery('(max-width: 600px)')
  const [name, setName] = React.useState(haircut?.name || '');
  const [price, setPrice] = React.useState(haircut?.price || '')
  const [disabled, setDisabled] = React.useState(haircut?.status ? 'disabled' : 'enabled');
  const [status, setStatus] = React.useState(haircut?.status)
  
  function handleDisabled(e: ChangeEvent<HTMLInputElement>){
    if(e.target.value === 'disabled'){
      setDisabled('enabled')
      setStatus(false)
    } else{
      setDisabled('disabled');
      setStatus(true)
    } 
    
  }

  async function handleUptade () {
    if(name === '' || price === ""){
      return;
    }
    try{
      await api.put('/haircut/uptade', {
       name: name,
       price: Number(price),
       status: status,
       haircut_id: haircut?.id
      })
      alert('Corte atualizado')
      Router.push('/haircuts')
    }catch(err){
      console.log(err)
    }
  }

  return (
   <>
     <Head>
       <title>Editando modelo de corte - BarberPRO</title>
     </Head>
     <SideBar>
       <Flex direction='column' alignItems='flex-start' justifyContent='flex-start'>
         <Flex 
          direction={isMobile ? 'column' : 'row'} 
          w='100%' 
          alignItems={isMobile ? 'flex-start' : 'center'}
          justifyContent='flex-start'
          mb={isMobile ? 4 : 8}  
        >  
          <Link href={'/haircuts'}>
            <Button mr={6} display='flex' alignItems='center' justifyContent='center' bg='gray.700' _hover={{bg: 'gray.600'}}>
              <FiChevronLeft size={24} color='#fff'/>
              Voltar
            </Button>            
          </Link>                  
          <Heading fontSize={isMobile ? '22px' : '3xl'} color='white'>
            Editar corte
          </Heading>
         </Flex>
         <Flex pt={8} pb={8} background='barber.400' maxW='700px' w='100%' direction='column' alignItems='center' justifyContent='center'>
            <Flex direction='column' w='85%' alignItems='center'>
              <Heading mb={6} fontSize='3xl'>
                  Editar corte
              </Heading>
              <Input
                w='100%'
                background='gray.900'
                placeholder='Nome do corte'
                size='lg'
                type='text'
                mb={3}
               value={name}
               onChange={({target}) => setName(target.value)}
              />
              <Input
                w='100%'
                background='gray.900'
                placeholder='Valor do seu corte ex: 45.90'
                size='lg'
                type='text'
                mb={3}
                value={price}
                onChange={({target}) => setPrice(target.value)}
              />
              <Stack w='100%' my={6} display='flex' direction='row' justifyContent='flex-start' >
                <Text fontWeight='bold'>Desativar corte</Text>
                <Switch size='lg' colorScheme='red' value={disabled} isChecked={disabled === 'disabled' ? false : true} onChange={(e:ChangeEvent<HTMLInputElement>) => handleDisabled(e)}/>
              </Stack>
              <Button w='100%' mt={3} mb={4} bg='button.cta' size='lg' _hover={{bg: '#ffb13e'}}isDisabled={subscription?.status !== 'active'} onClick={handleUptade}>
                Salvar
              </Button>
              {subscription?.status !== "active" && (
                <Flex direction='row' alignItems='center' justifyContent='center'>
                  <Link href='/planos'>
                    <Text fontWeight='bold' color='#31fb6a' mr={1}>Seja premium</Text>
                  </Link>
                  <Text>e tenha todos os acessos liberados</Text>
                </Flex>
              )}
            </Flex>
        </Flex>
       </Flex>
     </SideBar>
   </>
  )
}

export default EditHaircut

export const getServerSideProps = canSSRAuth(async(ctx)=>{
  const {id} = ctx.params
  const getDetail = async () =>{
    const api = setupAPIClient(ctx)
    const response = await api.get('/haircut/detail', {
      params:{
        haircut_id: id
      }
    })
    return response.data
  }
  const getSubscription = async () => {
    const api = setupAPIClient(ctx)
    const check = await api.get('/haircut/check')
    return check.data?.subscriptions
  }
  try{
    const [haircut, subscriptions] = await Promise.all([getDetail(), getSubscription()]);
    return{
      props:{
        haircut: haircut,
        subscription: subscriptions
      }
    }
  }catch(err){
    console.log(err)
    return{
      redirect:{
        destination: '/haircuts',
        permanent: false
      }
    }
  }
})