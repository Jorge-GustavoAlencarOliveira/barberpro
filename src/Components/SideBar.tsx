import React, {ReactNode} from 'react'
import { Drawer, IconButton, Box, CloseButton, Flex, Icon, DrawerContent, useColorModeValue, Text, useDisclosure, BoxProps, FlexProps } from '@chakra-ui/react' 
import {FiScissors, FiClipboard, FiSettings, FiMenu } from 'react-icons/fi'
import {IconType} from 'react-icons'
import Link from 'next/link';

interface linkProps {
  name: string,
  icon: IconType,
  route: string
}

const linkItems: Array<linkProps> = [
  {name: 'Agenda', icon: FiScissors, route: '/new'},
  {name: 'Cortes', icon: FiClipboard, route: '/haircuts'},
  {name: 'Minha Conta', icon: FiSettings, route: '/profile'}
]

const SideBar = ({children}: {children: ReactNode}) => {
  const {isOpen, onClose, onOpen} = useDisclosure()
  return (
    <Box minH='100vh' bg='barber.900'>
      <SidebarContent
        onClose={() => onClose}
        display={{base: 'none', md:'block'}}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement='left'
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size='full'
        onClose={onClose}
      > 
        <DrawerContent>
          <SidebarContent onClose={() => onClose()}/>
        </DrawerContent>
      </Drawer>
      <MobileNav display={{base: 'flex', md: 'none'}} onOpen={onOpen}/>
      <Box ml={{base: 0, md: 60}} p={4} color='white'>
        {children}
      </Box>
    </Box>
  )
}

export default SideBar

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const SidebarContent = ({onClose, ...rest}: SidebarProps) =>{
  return(
    <Box
      bg='barber.400'
      borderRight='1px'
      borderRightColor='gray.700'
      w={{base: 'full', md: 60}}
      pos='fixed'
      h='full'
      color='white'
      {...rest}
    >
      <Flex h='20' alignItems='center' justifyContent='space-between' mx='8'>
        <Link href='/dashboard'>
          <Flex cursor='pointer' userSelect='none' flexDirection='row'>
            <Text fontSize='2xl' fontFamily='monospace' fontWeight='bold'>Barber</Text>
            <Text fontSize='2xl' fontFamily='monospace' fontWeight='bold' color='button.cta'>PRO</Text>
          </Flex>
        </Link>
        <CloseButton 
          display={{base: 'flex', md: 'none'}} 
          onClick={onClose}
        />
      </Flex>
      {linkItems.map(item =>{
        return(
          <NavItem icon={item.icon} key={item.name} route={item.route}>
            {item.name}
          </NavItem>
        )
      })}
    </Box>
  )
}

interface NavItemProps extends FlexProps{
  icon: IconType;
  children: ReactNode;
  route: string;
}

const NavItem = ({icon, children, route, ...rest}: NavItemProps) =>{
  return(
    <Link href={route} style={{textDecoration: 'none'}}>
      <Flex 
        alignItems='center'
        p='4'
        mx='4'
        borderRadius='lg'
        role='group'
        cursor='pointer'
        _hover={{
          bg:'barber.900',
          color: 'white'
        }}
        {...rest}
      >
        {icon && (
        <Icon 
          mr={4}
          fontSize={16}
          as={icon}
          _groupHover={{
            color: 'white'
          }} 
        />
        )}
        {children}
      </Flex>
    </Link>
  )
}

interface MobileProps extends FlexProps{
  onOpen: () => void
}

const MobileNav = ({onOpen, ...rest}:MobileProps) =>{
  return(
    <Flex
      ml={{base:0, md:60}}
      px={{base:4, md:24}}
      height='20'
      alignItems='center'
      bgColor='barber.700'
      borderBottomWidth='1px'
      borderBottomColor='gray.700'
      justifyContent='flex-start'
      {...rest}
    >
      <IconButton
        variant='outline'
        onClick={onOpen}
        aria-label='open menu'
        icon={<FiMenu color='white'/>}
      />
      <Flex flexDirection='row'>
      <Text ml={8} fontSize='2xl' fontFamily='monospace' fontWeight='bold' color='white'>Barber</Text>
      <Text fontSize='2xl' fontFamily='monospace' fontWeight='bold' color='button.cta'>PRO</Text>
      </Flex>
    </Flex>
  )
}