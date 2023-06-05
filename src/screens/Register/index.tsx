import React, { useState } from 'react';
import { 
    Keyboard, 
    Modal, 
    TouchableWithoutFeedback,
    Alert, 
} from 'react-native';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import uuid from 'react-native-uuid';

import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { InputForm } from '../../components/Form/InputForm'; 
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';

import { CategorySelect } from '../CategorySelect';

import { 
    RegisterContainer,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes,
} from './styles';


export interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'A descrição deve ter no mínimo 2 caracteres'),
    amount: Yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório')
});

type NavigationProps = {
    navigate: (screen: string) => void;
}

export function Register(){
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const { user } = useAuth();
    
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const navigation = useNavigation<NavigationProps>();

    const { 
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    function handleTransactionTypeSelect (type: 'positive' | 'negative') {
        setTransactionType(type);
    }
    
    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }
    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
    }

    async function handleRegister(form : any){
        const { name, amount } = form;

        if(!transactionType){
            return Alert.alert('Selecione o tipo da transação');
        }

        if(category.key === 'category'){
            return Alert.alert('Selecione a categoria');
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name,
            amount,
            type: transactionType,
            category: category.key,
            date: new Date(),
        }

        try{  
            const datakey = `@gofinances:transactions_user:${user.id}`;
            
            const data = await AsyncStorage.getItem(datakey);
            const currentData = data ? JSON.parse(data) : [];           
            
            const dataFormatted = [
                ...currentData,
                newTransaction,
            ];

            await AsyncStorage.setItem(datakey, JSON.stringify(dataFormatted));

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria',
            });

            navigation.navigate("Listagem");

        }catch( error) {
            console.log(error);
            Alert.alert("não foi possível salvar");
        }
    }

    /*useEffect(() => {
        ( async () => {
           const data = await AsyncStorage.getItem(datakey);
           console.log(JSON.parse(data!));
        })();

        // async function removeAll(){
        //     await AsyncStorage.removeItem(datakey);
        // }
        // removeAll();
    },[]);*/


    return (
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
        >
            <RegisterContainer>
                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            placeholderTextColor='rgba(0, 0, 0, 0.194)'
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            placeholderTextColor='rgba(0, 0, 0, 0.194)'
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                        />

                        <TransactionTypes>
                            <TransactionTypeButton
                                type='up'
                                title='Income'
                                onPress={() => handleTransactionTypeSelect('positive')}
                                isActive={transactionType === 'positive' }
                            />

                            <TransactionTypeButton
                                type='down'
                                title='Outcome'
                                onPress={() => handleTransactionTypeSelect('negative')}
                                isActive={transactionType === 'negative'}
                            />
                        </TransactionTypes>

                        <CategorySelectButton 
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal} 
                        />

                    </Fields>

                    <Button 
                        title='Enviar'
                        onPress={handleSubmit(handleRegister)} 
                    />
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect 
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>

            </RegisterContainer>
        </TouchableWithoutFeedback>
    );
}