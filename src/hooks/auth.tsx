import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import * as AppleAuthentication from 'expo-apple-authentication';

import { ANDROID_CLIENT_ID, IOS_CLIENT_ID, EXPO_CLIENT_ID} from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface AuthContextDataProps {
    user: User;
    signinWithGoogle(): Promise<void>;
    signinWithApple(): Promise<void>;
    signOut(): Promise<void>;
    userStorageLoading: boolean;
}

const AuthContext = createContext({} as AuthContextDataProps);

function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser]= useState<User>({} as User);
    const [userStorageLoading, setUserStorageLoading] = useState(true);

    const [issAuthenticating, setIsAuthenticating] = useState(false);
    const [_, response, googleSignIn] = Google.useAuthRequest({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        expoClientId: EXPO_CLIENT_ID,
        scopes: ['profile', 'email'],
    });

    const userStorageKey = '@gofinances:user';

   async function signinWithGoogle(){
        setIsAuthenticating(true);
        try {
            googleSignIn().then((response) =>{
                if(response.type !== 'success'){
                    console.log("FALHOU!")
                    setIsAuthenticating(false);
                } 
            });
            
        } catch (error) {
            setIsAuthenticating(false);
            throw new Error(error);          
        }
        
    }

    async function signinWithApple(){
        try{
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ]
            });

            if(credential){
                const name = credential.fullName!.givenName!
                const photo = `https://ui-avatars.com/api/?name=${name}&length=1`

                const userLogged = {
                    id: String(credential.user),
                    email: credential.email!,
                    name,
                    photo,
                }

                setUser(userLogged);
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
            }

            
        }catch(error) {
            throw new Error(error);
        }
    }
async function signOut(){
    setUser({} as User);
    await AsyncStorage.removeItem(userStorageKey);
}


    useEffect(() => {
        if(response?.type==='success'){
            if(response?.authentication?.idToken){
                //console.log('TOKEN DE AUTENTICAÇÃO =>', response.authentication.idToken);
                fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${response.authentication.idToken}`)
                .then(response => response.json())
                .then(async (userInfo) => {
                    //console.log("DADOS USUÁRIO: ", userInfo);
                    const userLogged = {
                        id: userInfo.kid,
                        email: userInfo.email,
                        name: userInfo.given_name,
                        photo: userInfo.picture,
                    };

                    setUser(userLogged);
                    await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
                });

            }
        } else {
            //Alert.alert('Entrar', 'Não foi possível conectar-se a sua conta Google')
            setIsAuthenticating(false);
        }
    },[response]);


    useEffect(() => {
        async function loadUserStorageData(){
            const userStoraged = await AsyncStorage.getItem(userStorageKey);

            if(userStoraged) {
                const userLogged = JSON.parse(userStoraged) as User;
                setUser(userLogged);
            }

            setUserStorageLoading(false);
        };

        loadUserStorageData();
    },[]);    

    return(
        <AuthContext.Provider value={{
            user, 
            signinWithApple, 
            signinWithGoogle, 
            signOut,
            userStorageLoading, 
        }}>
          {children}
        </AuthContext.Provider>
    );
}

function useAuth(){
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth}

