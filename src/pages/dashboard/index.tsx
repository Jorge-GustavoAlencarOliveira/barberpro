import React from 'react'
import { canSSRAuth } from '@/utils/canSSRAuth'
import {Flex, Text, useMediaQuery, Button, Heading, useDisclosure} from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import SideBar from '@/Components/SideBar'
import { setupAPIClient } from '@/services/api'
import {IoMdPerson} from 'react-icons/io'
import {FiPlus} from 'react-icons/fi'
import ModalInfo from '@/Components/Modal'
import { api } from '@/services/apiClient'

export interface schedulesProps{
  id: string,
  customer: string,
  haircut: {
    id: string,
    name: string,
    price: number,
    user_id: string
  }
}

interface scheduleList{
  schedules: schedulesProps[]
}

const Dashboard = ({schedules}:scheduleList) => {
  const [isMobile] = useMediaQuery('(max-width: 600px)');
  const [list, setList] = React.useState<schedulesProps[]>(schedules || [])
  const [service, setService] = React.useState<schedulesProps>()
  const {isOpen, onOpen, onClose} = useDisclosure()
   
  function handleModal(item: schedulesProps){
    setService(item)
    onOpen()
  }

  async function handleFinishService (id: string){
    try{
      await api.delete('/service/finish', {
        params: {
          adent_id: id
        }
      })


      
      const listUptade = list.filter(item => {
        return item.id !== service.id
      })
      setList(listUptade);
      
    }catch(err){
      console.log(err)
    }
  }
  
  return (
    <>
      <Head>
        <title>BarbePRO - Minha barbearia</title>
      </Head>
      <SideBar>
      <Flex 
          direction='row' 
          alignItems='center' 
          justifyContent='center'
        >
          <Flex 
            w='100%' 
            direction={isMobile ? 'column' : 'row'} 
            alignItems={isMobile ? 'flex-start' : 'center'}  
            justifyContent='flex-start' 
            mb={0}
          >
            <Heading 
              fontSize={isMobile ? '28px' : '3xl'} 
              mt={4} 
              mb={4} 
              mr={4} 
              color='orange.900'
            >
              Agenda
            </Heading>
            <Link href='/new'>
              <Button display='flex' direction='row' gap={2} bg='gray.700' _hover={{bg: 'gray.500'}}>
                <FiPlus size={20} color='#fff'/>
                Registrar
              </Button>  
            </Link>
          </Flex>
        </Flex>
        {list && (
          list.map((item)  => {
            return(
              <Flex key={item.id} onClick={() => handleModal(item)}>
                <Flex cursor='pointer' w='100%' p={4} bg='barber.400' direction='row' rounded='4' mt={6} mb={2} justifyContent='space-between'>
                <Flex>
                    <IoMdPerson size={28} color='#fff'/>
                    <Text ml={6} fontWeight='bold' color='#fff'>
                      {item?.customer}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text ml={6} fontWeight='bold' color='#fff'>
                      {item?.haircut?.name}
                    </Text>
                  </Flex>
                  <Text fontWeight='bold' color='#fff'>
                    R$ {item?.haircut?.price}.00
                  </Text>
                </Flex>
              </Flex>
            )
          })
        )}
      </SideBar>
      <ModalInfo 
        isOpen={isOpen} 
        onClose={onClose} 
        onOpen={onOpen} 
        data={service} 
        finishService={() => handleFinishService(service?.id)}
      />
    </>  
  )
}

export default Dashboard

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const api = setupAPIClient(ctx);

  try{
    const response = await api.get('/service/list');
    return{
      props:{
        schedules: response.data
      }
    }

  }catch{
    return{
      redirect:{
        destination: '/login',
        permanent: false
      }
    }
  }
})