import { Feather } from '@expo/vector-icons';
import { RectButton } from "react-native-gesture-handler";
import { RFValue } from 'react-native-responsive-fontsize';
import styled from "styled-components/native";

export const LogoutButtonContainer = styled(RectButton)`
    width: ${RFValue(24)}px;
    height: ${RFValue(24)}px;
`;

export const Icon = styled(Feather)`
    color: ${({ theme }) => theme.colors.secondary};
    font-size: ${RFValue(24)}px;
`;