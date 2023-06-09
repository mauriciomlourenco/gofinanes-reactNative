import React, { useCallback, useState } from 'react';
import { ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import {
    Header,
    ResumeContainer,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer,
} from './styles';

import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';


interface TransactionDataProps {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

type TotalCategoryProps = {
    key: string;
    name: string;
    totalFormatted: string;
    total: number;
    color: string;
    percent: string;
}

export function Resume() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<TotalCategoryProps[]>([]);

    const theme = useTheme();

    const { user } = useAuth();

    function handleDateChange(action: 'next' | 'prev'): void {
        if (action === 'next') {
            setSelectedDate(addMonths(selectedDate, 1));
        } else {
            setSelectedDate(subMonths(selectedDate, 1));
        }
    }

    async function loadData() {
        setIsLoading(true);
        try{
            const datakey = `@gofinances:transactions_user:${user.id}`;

            const response = await AsyncStorage.getItem(datakey);
            
            if(response){
            const responseFormatted = response ? JSON.parse(response) : [];

            const outlay = responseFormatted
                .filter((item: TransactionDataProps) =>
                (item.type === 'negative' &&
                    new Date(item.date).getMonth() === selectedDate.getMonth() &&
                    new Date(item.date).getFullYear() === selectedDate.getFullYear())
                );

            const outlayTotal = outlay.reduce((acumulator: number, item: TransactionDataProps) => acumulator + Number(item.amount), 0);

            const totalByCategory: TotalCategoryProps[] = [];

            categories.forEach(category => {
                let categorySum = 0;

                outlay.forEach((item: TransactionDataProps) => {
                    if (item.category === category.key) {
                        categorySum += Number(item.amount);
                    }
                });

                if (categorySum > 0) {

                    const totalFormatted = categorySum.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });
                    const percent = `${(categorySum / outlayTotal * 100).toFixed(0)}%`;
                    totalByCategory.push({
                        key: category.key,
                        name: category.name,
                        color: category.color,
                        totalFormatted,
                        total: categorySum,
                        percent,
                    });
                }
            });

            setTotalByCategories(totalByCategory);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
        }catch(err){
            setIsLoading(false);
        }
    };



    useFocusEffect(useCallback(() => {
        loadData();
    }, [selectedDate]));

    return (
        <ResumeContainer>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            {
                isLoading ?
                    (<LoadContainer>
                        <ActivityIndicator
                            color={theme.colors.primary}
                            size="large"
                        />
                    </LoadContainer>) :

                    <Content
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: useBottomTabBarHeight(),
                        }}
                    >
                        <ChartContainer>

                            <MonthSelect>
                                <MonthSelectButton
                                    onPress={() => handleDateChange('prev')}
                                >
                                    <MonthSelectIcon name="chevron-left" />
                                </MonthSelectButton>

                                <Month>
                                    {format(selectedDate, 'MMMM, yyyy', {
                                        locale: ptBR
                                    })}
                                </Month>

                                <MonthSelectButton
                                    onPress={() => handleDateChange('next')}
                                >
                                    <MonthSelectIcon name="chevron-right" />
                                </MonthSelectButton>
                            </MonthSelect>

                            <VictoryPie
                                data={totalByCategories}
                                colorScale={totalByCategories.map(category => category.color)}
                                style={{
                                    labels: {
                                        fontSize: RFValue(18),
                                        fontWeight: 'bold',
                                        fill: theme.colors.shape
                                    }
                                }}
                                labelRadius={50}
                                x="percent"
                                y="total"

                            />
                        </ChartContainer>
                        {totalByCategories.map(item => (
                            <HistoryCard
                                key={item.key}
                                title={item.name}
                                amount={item.totalFormatted}
                                color={item.color}
                            />
                        ))
                        }
                    </Content>

            }


        </ResumeContainer>
    );
}