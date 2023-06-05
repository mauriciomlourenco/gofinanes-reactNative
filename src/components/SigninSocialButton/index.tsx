import React from "react";
import {GestureHandlerRootView, RectButtonProps } from "react-native-gesture-handler";

import { 
    ButtonContainer,
    ImageContainer,
    Title, 
} from "./styles";
import { SvgProps } from "react-native-svg";

interface SigninSocialButtonProps extends RectButtonProps{
    title: string,
    svg: React.FC<SvgProps>,
    onPress: () => void;
}

export function SigninSocialButton({ 
    svg: Svg,
    title,
    onPress,    
    ...rest
}: SigninSocialButtonProps){
    
    return(
        <GestureHandlerRootView>
            <ButtonContainer
                onPress={onPress}
                {...rest}
            >
                <ImageContainer>
                    <Svg />
                </ImageContainer>
                <Title>{title}</Title>
            </ButtonContainer>
        </GestureHandlerRootView>
    )
}