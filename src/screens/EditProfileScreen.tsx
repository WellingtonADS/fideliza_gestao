import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import Toast from 'react-native-toast-message';
import StyledTextInput from '../components/StyledTextInput';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditProfileScreen = () => {
    const { user, refreshUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleUpdate = async () => {
        if (password && password !== confirmPassword) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'As senhas não coincidem.' });
            return;
        }

        setIsSaving(true);
        try {
            const payload: { name?: string; password?: string } = {};
            if (name !== user?.name) {
                payload.name = name;
            }
            if (password) {
                payload.password = password;
            }

            if (Object.keys(payload).length === 0) {
                 Toast.show({ type: 'info', text1: 'Informação', text2: 'Nenhuma alteração foi feita.' });
                 return;
            }

            await api.updateMyProfile(payload); // Função nova na API
            await refreshUser(); // Atualiza o contexto global
            Toast.show({ type: 'success', text1: 'Sucesso', text2: 'O seu perfil foi atualizado.' });

        } catch (error) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível atualizar o seu perfil.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Icon name="person" size={30} color="#000" />
                    <Text style={styles.title}>Editar Perfil</Text>
                </View>
                <View style={styles.card}>
                    <StyledTextInput
                        label="Nome Completo"
                        value={name}
                        onChangeText={setName}
                        placeholder="O seu nome de exibição"
                    />
                     <Text style={styles.infoText}>Deixe os campos de senha em branco se não quiser alterá-la.</Text>
                    <StyledTextInput
                        label="Nova Senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholder="Digite a nova senha"
                    />
                    <StyledTextInput
                        label="Confirmar Nova Senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholder="Digite a nova senha novamente"
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
        fontSize: 16,
        color: '#FDD835',
        fontWeight: 'bold',
    },
    safeArea: { flex: 1, backgroundColor: '#0A0A2A' },
    container: { padding: 20, flexGrow: 1, justifyContent: 'center' },
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
    card: { backgroundColor: '#1E1E3F', borderRadius: 12, padding: 20 },
    cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 20, textAlign: 'center' },
    infoText: { color: '#B0B0B0', fontSize: 14, textAlign: 'center', marginBottom: 20, marginTop: 10 },
    button: { backgroundColor: '#3D5CFF', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default EditProfileScreen;
