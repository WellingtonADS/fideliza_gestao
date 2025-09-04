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
    FlatList
}
from 'react-native';
import {
    useFocusEffect
}
from '@react-navigation/native';
import * as api from '../services/api';
import {
    PointTransaction
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
    itemContainer: {
        backgroundColor: '#1E1E3F',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF'
    },
    itemSubtitle: {
        fontSize: 14,
        color: '#B0B0B0',
        marginTop: 4
    },
    pointsTag: {
        color: '#28a745',
        fontWeight: 'bold',
        fontSize: 16
    },
    pointsTagNegative: {
        color: '#dc3545'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    },
    emptyText: {
        color: '#B0B0B0',
        fontSize: 16
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

const TransactionsScreen = () => {
    const [transactions, setTransactions] = useState < PointTransaction[] > ([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const transRes = await api.getTransactions();
            setTransactions(transRes.data);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível carregar as transações.'
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
            <View style={styles.header}>
                <Icon name="swap-horiz" size={30} color="#FFFFFF" />
                <Text style={styles.title}>Transações</Text>
            </View>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.container}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <View>
                            <Text style={styles.itemName}>
                                Cliente: {item.client.name}
                            </Text>
                            <Text style={styles.itemSubtitle}>
                                Por: {item.awarded_by.name} em {new Date(item.created_at).toLocaleDateString('pt-BR')}
                            </Text>
                        </View>
                        <Text style={[styles.pointsTag, item.points < 0 ? styles.pointsTagNegative : {}]}>
                            {item.points > 0 ? `+${item.points}` : item.points} pt
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhuma transação registada.</Text>
                        </View>
                    )
                }
            />
        </SafeAreaView>
    );
};

export default TransactionsScreen;
