import styled, { css } from "styled-components/native";
import { TextInput } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface inputProps {
    error: string
}

export const InputContainer = styled(TextInput)<inputProps>`
    width: 100%;
    padding: ${RFValue(18)}px ${RFValue(16)}px;

    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;

    color: ${({ theme }) => theme.colors.text_dark};
    background-color: ${({ theme }) => theme.colors.shape};    
    border-radius: 5px;

    margin-bottom: 8px;

    ${({ error }) => error && css`
        border: 0.5px solid ${({ theme}) => theme.colors.attention};
    `};
`;