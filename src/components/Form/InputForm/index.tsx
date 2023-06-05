import React from "react";
import { TextInputProps } from "react-native";
import { Control, Controller } from "react-hook-form";

import { InputFormContainer, Error } from "./styles";
import { Input } from "../Input";

import { FormData } from "../../../screens/Register";

interface InputFormProps extends TextInputProps {
    control: Control<FormData>;
    name: 'name' | 'amount';
    error: string | undefined;
}

export function InputForm({ 
    control, 
    name,
    error,
    ...rest 
}: InputFormProps){
    return(
        <InputFormContainer>
            <Controller
                control={control}
                render={({ field: { onChange, value }}) => (
                    <Input
                        onChangeText={onChange}
                        value={value as string}
                        error={error as string}
                        {...rest} 
                    />
                )}
                name={name}
            />
            {error && <Error>{error}</Error>}
        </InputFormContainer>
    );
}