import React,
{
    useState,
    useCallback
}
from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    ScrollView
}
from 'react-native';
import {
    useFocusEffect
}
from '@react-navigation/native';
import * as api from '../services/api';
import {
    CompanyReport
}
from '../types/gestao';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0A0A2A'
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0A0A2A'
    },
    container: {
        padding: 20
    },
    card: {
        backgroundColor: '#1E1E3F',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16
    },
    reportRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#4A4A6A'
    },
    reportLabel: {
        fontSize: 16,
        color: '#B0B0B0'
    },
    reportValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    emptyText: {
        color: '#B0B0B0',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 50
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#FFFFFF'
    },
});

const ReportsScreen = () => {
    const [report, setReport] = useState < CompanyReport | null > (null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const reportRes = await api.getReport();
            setReport(reportRes.data);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível carregar o relatório.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Icon name="bar-chart" size={30} color="#FFFFFF" />
                    <Text style={styles.title}>Relatórios</Text>
                </View>
                {report ? (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Relatório da Empresa</Text>
                        <View style={styles.reportRow}>
                            <Text style={styles.reportLabel}>Clientes Únicos:</Text>
                            <Text style={styles.reportValue}>{report.unique_customers}</Text>
                        </View>
                        <View style={styles.reportRow}>
                            <Text style={styles.reportLabel}>Pontos Atribuídos:</Text>
                            <Text style={styles.reportValue}>{report.total_points_awarded}</Text>
                        </View>
                        <View style={styles.reportRow}>
                            <Text style={styles.reportLabel}>Prémios Resgatados:</Text>
                            <Text style={styles.reportValue}>{report.total_rewards_redeemed}</Text>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.emptyText}>Nenhum dado de relatório disponível.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ReportsScreen;
