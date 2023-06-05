import React from "react";
import { TouchableOpacityProps } from "react-native";
import { 
    CategorySelectContainer,
    Category,
    Icon, 
} from "./styles";
import { GestureHandlerRootView, RectButtonProps } from "react-native-gesture-handler";

interface CategorySelectProps extends RectButtonProps{
    title: string;
    onPress: () => void;
}

export function CategorySelectButton({ 
    title, 
    onPress,
    ...rest 
}: CategorySelectProps) {
    return(
        <GestureHandlerRootView>
            <CategorySelectContainer onPress={onPress} {...rest}>
                <Category>{title}</Category>
                <Icon name="chevron-down"/>
            </CategorySelectContainer>
        </GestureHandlerRootView>
    );
}