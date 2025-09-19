// src/screens/ManageRewardsScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as api from '../services/api';
import { Reward } from '../types/gestao';
import Toast from 'react-native-toast-message';
import StyledTextInput from '../components/StyledTextInput';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ManageRewardsScreen = () => {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [newRewardName, setNewRewardName] = useState('');
    const [newRewardDescription, setNewRewardDescription] = useState('');
    const [newRewardPoints, setNewRewardPoints] = useState('');
    const [isAddingReward, setIsAddingReward] = useState(false);
    const [editingReward, setEditingReward] = useState<Reward | null>(null);
    const [updatedRewardName, setUpdatedRewardName] = useState('');
    const [updatedRewardDescription, setUpdatedRewardDescription] = useState('');
    const [updatedRewardPoints, setUpdatedRewardPoints] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const rewardRes = await api.getRewards();
            setRewards(rewardRes.data);
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível carregar os prémios.' });
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const handleAddReward = async () => {
        if (!newRewardName || !newRewardPoints) {
            Toast.show({ type: 'info', text1: 'Atenção', text2: 'Nome e Pontos são obrigatórios.' });
            return;
        }
        setIsAddingReward(true);
        try {
            await api.addReward({
                name: newRewardName,
                description: newRewardDescription,
                points_required: parseInt(newRewardPoints, 10)
            });
            Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Prémio adicionado.' });
            setNewRewardName('');
            setNewRewardDescription('');
            setNewRewardPoints('');
            fetchData();
        } catch (error: any) {
            const detail = error.response?.data?.detail || "Erro ao adicionar prémio.";
            Toast.show({ type: 'error', text1: 'Erro', text2: detail });
        } finally {
            setIsAddingReward(false);
        }
    };

    const handleDeleteReward = (reward: Reward) => {
        Alert.alert("Confirmar Exclusão", `Deseja excluir o prémio "${reward.name}"?`,
            [{ text: "Cancelar", style: "cancel" }, {
                text: "Excluir", style: "destructive", onPress: async () => {
                    try {
                        await api.deleteReward(reward.id);
                        Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Prémio excluído.' });
                        fetchData();
                    } catch (error) {
                        Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível excluir o prémio.' });
                    }
                },
            },]
        );
    };

    const handleUpdateReward = async () => {
        if (!editingReward) return;
        const payload: api.RewardUpdate = {};
        if (updatedRewardName) payload.name = updatedRewardName;
        if (updatedRewardDescription) payload.description = updatedRewardDescription;
        if (updatedRewardPoints) payload.points_required = parseInt(updatedRewardPoints, 10);

        if (Object.keys(payload).length === 0) {
            setEditingReward(null);
            return;
        }

        try {
            await api.updateReward(editingReward.id, payload);
            Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Prémio atualizado.' });
            fetchData();
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível atualizar o prémio.' });
        } finally {
            setEditingReward(null);
        }
    };

    if (isLoading) {
      return <View style={styles.loaderContainer}><ActivityIndicator size="large" color="#FFFFFF" /></View>;
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Icon name="card-giftcard" size={30} color="#000" />
                <Text style={styles.title}>Gerir Prêmios</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Prémios</Text>
                {rewards.map(reward => (
                    <View key={reward.id} style={styles.itemContainer}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemName}>{reward.name} ({reward.points_required} pts)</Text>
                            <Text style={styles.itemSubtitle}>{reward.description}</Text>
                        </View>
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity onPress={() => { setEditingReward(reward); setUpdatedRewardName(reward.name); setUpdatedRewardDescription(reward.description || ''); setUpdatedRewardPoints(reward.points_required.toString()); }} style={styles.actionButton}>
                                <Text style={styles.actionButtonText}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteReward(reward)} style={styles.actionButton}>
                                <Text style={styles.actionButtonText}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Adicionar Novo Prémio</Text>
                <StyledTextInput label="Nome do Prémio" value={newRewardName} onChangeText={setNewRewardName} placeholder="Ex: Café Grátis" />
                <StyledTextInput label="Descrição (opcional)" value={newRewardDescription} onChangeText={setNewRewardDescription} placeholder="Detalhes do prémio" />
                <StyledTextInput label="Pontos Necessários" value={newRewardPoints} onChangeText={setNewRewardPoints} keyboardType="number-pad" placeholder="Ex: 10" />
                <TouchableOpacity onPress={handleAddReward} disabled={isAddingReward} style={styles.button}>
                    {isAddingReward ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Adicionar Prémio</Text>}
                </TouchableOpacity>
            </View>

            <Modal visible={!!editingReward} transparent={true} animationType="slide" onRequestClose={() => setEditingReward(null)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Editar Prémio</Text>
                        <StyledTextInput label="Nome do Prémio" value={updatedRewardName} onChangeText={setUpdatedRewardName} placeholder="Ex: Café Grátis" />
                        <StyledTextInput label="Descrição" value={updatedRewardDescription} onChangeText={setUpdatedRewardDescription} placeholder="Detalhes do prémio" />
                        <StyledTextInput label="Pontos" value={updatedRewardPoints} onChangeText={setUpdatedRewardPoints} keyboardType="number-pad" placeholder="Ex: 10" />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={[styles.button, styles.modalButton, { backgroundColor: '#4A4A6A' }]} onPress={() => setEditingReward(null)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.modalButton]} onPress={handleUpdateReward}>
                                <Text style={styles.buttonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#4A4A6A' },
    itemName: { fontSize: 16, fontWeight: '500', color: '#FFFFFF' },
    itemSubtitle: { fontSize: 14, color: '#B0B0B0', marginTop: 4 },
    actionsContainer: { flexDirection: 'row' },
    actionButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginLeft: 8, backgroundColor: '#4A4A6A' },
    actionButtonText: { fontWeight: '500', color: '#FFFFFF' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
    modalView: { width: '90%', backgroundColor: '#1E1E3F', borderRadius: 20, padding: 24 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#FFFFFF', textAlign: 'center' },
    modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 10 },
    modalButton: { flex: 1 },
});

export default ManageRewardsScreen;