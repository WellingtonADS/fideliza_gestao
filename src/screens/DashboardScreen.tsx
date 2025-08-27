import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../navigation/AdminNavigator';
import { User } from '../types/auth';
import { Reward, CompanyReport } from '../types/gestao';
import * as api from '../services/api';

type Props = NativeStackScreenProps<AdminStackParamList, 'Dashboard'>;

const DashboardScreen = ({ navigation }: Props) => {
  const { user, signOut } = useAuth();
  const [clientId, setClientId] = useState('');
  const [isAddingPoints, setIsAddingPoints] = useState(false);
  
  // Estados para Colaboradores
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [newCollabName, setNewCollabName] = useState('');
  const [newCollabEmail, setNewCollabEmail] = useState('');
  const [newCollabPassword, setNewCollabPassword] = useState('');
  const [isAddingCollab, setIsAddingCollab] = useState(false);
  const [editingCollab, setEditingCollab] = useState<User | null>(null);
  const [updatedName, setUpdatedName] = useState('');

  // Estados para Prémios
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardDescription, setNewRewardDescription] = useState('');
  const [newRewardPoints, setNewRewardPoints] = useState('');
  const [isAddingReward, setIsAddingReward] = useState(false);

  const [report, setReport] = useState<CompanyReport | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchData = async () => {
    if (user?.user_type !== 'ADMIN') {
      setIsLoadingData(false);
      return;
    };
    try {
      setIsLoadingData(true);
      const [collabRes, rewardRes, reportRes] = await Promise.all([
        api.getCollaborators(),
        api.getRewards(),
        api.getReport(),
      ]);
      setCollaborators(collabRes.data);
      setRewards(rewardRes.data);
      setReport(reportRes.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados do painel.");
    } finally {
      setIsLoadingData(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [user])
  );

  const handleAddPoints = async () => {
    if (!clientId) return Alert.alert("Atenção", "Por favor, insira o ID do cliente.");
    setIsAddingPoints(true);
    try {
      const response = await api.addPoints(clientId);
      Alert.alert("Sucesso!", `1 ponto foi adicionado com sucesso ao cliente ${response.data.client.name}.`);
      setClientId('');
    } catch (error: any) {
      const detail = error.response?.data?.detail || "Não foi possível adicionar o ponto.";
      Alert.alert("Erro", detail);
    } finally {
      setIsAddingPoints(false);
    }
  };

  const handleAddCollaborator = async () => {
    if (!newCollabName || !newCollabEmail || !newCollabPassword) {
      Alert.alert("Atenção", "Preencha todos os campos para adicionar um colaborador.");
      return;
    }
    setIsAddingCollab(true);
    try {
      const response = await api.addCollaborator({ name: newCollabName, email: newCollabEmail, password: newCollabPassword });
      Alert.alert("Sucesso!", `Colaborador "${response.data.name}" adicionado.`);
      setNewCollabName('');
      setNewCollabEmail('');
      setNewCollabPassword('');
      await fetchData();
    } catch (error: any) {
       const detail = error.response?.data?.detail || "Não foi possível adicionar o colaborador.";
       Alert.alert("Erro", detail);
    } finally {
      setIsAddingCollab(false);
    }
  };

  const handleDeleteCollaborator = (collab: User) => {
    Alert.alert("Confirmar Exclusão", `Tem a certeza que deseja excluir "${collab.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.deleteCollaborator(collab.id);
              Alert.alert("Sucesso!", `Colaborador "${collab.name}" excluído.`);
              await fetchData();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o colaborador.");
            }
          },
        },
      ]
    );
  };
  
  const handleUpdateCollaborator = async () => {
    if (!updatedName || !editingCollab || updatedName === editingCollab.name) {
      setEditingCollab(null);
      return;
    }
    try {
      await api.updateCollaborator(editingCollab.id, { name: updatedName });
      Alert.alert("Sucesso!", "Nome do colaborador atualizado.");
      await fetchData();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o colaborador.");
    } finally {
      setEditingCollab(null);
    }
  };

  const handleAddReward = async () => {
    if (!newRewardName || !newRewardPoints) {
      Alert.alert("Atenção", "Nome e Pontos são obrigatórios para criar um prémio.");
      return;
    }
    setIsAddingReward(true);
    try {
      const response = await api.addReward({ 
        name: newRewardName, 
        description: newRewardDescription, 
        points_required: parseInt(newRewardPoints, 10) 
      });
      Alert.alert("Sucesso!", `Prémio "${response.data.name}" adicionado.`);
      setNewRewardName('');
      setNewRewardDescription('');
      setNewRewardPoints('');
      await fetchData();
    } catch (error: any) {
      const detail = error.response?.data?.detail || "Não foi possível adicionar o prémio.";
      Alert.alert("Erro", detail);
    } finally {
      setIsAddingReward(false);
    }
  };

  if (isLoadingData) {
      return <View style={styles.container}><ActivityIndicator size="large" color="#1d4ed8" /></View>;
  }

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.dashboardContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Bem-vindo(a),</Text>
              <Text style={styles.headerName}>{user.name}!</Text>
            </View>
            <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Pontuar Cliente</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Scanner')} style={[styles.button, { marginBottom: 16, backgroundColor: '#16a34a' }]}>
              <Text style={styles.buttonText}>Escanear QR Code</Text>
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Ou insira o ID do Cliente" value={clientId} onChangeText={setClientId} keyboardType="number-pad" />
            <TouchableOpacity onPress={handleAddPoints} disabled={isAddingPoints} style={styles.button}>
              {isAddingPoints ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Adicionar 1 Ponto</Text>}
            </TouchableOpacity>
          </View>

          {user.user_type === 'ADMIN' && (
            <>
              {report && (
                <View style={styles.featureCard}>
                  <Text style={styles.featureTitle}>Relatório da Empresa</Text>
                  <View style={styles.reportRow}><Text style={styles.reportLabel}>Clientes Únicos:</Text><Text style={styles.reportValue}>{report.unique_customers}</Text></View>
                  <View style={styles.reportRow}><Text style={styles.reportLabel}>Pontos Atribuídos:</Text><Text style={styles.reportValue}>{report.total_points_awarded}</Text></View>
                  <View style={styles.reportRow}><Text style={styles.reportLabel}>Prémios Resgatados:</Text><Text style={styles.reportValue}>{report.total_rewards_redeemed}</Text></View>
                </View>
              )}

              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>Gestão de Colaboradores</Text>
                {collaborators.map(collab => (
                  <View key={collab.id} style={styles.itemContainer}>
                    <View>
                      <Text style={styles.itemName}>{collab.name}</Text>
                      <Text style={styles.itemSubtitle}>{collab.email}</Text>
                    </View>
                    <View style={styles.actionsContainer}>
                      <TouchableOpacity onPress={() => { setEditingCollab(collab); setUpdatedName(collab.name); }} style={[styles.actionButton, styles.editButton]}>
                        <Text style={styles.actionButtonText}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteCollaborator(collab)} style={[styles.actionButton, styles.deleteButton]}>
                        <Text style={styles.actionButtonText}>Excluir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <View style={styles.divider} />
                <Text style={styles.featureSubtitle}>Adicionar Novo Colaborador</Text>
                <TextInput style={styles.input} placeholder="Nome do Colaborador" value={newCollabName} onChangeText={setNewCollabName} />
                <TextInput style={styles.input} placeholder="Email" value={newCollabEmail} onChangeText={setNewCollabEmail} keyboardType="email-address" autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Senha Provisória" value={newCollabPassword} onChangeText={setNewCollabPassword} secureTextEntry />
                <TouchableOpacity onPress={handleAddCollaborator} disabled={isAddingCollab} style={styles.button}>
                  {isAddingCollab ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Adicionar</Text>}
                </TouchableOpacity>
              </View>

              {/* NOVA SECÇÃO: GESTÃO DE PRÉMIOS */}
              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>Gestão de Prémios</Text>
                {rewards.map(reward => (
                  <View key={reward.id} style={styles.itemContainer}>
                    <View>
                      <Text style={styles.itemName}>{reward.name}</Text>
                      <Text style={styles.itemSubtitle}>{reward.description}</Text>
                    </View>
                    <Text style={styles.pointsTag}>{reward.points_required} pts</Text>
                  </View>
                ))}
                <View style={styles.divider} />
                <Text style={styles.featureSubtitle}>Adicionar Novo Prémio</Text>
                <TextInput style={styles.input} placeholder="Nome do Prémio" value={newRewardName} onChangeText={setNewRewardName} />
                <TextInput style={styles.input} placeholder="Descrição (opcional)" value={newRewardDescription} onChangeText={setNewRewardDescription} />
                <TextInput style={styles.input} placeholder="Pontos Necessários" value={newRewardPoints} onChangeText={setNewRewardPoints} keyboardType="number-pad" />
                <TouchableOpacity onPress={handleAddReward} disabled={isAddingReward} style={styles.button}>
                  {isAddingReward ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Adicionar Prémio</Text>}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <Modal visible={!!editingCollab} transparent={true} animationType="slide" onRequestClose={() => setEditingCollab(null)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Editar Colaborador</Text>
            <TextInput style={styles.input} value={updatedName} onChangeText={setUpdatedName} placeholder="Novo nome" />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setEditingCollab(null)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleUpdateCollaborator}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f9fafb' },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' },
    dashboardContainer: { padding: 24 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
    headerTitle: { fontSize: 24, color: '#374151' },
    headerName: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
    logoutButton: { backgroundColor: '#fee2e2', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 99 },
    logoutButtonText: { color: '#dc2626', fontWeight: 'bold' },
    featureCard: { marginTop: 24, backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, },
    featureTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 },
    featureSubtitle: { fontSize: 16, color: '#4b5563', marginTop: 16, marginBottom: 8 },
    button: { backgroundColor: '#1d4ed8', padding: 16, borderRadius: 12, alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    input: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#e5e7eb' },
    reportRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    reportLabel: { fontSize: 16, color: '#4b5563' },
    reportValue: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
    itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
    itemName: { fontSize: 16, fontWeight: '500', color: '#1f2937' },
    itemSubtitle: { fontSize: 14, color: '#6b7280' },
    actionsContainer: { flexDirection: 'row' },
    actionButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginLeft: 8 },
    editButton: { backgroundColor: '#dbeafe' },
    deleteButton: { backgroundColor: '#fee2e2' },
    actionButtonText: { fontWeight: '500', color: '#374151' },
    divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 16 },
    pointsTag: { backgroundColor: '#e0e7ff', color: '#3730a3', fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalView: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 24, alignItems: 'center', elevation: 5 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    modalButtonContainer: { flexDirection: 'row', marginTop: 20, width: '100%' },
    modalButton: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center' },
    cancelButton: { backgroundColor: '#9ca3af', marginRight: 10 },
    saveButton: { backgroundColor: '#1d4ed8', marginLeft: 10 },
});

export default DashboardScreen;
