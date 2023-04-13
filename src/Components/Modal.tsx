import React from 'react'
import { ModalOverlay, Modal, Flex ,ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text, Button, ModalContent} from '@chakra-ui/react'
import {FiUser, FiScissors} from 'react-icons/fi'
import {FaMoneyBillAlt} from 'react-icons/fa'
import { schedulesProps } from '@/pages/dashboard'

interface ModalProps{
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  data: schedulesProps,
  finishService: () => Promise<void> 
}

const ModalInfo = ({isOpen, onOpen, onClose, data, finishService}: ModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
       <ModalOverlay/>
       <ModalContent color='#fff' bg='barber.400'>
         <ModalHeader>
          Próximo
         </ModalHeader>
         <ModalCloseButton border='none' color='#fff' />
         <ModalBody>
           <Flex direction='column' mb={3}>
            <Flex align='center' mb={2}>
              <FiUser size={26} color='#ffb13e'/>
              <Text fontSize='2xl' fontWeight='bold' ml={8}>
                {data?.customer}
              </Text>
            </Flex>
            <Flex align='center' mb={2} >
              <FiScissors size={26} color='fff'/>
              <Text fontSize='2xl' fontWeight='bold' ml={8}>
              {data?.haircut.name}
              </Text>
            </Flex>
            <Flex align='center' >
              <FaMoneyBillAlt size={26} color='#46ef75'/>
              <Text fontSize='2xl'  ml={8}>
              R$ {data?.haircut.price},00
              </Text>
            </Flex>
           </Flex>
         </ModalBody>
         <ModalFooter>
           <Button 
            bg='button.cta' 
            _hover={{bg: '#ffb13e'}} 
            color='#fff' mr={3} 
            onClick={() => { finishService();
            onClose()
          }}
          >Finalizar serviço</Button>
         </ModalFooter>
       </ModalContent>
    </Modal>
  )
}

export default ModalInfo
