// src/screens/ScannerScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../navigation/AdminNavigator';
import { addPoints } from '../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = NativeStackScreenProps<AdminStackParamList, 'Scanner'>;

const ScannerScreen = ({ navigation }: Props) => {

  const handleSuccess = async (e: { data: string }) => {
    const clientId = e.data;
    if (!clientId) return;

    try {
      const response = await addPoints(clientId);
      navigation.navigate('Dashboard', {
        toast: {
          type: 'success',
          text1: 'Sucesso!',
          text2: `1 ponto foi adicionado ao cliente ${response.data.client.name}.`
        }
      });
    } catch (error: any) {
      const detail = error.response?.data?.detail || "Não foi possível adicionar o ponto.";
      navigation.navigate('Dashboard', {
        toast: {
          type: 'error',
          text1: 'Erro',
          text2: detail
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon name="qr-code-scanner" size={30} color="#000" />
        <Text style={styles.title}>Scanner</Text>
      </View>
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
        reactivate={true}
        reactivateTimeout={2000}
        showMarker={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
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
  },
});

export default ScannerScreen;