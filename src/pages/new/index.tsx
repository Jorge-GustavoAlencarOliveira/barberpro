import React from 'react'
import Head from 'next/head'
import SideBar from '@/Components/SideBar'
import {Flex, Heading, Text, Button, Input, Select} from '@chakra-ui/react'
import Link from 'next/link'
import {FiChevronLeft} from 'react-icons/fi'
import { canSSRAuth } from '@/utils/canSSRAuth'
import { setupAPIClient } from '@/services/api'
import { api } from '@/services/apiClient'
import Router from 'next/router'
interface haircutProps {
  id: string;
  name: string;
  price: number;
  status: boolean;
  user_id: string
}

interface haircutList {
  listHaircut: haircutProps[]
}
const NewSchedule = ({listHaircut}:haircutList) => {
  const [customer, setCustomer] = React.useState('')
  const [select, setSelect] = React.useState(listHaircut[0]);
  
  function handleSelect(id: string){
    const haircutItem = listHaircut.find(item => item.id === id)
    setSelect(haircutItem)
  }

  async function handleSchedule () {
    if(customer === ''){
      return;
    }
    try{
      await api.post('/service',{
        customer: customer,
        haircut_id: select?.id
      })
     Router.push('/dashboard')

    }catch(err){
      console.log(err)
    }
  }

  return (
    <>
      <Head><title>BarbePro - Novo agendamento</title></Head>      
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
             Novo Serviço
            </Heading>
          </Flex>
        </Flex>
        <Flex pt={8} pb={8} background='barber.400' maxW='700px' w='100%' direction='column' alignItems='center' justifyContent='center'>
            <Flex direction='column' w='85%' alignItems='center'>
              <Input
                w='100%'
                background='gray.900'
                placeholder='Nome do cliente'
                size='lg'
                type='text'
                mb={3}
                value={customer}
                onChange={({target}) => setCustomer(target.value)}
              />
              <Select onChange={({target}) => handleSelect(target.value)}>
                {listHaircut?.map(item =>(
                  <option key={item?.id} style={{background:'black'}} value={item?.id}>{item?.name}</option>
                ))}
              </Select>
              <Button w='100%' mt={3} mb={4} bg='button.cta' size='lg' _hover={{bg: '#ffb13e'}} onClick={handleSchedule} >
                Registrar
              </Button>
            </Flex>
        </Flex>
      </SideBar>
    </>
  )
}

export default NewSchedule

export const getServerSideProps = canSSRAuth(async(ctx) => {
  const api = setupAPIClient(ctx)
  try{
    const response = await api.get('/haircut',{
      params: {
        status: true
      }
    })
    return {
      props:{
        listHaircut: response.data
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