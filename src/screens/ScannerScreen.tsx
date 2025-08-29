import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// 1. Importe 'useCodeScanner' diretamente da vision-camera
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner, Code } from 'react-native-vision-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../navigation/AdminNavigator';
import { addPoints } from '../services/api';
import { useIsFocused } from '@react-navigation/native'; // Importe para reativar a câmara

type Props = NativeStackScreenProps<AdminStackParamList, 'Scanner'>;

const ScannerScreen = ({ navigation }: Props) => {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const [isProcessing, setIsProcessing] = useState(false);
    const isFocused = useIsFocused(); // Verifica se o ecrã está em foco

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    const handleAddPoints = async (clientId: string) => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            const response = await addPoints(clientId);
            Alert.alert("Sucesso!", `1 ponto foi adicionado com sucesso ao cliente ${response.data.client.name}.`);
        } catch (error: any) {
            const detail = error.response?.data?.detail || "Não foi possível adicionar o ponto.";
            Alert.alert("Erro", detail);
        } finally {
            // Apenas volte se a operação foi concluída
            navigation.goBack();
        }
    };

    // 2. Configure o useCodeScanner com a nova sintaxe
    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes: Code[]) => {
            // Garante que o processamento só ocorre uma vez
            if (!isProcessing && codes.length > 0 && codes[0].value) {
                handleAddPoints(codes[0].value);
            }
        }
    });

    if (!hasPermission) {
        return <View style={styles.container}><Text style={styles.centerText}>A pedir permissão para a câmara...</Text></View>;
    }
    if (!device) {
        return <View style={styles.container}><Text style={styles.centerText}>Nenhuma câmara encontrada.</Text></View>;
    }

    return (
        <View style={StyleSheet.absoluteFill}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                // Use isFocused para garantir que a câmara só está ativa neste ecrã
                isActive={isFocused}
                codeScanner={codeScanner}
            />
            <View style={styles.scannerOverlay}>
                <View style={styles.scannerBox} />
                <Text style={styles.scannerText}>Aponte para o QR Code</Text>
                <TouchableOpacity style={styles.scannerButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
            {isProcessing && (
                <View style={styles.processingOverlay}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                    <Text style={styles.processingText}>A processar...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    centerText: { fontSize: 18, color: '#FFF', textAlign: 'center' },
    scannerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between', alignItems: 'center', padding: 48 },
    scannerBox: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 12,
        marginTop: '30%'
    },
    scannerText: { fontSize: 22, fontWeight: 'bold', color: 'white', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, position: 'absolute', top: '20%' },
    scannerButton: { backgroundColor: '#dc2626', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    processingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
    processingText: { color: 'white', marginTop: 10, fontSize: 16 }
});

export default ScannerScreen;
