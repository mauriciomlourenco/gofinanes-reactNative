import React from 'react';
import { GestureHandlerRootView, RectButtonProps } from 'react-native-gesture-handler';
import { ButtonContainer, Title } from './styles';

interface ButtonProps extends RectButtonProps {
    title: string;
    onPress: () => void;
}

export function Button({ 
    title,
    onPress, 
    ...rest
}: ButtonProps) {
    return (
        <GestureHandlerRootView>
            <ButtonContainer onPress={onPress} {...rest}>
                <Title>{title}</Title>
            </ButtonContainer>
        </GestureHandlerRootView>
    );
}