// Mock básico para módulos nativos não disponíveis no ambiente de teste
try { require('react-native-gesture-handler/jestSetup'); } catch (_) {}

jest.mock('react-native-gesture-handler', () => {
  try {
    const Actual = jest.requireActual('react-native-gesture-handler');
    return {
      ...Actual,
      GestureHandlerRootView: ({ children }) => children,
    };
  } catch {
    return { GestureHandlerRootView: ({ children }) => children };
  }
});


// Evitar warnings de useNativeDriver
try { jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({})); } catch (_) {}

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    setItem: jest.fn((k, v) => { store[k] = v; return Promise.resolve(); }),
    getItem: jest.fn(k => Promise.resolve(store[k] ?? null)),
    removeItem: jest.fn(k => { delete store[k]; return Promise.resolve(); }),
    clear: jest.fn(() => { store = {}; return Promise.resolve(); }),
    getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
  };
});

// Mock SplashScreen
jest.mock('react-native-splash-screen', () => ({ hide: jest.fn(), show: jest.fn() }));

// Mock Toast para evitar dependências internas
jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: () => null,
  show: jest.fn(),
  hide: jest.fn(),
}));

// Mock react-native-permissions para evitar import ESM e nativo no Jest
jest.mock('react-native-permissions', () => ({
  __esModule: true,
  openSettings: jest.fn(() => Promise.resolve()),
  check: jest.fn(() => Promise.resolve('granted')),
  request: jest.fn(() => Promise.resolve('granted')),
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
    BLOCKED: 'blocked',
    UNAVAILABLE: 'unavailable',
    LIMITED: 'limited',
  },
  PERMISSIONS: {},
}));

// Removidos mocks de libs legadas de scanner (migrado para react-native-vision-camera)

// Mock da Vision Camera para ambiente de teste (sem módulo nativo)
jest.mock('react-native-vision-camera', () => {
  const React = require('react');
  return {
    __esModule: true,
    Camera: () => React.createElement('View', null),
    useCameraDevice: () => ({ id: 'back', position: 'back' }),
    useCodeScanner: () => ({
      isActive: false,
      codes: [],
    }),
  };
});

// Suprimir warning específico de SafeAreaView depreciado
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = args[0];
  if (typeof msg === 'string' && msg.includes('SafeAreaView has been deprecated')) {
    return; // ignora só este aviso
  }
  originalWarn(...args);
};
