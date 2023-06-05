import React from "react";
import { Icon, LogoutButtonContainer } from "./styles";
import { GestureHandlerRootView, RectButtonProps } from "react-native-gesture-handler";

interface LogoutButtonProps extends RectButtonProps{
    name: string;
    onPress: () => void;
}

export function LogoutButton({ name, onPress, ...rest }: LogoutButtonProps){
    return(
        <GestureHandlerRootView>
            <LogoutButtonContainer onPress={onPress} {...rest}>
                <Icon name={name}/>
            </LogoutButtonContainer>
        </GestureHandlerRootView>
    )
}