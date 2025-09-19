// src/screens/ScannerScreen.tsx (Vision Camera)
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner, type CameraPermissionStatus } from 'react-native-vision-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../navigation/AdminNavigator';
import { addPoints } from '../services/api';
import { openSettings } from 'react-native-permissions';

type Props = NativeStackScreenProps<AdminStackParamList, 'Scanner'>;

const ScannerScreen = ({ navigation }: Props) => {
  const [permission, setPermission] = useState<CameraPermissionStatus | 'loading'>('loading');
  const processedRef = useRef(false);

  const ensureCameraPermission = useCallback(async () => {
    try {
      const current: CameraPermissionStatus = await Camera.getCameraPermissionStatus();
      if (current === 'granted') {
        setPermission(current);
        return;
      }
      const req: CameraPermissionStatus = await Camera.requestCameraPermission();
      setPermission(req);
    } catch {
      setPermission('denied');
    }
  }, []);

  useEffect(() => {
    ensureCameraPermission();
  }, [ensureCameraPermission]);

  const handleSuccess = async (data: string) => {
    if (processedRef.current) return;
    processedRef.current = true;

    try {
      const response = await addPoints(data);
      setTimeout(() => {
        navigation.navigate('Dashboard', {
          toast: {
            type: 'success',
            text1: 'Sucesso!',
            text2: `1 ponto foi adicionado ao cliente ${response.data.client.name}.`
          }
        });
      }, 120);
    } catch (error: any) {
      const detail = error?.response?.data?.detail || 'Não foi possível adicionar o ponto.';
      setTimeout(() => {
        navigation.navigate('Dashboard', {
          toast: {
            type: 'error',
            text1: 'Erro',
            text2: detail,
          },
        });
      }, 120);
    }
  };

  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      const value = codes?.[0]?.value;
      if (value) handleSuccess(value);
    },
  });

  if (permission === 'loading' || permission === 'not-determined') {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.infoText}>Solicitando permissão da câmera…</Text>
      </View>
    );
  }

  if (permission === 'denied') {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.infoText}>Permissão de câmera bloqueada. Abra as configurações para permitir o acesso.</Text>
        <TouchableOpacity style={styles.buttonTouchable} onPress={() => openSettings()}>
          <Text style={styles.buttonText}>Abrir configurações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonTouchable} onPress={ensureCameraPermission}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonTouchable} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device || permission !== 'granted') {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.infoText}>Nenhuma câmera disponível ou permissão não concedida.</Text>
        <TouchableOpacity style={styles.buttonTouchable} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Aponte a câmara para o QR Code do cliente.</Text>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
        photo={false}
        video={false}
        audio={false}
      />
      <TouchableOpacity style={styles.buttonTouchable} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  infoText: {
    fontSize: 18,
    padding: 12,
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
});

export default ScannerScreen;