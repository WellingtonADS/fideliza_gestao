import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../navigation/AdminNavigator';
import { addPoints } from '../services/api';

type Props = NativeStackScreenProps<AdminStackParamList, 'Scanner'>;

const ScannerScreen = ({ navigation }: Props) => {

  const handleSuccess = async (e: { data: string }) => {
    const clientId = e.data;
    if (!clientId) return;

    try {
      const response = await addPoints(clientId);
      // Usamos o Toast para a notificação de sucesso
      navigation.navigate('Dashboard', { 
        toast: { 
          type: 'success', 
          text1: 'Sucesso!', 
          text2: `1 ponto foi adicionado ao cliente ${response.data.client.name}.` 
        } 
      });
    } catch (error: any) {
      const detail = error.response?.data?.detail || "Não foi possível adicionar o ponto.";
      // Usamos o Toast para a notificação de erro
      navigation.navigate('Dashboard', { 
        toast: { 
          type: 'error', 
          text1: 'Erro', 
          text2: detail 
        } 
      });
    }
  };

  const requestCameraPermission = async () => {
    // A biblioteca react-native-permissions pode ser usada aqui para um fluxo mais robusto
    // mas por simplicidade, a própria biblioteca da câmara irá pedir a permissão.
  };

  return (
    <QRCodeScanner
      onRead={handleSuccess}
      flashMode={RNCamera.Constants.FlashMode.off}
      topContent={
        <Text style={styles.centerText}>
          Aponte a câmara para o QR Code do cliente.
        </Text>
      }
      bottomContent={
        <TouchableOpacity style={styles.buttonTouchable} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      }
      cameraStyle={styles.cameraContainer}
      containerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  cameraContainer: {
    height: '100%',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default ScannerScreen;
