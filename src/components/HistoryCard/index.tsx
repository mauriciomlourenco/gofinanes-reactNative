import React from "react";
import { 
    HistoryCardContainer,
    Title,
    Amount,
} from "./styles";

interface HistoryCardProps {
    color: string;
    title: string;
    amount: string;
}

export function HistoryCard({ color, title, amount}: HistoryCardProps){
    return(
        <HistoryCardContainer color={color}>
            <Title>{title}</Title>
            <Amount>{amount}</Amount>
        </HistoryCardContainer>
    )
}