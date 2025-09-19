import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as api from '../services/api';
import Toast from 'react-native-toast-message';
import StyledTextInput from '../components/StyledTextInput';
import { CompanyDetails } from '../types/company';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

const EditCompanyScreen = () => {
    const navigation = useNavigation();
    const { user, updateUser } = useAuth(); // Substitui setUser por updateUser
    const [company, setCompany] = useState<Partial<CompanyDetails>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await api.getMyCompanyDetails();
            setCompany(response.data);
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível carregar os dados da empresa.' });
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            const { id, userName, ...updateData } = company; // Inclui userName nos dados enviados
            await api.updateMyCompany({ ...updateData, userName }); // Garante que userName seja enviado

            // Atualiza o contexto de autenticação com o novo nome do usuário
            if (userName && user) {
                updateUser({ ...user, name: userName }); // Garante que todas as propriedades obrigatórias sejam mantidas
            }

            Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Dados da empresa atualizados.' });
            fetchData();
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível atualizar os dados.' });
        } finally {
            setIsSaving(false);
        }
    };
    
    const setFieldValue = (field: keyof CompanyDetails, value: string) => {
        setCompany(current => ({...current, [field]: value}));
    }

    if (isLoading) {
        return <View style={styles.loaderContainer}><ActivityIndicator size="large" color="#FFFFFF" /></View>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Icon name="business" size={30} color="#000" />
                    <Text style={styles.title}>Editar Empresa</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.closeButton}>Voltar</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Dados da Empresa</Text>
                    <StyledTextInput
                        label="Nome da Empresa"
                        value={company.name}
                        onChangeText={(text) => setFieldValue('name', text)}
                        placeholder="Nome visível para os clientes"
                    />
                    <StyledTextInput
                        label="Endereço"
                        value={company.address ?? ''}
                        onChangeText={(text) => setFieldValue('address', text)}
                        placeholder="Ex: Rua, Número, Cidade"
                    />
                    <StyledTextInput
                        label="Categoria"
                        value={company.category ?? ''}
                        onChangeText={(text) => setFieldValue('category', text)}
                        placeholder="Ex: Padaria, Barbearia"
                    />
                    <StyledTextInput
                        label="URL do Logótipo"
                        value={company.logo_url ?? ''}
                        onChangeText={(text) => setFieldValue('logo_url', text)}
                        placeholder="https://exemplo.com/logo.png"
                    />
                    <StyledTextInput
                        label="Nome do Usuário"
                        value={company.userName ?? ''} // Remove o valor padrão fixo
                        onChangeText={(text) => setFieldValue('userName', text)}
                        placeholder="Ex: Sr. Padeiro"
                    />
                    <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={isSaving}>
                        {isSaving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Salvar Alterações</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    closeButton: {
        marginLeft: 'auto',
        color: '#3D5CFF',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 8,
    },
    safeArea: { flex: 1, backgroundColor: '#0A0A2A' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A2A' },
    container: { padding: 20 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#FFFFFF',
    },
    card: { backgroundColor: '#1E1E3F', borderRadius: 12, padding: 20, marginBottom: 20 },
    cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 16 },
    button: { backgroundColor: '#3D5CFF', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default EditCompanyScreen;

