import React, { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";

import { useTheme } from "styled-components";

import { ActivityIndicator, Alert, Platform } from "react-native";

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { 
    SigninContainer,
    Header,
    TitleWrapper,
    Title,
    SigninTitle,
    Footer,
    FooterWrapper,
} from "./styles";

import { SigninSocialButton } from "../../components/SigninSocialButton";
import { useAuth } from "../../hooks/auth";

export function SignIn(){
    const [isLoading, setIsLoading] = useState(false);

    const { signinWithApple, signinWithGoogle } = useAuth();

    const theme = useTheme();

    async function handleSigninWithGoogle(){
        try {
            setIsLoading(true);
            return await signinWithGoogle();
        } catch (err) {
            Alert.alert('Entrar', 'Não foi possível conectar-se a sua conta Google')
            console.log(err);
            setIsLoading(false);
        }

    }

    async function handleSigninWithApple(){
        try {
            setIsLoading(true);
            return await signinWithApple();
        } catch (err) {
            Alert.alert('Entrar', 'Não foi possível conectar-se a sua conta Apple')
            console.log(err);
            setIsLoading(false);
        }

    }

    return(
        <SigninContainer>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(120)}
                        height={RFValue(68)}
                     />
                     <Title>
                        Controle suas {'\n'}
                        finanças de forma {'\n'}
                        muito simples
                     </Title>
                </TitleWrapper>

                <SigninTitle>
                    Faça seu login com {'\n'}
                    uma das contas abaixo
                </SigninTitle>               

            </Header>

            <Footer>
                <FooterWrapper>
                    <SigninSocialButton 
                        svg={GoogleSvg} 
                        title="Entrar com Google"
                        onPress={handleSigninWithGoogle}
                    />

                    { Platform.OS === 'ios' &&
                        <SigninSocialButton 
                        svg={AppleSvg} 
                        title="Entrar com Apple"
                        onPress={handleSigninWithApple} 
                    />
                    }
                </FooterWrapper>

                { isLoading && <ActivityIndicator 
                    color={theme.colors.shape}
                    style={{
                        marginTop: 18
                    }}
                />}
            </Footer>         
            
        </SigninContainer>
    );
}