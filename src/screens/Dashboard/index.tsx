import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { format } from "date-fns";
import ptBR from 'date-fns/locale/pt-BR';

import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components";
import { useAuth } from "../../hooks/auth";

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";

import {
    DashboardContainer,
    UserWrapper,
    Header,
    User,
    UserInfo,
    Photo,
    UserGreeting,
    Username,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList,
    LoadContainer
} from "./styles";

import { LogoutButton } from "../../components/LogoutButton";

export interface DataListProps extends TransactionCardProps {
    id: string;
};

interface HighlightProps {
    amount: string;
    lastTransactionDate: string;
};

interface HighlightDataProps {
    entries: HighlightProps,
    spendings: HighlightProps,
    total: HighlightProps,    
};

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightDataProps>({} as HighlightDataProps);

    const theme = useTheme();
    const { signOut, user } = useAuth();

    function getLastTransactionDate(
        collection: DataListProps[], 
        type: 'positive' | 'negative'
        ){

        const collectionFiltered = collection
        .filter((transaction) => transaction.type === type);
        
        if (collectionFiltered.length === 0){
            return 0;
        }

        const dateLastTransactions = Math.max.apply(Math, collectionFiltered
            .map((transaction) => new Date(transaction.date).getTime())
        );

        /*return Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        }).format(new Date(dateLastTransactions));*/

        return format(dateLastTransactions, "dd 'de' LLLL", {
            locale: ptBR
        })

    }

    async function loadTransactions() {
        try{
            setIsLoading(true);
            const datakey = `@gofinances:transactions_user:${user.id}`;
            const response = await AsyncStorage.getItem(datakey);


            const transactions = response ? JSON.parse(response) : [];

            let entriesTotal = 0;
            let spendingsTotal = 0;

            const transactionsFormatted: DataListProps[] = transactions
                .map((item: DataListProps) => {

                    if (item.type === 'positive') {
                        entriesTotal += Number(item.amount);
                    } else {
                        spendingsTotal += Number(item.amount);
                    }

                    const amount = Number(item.amount).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });

                    const date = Intl.DateTimeFormat('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                    }).format(new Date(item.date));

                    return {
                        ...item,
                        amount,
                        category: item.category,
                        date,
                    }
                });

            setTransactions(transactionsFormatted);
            
            const lasTransactionEntries = getLastTransactionDate(transactions, "positive");
            const lasTransactionSpendings = getLastTransactionDate(transactions, "negative");
            const totalInterval = lasTransactionSpendings === 0 ? 'Não há transações' :`01 à ${lasTransactionSpendings}`;
            

            setHighlightData({
                entries: {
                    amount: entriesTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    lastTransactionDate: lasTransactionEntries === 0 ? 'Não há transações' :`Última entrada dia ${lasTransactionEntries}`,  
                },
                spendings: {
                    amount: spendingsTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    lastTransactionDate: lasTransactionSpendings === 0 ? 'Não há transações' : `Última saída dia ${lasTransactionSpendings}`,
                },
                total: {
                    amount: Number(entriesTotal - spendingsTotal).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    lastTransactionDate: totalInterval
                }
                
            });

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));

    return (
        <DashboardContainer>
            {isLoading ?
                (<LoadContainer>
                    <ActivityIndicator
                        color={theme.colors.primary}
                        size="large"
                    />
                </LoadContainer>)
                : (
                    <>
                        <Header>
                            <UserWrapper>
                                <UserInfo>
                                    <Photo
                                        source={{ uri: user.photo }}
                                    />
                                    <User>
                                        <UserGreeting>Olá, </UserGreeting>
                                        <Username>{user.name}</Username>
                                    </User>
                                </UserInfo>
                                
                                <LogoutButton
                                    name="power"
                                    onPress={signOut} 
                                />

                            </UserWrapper>
                        </Header>

                        <HighlightCards>
                            <HighlightCard
                                type="up"
                                title="Entradas"
                                amount={highlightData?.entries?.amount ? highlightData?.entries?.amount: "R$ 0,00"}
                                lastTransaction={highlightData?.entries?.lastTransactionDate}
                            />
                            <HighlightCard
                                type="down"
                                title="Saídas"
                                amount={highlightData?.spendings?.amount ? highlightData?.spendings?.amount : "R$ 0,00"}
                                lastTransaction={highlightData?.spendings?.lastTransactionDate}
                            />
                            <HighlightCard
                                type="total"
                                title="Total"
                                amount={highlightData?.total?.amount ? highlightData?.total?.amount: "R$ 0,00"}
                                lastTransaction={highlightData?.total?.lastTransactionDate}
                            />

                        </HighlightCards>

                        <Transactions>
                            <Title>Listagem</Title>
                            <TransactionsList
                                data={transactions}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => <TransactionCard data={item} />}
                            />

                        </Transactions>
                    </>
                )}

        </DashboardContainer>
    )
}
