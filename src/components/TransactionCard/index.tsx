import React from 'react';
import { 
    TransactionCardContainer,
    Title,
    Amount,
    Footer,
    Category,
    Icon,
    CategoryName,
    Date,
 } from "./styles";
import { categories } from '../../utils/categories';


 export type TransactionCardProps = {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;

 }

 interface TransactionCard {
    data: TransactionCardProps;
 }

export function TransactionCard({ data }: TransactionCard){
    const {name, amount, category, date, type} = data;
    
    const [ categoryFiltered ] = categories.filter(
        item => item.key === category
    );

    return (
        <TransactionCardContainer>
            <Title>
                {name}
            </Title>

            <Amount type={type}>
                {type === 'negative' && '- '}
                {amount}
            </Amount>

            <Footer>
                <Category>
                    <Icon name={categoryFiltered.icon}/>
                    <CategoryName>
                        {categoryFiltered.name}
                    </CategoryName>
                </Category>
                <Date>
                    {date}
                </Date>
            </Footer>

        </TransactionCardContainer>
    )
}