import styled from "styled-components/native";
import { RFValue } from 'react-native-responsive-fontsize';

export const InputFormContainer = styled.View`
    width: 100%;    
`;

export const Error = styled.Text`
    font-size: ${RFValue(12)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
    color: ${({ theme }) => theme.colors.attention};

    margin: 7px 0;
`;