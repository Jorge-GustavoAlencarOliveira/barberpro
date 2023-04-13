import React, {createContext, ReactNode} from 'react'
import {destroyCookie, setCookie, parseCookies} from 'nookies';
import Router from 'next/router';
import { api } from '@/services/apiClient';

interface AuthContextData{
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials:SignInProps) => Promise<void>;
  signUp: (credentials:SignUpProps) => Promise<void>;
  logoutUser: () => Promise<void>;
}

interface UserProps {
  id: string,
  name: string,
  email: string,
  endereco: string | null,
  subscriptions?: SubscriptionProps | null
}

interface SubscriptionProps {
  id: string,
  status: string
}

type AuthProviderProps = {
  children: ReactNode;
}

interface SignInProps {
  email: string,
  password: string
}

interface SignUpProps{
  name: string,
  email: string,
  password: string
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut () {
  try{
    destroyCookie(null, '@barber.token', {path: '/'})
    Router.push('/login')
  }catch (err){
    console.log('Erro ao sair', err);
  }
}

export function AuthProvider({children}:AuthProviderProps){
  const [user, setUser] = React.useState<UserProps>();
  const isAuthenticated = !!user;

  React.useEffect(() =>{
    const {'@barber.token': token} = parseCookies();
    if(token){
      api.get('/me').then((response) => {
        const {id, name, endereco, email, subscriptions} = response.data;
        setUser({
          id,
          name,
          endereco,
          email,
          subscriptions
        }) 
      }).catch(()=>{
         signOut();
      })
    }
  },[])

  async function signUp ({name, email, password}:SignUpProps){
    try{
      await api.post('/users', {
        name,
        email,
        password,
      });
      Router.push('/login')
    }catch(err){
      console.log("Erro ao criar usuario" + err)
    }
  }

  async function signIn ({email, password}:SignInProps) {
    try{
     const response = await api.post('/session', {
      email,
      password
     })
     const {id, name, endereco, subscriptions, token} = response.data;
     setCookie(null, '@barber.token', token , {
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
     })
     setUser({
      id,
      name,
      endereco,
      subscriptions,
      email,
     })
     ;
     api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
     Router.push('/dashboard');
    }
    catch(err){
      console.log('Error ao entrar', err)
    }
  }

  async function logoutUser(){
    try{
      destroyCookie(null, '@barber.token', {path: '/'})
      setUser(null)
      Router.push('/login')
    }catch (err){
      console.log('Erro ao sair', err)
    }
  }

  return(
    <AuthContext.Provider value={{
      user, 
      isAuthenticated, 
      signIn, 
      signUp, 
      logoutUser
    }}>
      {children}
    </AuthContext.Provider>
  ) 
}