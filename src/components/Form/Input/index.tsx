import React from "react";
import { TextInputProps } from "react-native";
import { InputContainer } from "./styles";

type Props= TextInputProps;

interface InputProps extends TextInputProps {
    error: string;
}

export const Input = ({error, ...rest} :InputProps) => {
    return (
        <InputContainer 
            error={error} 
            {...rest} 
        />
    );
}