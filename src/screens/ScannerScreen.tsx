import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, Code } from 'react-native-vision-camera';
const { useCodeScanner } = require('vision-camera-code-scanner');
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../navigation/AdminNavigator';
import { addPoints } from '../services/api';

type Props = NativeStackScreenProps<AdminStackParamList, 'Scanner'>;

const ScannerScreen = ({ navigation }: Props) => {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const [isProcessing, setIsProcessing] = useState(false);

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
            navigation.goBack();
        }
    };

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes: Code[]) => {
            if (codes.length > 0 && codes[0].value) {
                handleAddPoints(codes[0].value);
            }
        }
    });

    if (!hasPermission) {
        return <View style={styles.container}><Text style={styles.centerText}>A pedir permissão...</Text></View>;
    }
    if (!device) {
        return <View style={styles.container}><Text style={styles.centerText}>Câmara não encontrada.</Text></View>;
    }

    return (
        <View style={StyleSheet.absoluteFill}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                codeScanner={codeScanner}
            />
            <View style={styles.scannerOverlay}>
                <Text style={styles.scannerText}>Aponte para o QR Code</Text>
                <TouchableOpacity style={styles.scannerButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    centerText: { fontSize: 18, color: '#374151', textAlign: 'center' },
    scannerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between', alignItems: 'center', padding: 48 },
    scannerText: { fontSize: 22, fontWeight: 'bold', color: 'white', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
    scannerButton: { backgroundColor: '#dc2626', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default ScannerScreen;
