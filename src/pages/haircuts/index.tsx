import React, {ChangeEvent} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import SideBar from '@/Components/SideBar'
import { Flex, Text, Heading, Button, Stack, Switch, useMediaQuery } from '@chakra-ui/react'
import {IoMdPricetag} from 'react-icons/io'
import { canSSRAuth } from '@/utils/canSSRAuth'
import { setupAPIClient } from '@/services/api'
import { api } from '@/services/apiClient'

interface haircutsItem{
  id: string,
  name: string,
  price: number,
  status: boolean
}

interface haircutsProps{
  haircuts: haircutsItem[]
}

const Haircuts = ({haircuts}:haircutsProps) => {
  const [isMobile] = useMediaQuery('(max-width: 600px)');
  const [haircut, setHaircut] = React.useState<haircutsItem[]>(haircuts || []);
  const [disableHaircut, setDisabledHaircut] = React.useState('enabled')

  async function handleDisabled(e:ChangeEvent<HTMLInputElement>){
    if(e.target.value === 'disabled'){
      setDisabledHaircut('enabled')
      const response = await api.get('/haircut', {
        params:{
          status: true,
        }
      })
      setHaircut(response.data)
    } else{
      setDisabledHaircut('disabled')
      const response = await api.get('/haircut', {
        params:{
          status: false,
        }
      })
      setHaircut(response.data)
    }
  }

  return(
    <>
      <Head>
        <title>Modelos de Cortes - BarberPRO</title>
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
              Modelo de Corte
            </Heading>
            <Link href='/haircuts/new'>
              <Button bg='gray.500'>
                Cadastrar novo
              </Button>  
            </Link>
            <Stack ml='auto' align='center' direction='row'>
              <Text fontWeight='bold'>ATIVOS</Text>
              <Switch
                colorScheme='green'
                size='lg'
                value={disableHaircut}
                onChange={(e:ChangeEvent<HTMLInputElement>) => handleDisabled(e)}
                isChecked={disableHaircut === 'disabled' ? false: true}
              />
            </Stack>
          </Flex>
        </Flex>
        {haircut && (
          haircut.map((item)  => {
            return(
              <Link key={item.id} href={`/haircuts/${item.id}`}>
                <Flex cursor='pointer' w='100%' p={4} bg='barber.400' direction='row' rounded='4' mt={6} mb={2} justifyContent='space-between'>
                  <Flex>
                    <IoMdPricetag size={28} color='#fba931'/>
                    <Text ml={6} fontWeight='bold' color='#fff'>
                      {item.name}
                    </Text>
                  </Flex>
                  <Text fontWeight='bold' color='#fff'>
                    R$ {item.price}.00
                  </Text>
                </Flex>
              </Link>
            )
          })
        )}
      </SideBar>
    </>
  )
}

export default Haircuts

export const getServerSideProps = canSSRAuth(async(ctx) =>{
  try{
    const api = setupAPIClient(ctx)
    const response = await api.get('/haircut', {
      params:{
        status: true
      }
    })
    return{
      props:{
        haircuts: response.data
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
