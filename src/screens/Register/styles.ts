import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";

export const RegisterContainer = styled.View`
    display: flex;
    height: 100%;
    
    background-color: ${({ theme }) => theme.colors.background};    
`;

export const Header = styled.View`
    background-color: ${({ theme }) => theme.colors.primary};

    width: 100%;
    height: ${RFValue(113)}px;

    align-items: center;
    justify-content: flex-end;
    padding-bottom: ${RFValue(19)}px;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(18)}px;
    color: ${({ theme }) => theme.colors.shape};
    
`;

export const Form = styled.View`
    flex: 1;
    justify-content: space-between;
    width: 100%;

    padding: ${RFValue(24)}px;
`;

export const Fields = styled.View``;

export const TransactionTypes = styled.View`
    flex-direction: row;
    justify-content: space-between;

    margin-top: ${RFValue(8)}px;
    margin-bottom: ${RFValue(16)}px;
`;
