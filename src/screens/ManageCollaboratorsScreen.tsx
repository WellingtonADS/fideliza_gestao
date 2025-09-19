// src/screens/ManageCollaboratorsScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as api from '../services/api';
import { User } from '../types/auth';
import Toast from 'react-native-toast-message';
import StyledTextInput from '../components/StyledTextInput';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ManageCollaboratorsScreen = () => {
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [newCollabName, setNewCollabName] = useState('');
  const [newCollabEmail, setNewCollabEmail] = useState('');
  const [newCollabPassword, setNewCollabPassword] = useState('');
  const [isAddingCollab, setIsAddingCollab] = useState(false);
  const [editingCollab, setEditingCollab] = useState<User | null>(null);
  const [updatedName, setUpdatedName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const collabRes = await api.getCollaborators();
      setCollaborators(collabRes.data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível carregar os colaboradores.' });
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleAddCollaborator = async () => {
    if (!newCollabName || !newCollabEmail || !newCollabPassword) {
      Toast.show({ type: 'info', text1: 'Atenção', text2: 'Preencha todos os campos.' });
      return;
    }
    setIsAddingCollab(true);
    try {
      await api.addCollaborator({ name: newCollabName, email: newCollabEmail, password: newCollabPassword });
      Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Colaborador adicionado.' });
      setNewCollabName('');
      setNewCollabEmail('');
      setNewCollabPassword('');
      fetchData();
    } catch (error: any) {
      const detail = error.response?.data?.detail || "Erro ao adicionar colaborador.";
      Toast.show({ type: 'error', text1: 'Erro', text2: detail });
    } finally {
      setIsAddingCollab(false);
    }
  };

  const handleDeleteCollaborator = (collab: User) => {
    Alert.alert("Confirmar Exclusão", `Deseja excluir "${collab.name}"?`,
        [{ text: "Cancelar", style: "cancel" }, {
            text: "Excluir", style: "destructive", onPress: async () => {
                try {
                    await api.deleteCollaborator(collab.id);
                    Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Colaborador excluído.' });
                    fetchData();
                } catch (error) {
                    Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível excluir o colaborador.' });
                }
            },
        },]
    );
  };

  const handleUpdateCollaborator = async () => {
    if (!updatedName || !editingCollab) {
      setEditingCollab(null);
      return;
    }
    try {
      await api.updateCollaborator(editingCollab.id, { name: updatedName });
      Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Colaborador atualizado.' });
      fetchData();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível atualizar o colaborador.' });
    } finally {
      setEditingCollab(null);
    }
  };

  if (isLoading) {
    return <View style={styles.loaderContainer}><ActivityIndicator size="large" color="#FFFFFF" /></View>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Icon name="group" size={30} color="#000" />
          <Text style={styles.title}>Gerir Colaboradores</Text>
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Colaboradores</Text>
            {collaborators.map(collab => (
                <View key={collab.id} style={styles.itemContainer}>
                    <View>
                        <Text style={styles.itemName}>{collab.name}</Text>
                        <Text style={styles.itemSubtitle}>{collab.email}</Text>
                    </View>
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity onPress={() => { setEditingCollab(collab); setUpdatedName(collab.name); }} style={styles.actionButton}>
                            <Text style={styles.actionButtonText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteCollaborator(collab)} style={styles.actionButton}>
                            <Text style={styles.actionButtonText}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Adicionar Novo</Text>
            <StyledTextInput label="Nome do Colaborador" value={newCollabName} onChangeText={setNewCollabName} placeholder="Nome completo" />
            <StyledTextInput label="Email" value={newCollabEmail} onChangeText={setNewCollabEmail} keyboardType="email-address" autoCapitalize="none" placeholder="email@exemplo.com" />
            <StyledTextInput label="Senha Provisória" value={newCollabPassword} onChangeText={setNewCollabPassword} secureTextEntry placeholder="Senha forte" />
            <TouchableOpacity onPress={handleAddCollaborator} disabled={isAddingCollab} style={styles.button}>
                {isAddingCollab ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Adicionar</Text>}
            </TouchableOpacity>
        </View>

        <Modal visible={!!editingCollab} transparent={true} animationType="slide" onRequestClose={() => setEditingCollab(null)}>
            <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Editar Colaborador</Text>
                    <StyledTextInput label="Novo Nome" value={updatedName} onChangeText={setUpdatedName} placeholder="Nome completo" />
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity style={[styles.button, styles.modalButton, { backgroundColor: '#4A4A6A' }]} onPress={() => setEditingCollab(null)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.modalButton]} onPress={handleUpdateCollaborator}>
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
});


export default ManageCollaboratorsScreen;