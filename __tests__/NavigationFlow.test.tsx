import React from 'react';
import ReactTestRenderer, {
  ReactTestRenderer as RTRInstance,
} from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../src/navigation/AppNavigator';
import { AuthContext } from '../src/context/AuthContext';

// Helper para criar árvore com provider mockado
interface MockAuthValue {
  token: string | null;
  user: any | null;
  isLoading: boolean;
  signIn: jest.Mock;
  signOut: jest.Mock;
  refreshUser: jest.Mock;
  updateUser: jest.Mock;
}

function renderWithAuth(value: MockAuthValue): RTRInstance {
  let tree: RTRInstance = {} as any;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <AuthContext.Provider value={value as any}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthContext.Provider>,
    );
  });
  return tree;
}

describe('Navigation flow (auth states)', () => {
  const baseValue: MockAuthValue = {
    token: null,
    user: null,
    isLoading: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
    refreshUser: jest.fn(),
    updateUser: jest.fn(),
  };

  it('renderiza stack de autenticação quando user é null', () => {
    const tree = renderWithAuth(baseValue);
    expect(tree.toJSON()).toMatchInlineSnapshot(`
      <RNCSafeAreaProvider
        onInsetsChange={[Function]}
        style={
          [
            {
              "flex": 1,
            },
            undefined,
          ]
        }
      >
        <RNCSafeAreaProvider
          onInsetsChange={[Function]}
          style={
            [
              {
                "flex": 1,
              },
              {
                "bottom": 0,
                "left": 0,
                "position": "absolute",
                "right": 0,
                "top": 0,
              },
            ]
          }
        />
        <RNSScreenStack
          style={
            {
              "flex": 1,
            }
          }
        >
          <RNSScreen
            activityState={2}
            aria-hidden={false}
            collapsable={false}
            fullScreenSwipeShadowEnabled={true}
            gestureResponseDistance={
              {
                "bottom": -1,
                "end": -1,
                "start": -1,
                "top": -1,
              }
            }
            hasLargeHeader={false}
            nativeBackButtonDismissalEnabled={false}
            onAppear={[Function]}
            onDisappear={[Function]}
            onDismissed={[Function]}
            onGestureCancel={[Function]}
            onHeaderBackButtonClicked={[Function]}
            onHeaderHeightChange={[Function]}
            onNativeDismissCancelled={[Function]}
            onSheetDetentChanged={[Function]}
            onTransitionProgress={[Function]}
            onWillAppear={[Function]}
            onWillDisappear={[Function]}
            replaceAnimation="push"
            screenId="Login-TNe1QH2ZwISFZYNmWfmY6"
            sheetAllowedDetents={
              [
                1,
              ]
            }
            sheetCornerRadius={-1}
            sheetElevation={24}
            sheetExpandsWhenScrolledToEdge={true}
            sheetGrabberVisible={false}
            sheetInitialDetent={0}
            sheetInitialDetentIndex={0}
            sheetLargestUndimmedDetent={-1}
            sheetLargestUndimmedDetentIndex={-1}
            stackPresentation="push"
            style={
              {
                "bottom": 0,
                "left": 0,
                "position": "absolute",
                "right": 0,
                "top": 0,
                "zIndex": undefined,
              }
            }
            swipeDirection="horizontal"
          >
            <RNSScreenContentWrapper
              collapsable={false}
              style={
                [
                  {
                    "flex": 1,
                  },
                  [
                    {
                      "backgroundColor": "rgb(242, 242, 242)",
                    },
                    undefined,
                  ],
                ]
              }
            >
              <RCTSafeAreaView
                style={
                  {
                    "backgroundColor": "#0A0A2A",
                    "flex": 1,
                  }
                }
              >
                <View
                  style={
                    {
                      "alignItems": "center",
                      "flexDirection": "row",
                      "marginBottom": 20,
                    }
                  }
                >
                  <Text
                    allowFontScaling={false}
                    selectable={false}
                    style={
                      [
                        {
                          "color": "#000",
                          "fontSize": 30,
                        },
                        undefined,
                        {
                          "fontFamily": "Material Icons",
                          "fontStyle": "normal",
                          "fontWeight": "normal",
                        },
                        {},
                      ]
                    }
                  >
                    
                  </Text>
                  <Text
                    style={
                      {
                        "fontSize": 24,
                        "fontWeight": "bold",
                        "marginLeft": 10,
                      }
                    }
                  >
                    Login
                  </Text>
                </View>
                <View
                  style={
                    {
                      "alignItems": "center",
                      "flex": 1,
                      "justifyContent": "center",
                      "padding": 30,
                    }
                  }
                >
                  <View
                    style={
                      {
                        "alignItems": "center",
                        "marginBottom": 20,
                      }
                    }
                  >
                    <Image
                      source={
                        {
                          "testUri": "../../../src/assets/images/logo_fideliza.png",
                        }
                      }
                      style={
                        {
                          "height": 140,
                          "resizeMode": "contain",
                          "width": 400,
                        }
                      }
                    />
                  </View>
                  <Text
                    style={
                      {
                        "color": "#ffffffff",
                        "fontSize": 24,
                        "fontWeight": "bold",
                        "marginBottom": 40,
                      }
                    }
                  >
                    Fideliza+ Empresas
                  </Text>
                  <View
                    style={
                      {
                        "marginBottom": 20,
                        "width": "100%",
                      }
                    }
                  >
                    <Text
                      style={
                        {
                          "color": "#FFFFFF",
                          "fontSize": 16,
                          "fontWeight": "500",
                          "marginBottom": 8,
                        }
                      }
                    >
                      Email
                    </Text>
                    <TextInput
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onChangeText={[Function]}
                      placeholder="Digite o seu e-mail"
                      placeholderTextColor="#8A8A8A"
                      style={
                        {
                          "backgroundColor": "transparent",
                          "borderColor": "#FFFFFF",
                          "borderRadius": 12,
                          "borderWidth": 1,
                          "color": "#FFFFFF",
                          "fontSize": 16,
                          "paddingHorizontal": 15,
                          "paddingVertical": 12,
                          "width": "100%",
                        }
                      }
                      value=""
                    />
                  </View>
                  <View
                    style={
                      {
                        "marginBottom": 20,
                        "width": "100%",
                      }
                    }
                  >
                    <Text
                      style={
                        {
                          "color": "#FFFFFF",
                          "fontSize": 16,
                          "fontWeight": "500",
                          "marginBottom": 8,
                        }
                      }
                    >
                      Senha
                    </Text>
                    <TextInput
                      onChangeText={[Function]}
                      placeholder="Digite a sua senha"
                      placeholderTextColor="#8A8A8A"
                      secureTextEntry={true}
                      style={
                        {
                          "backgroundColor": "transparent",
                          "borderColor": "#FFFFFF",
                          "borderRadius": 12,
                          "borderWidth": 1,
                          "color": "#FFFFFF",
                          "fontSize": 16,
                          "paddingHorizontal": 15,
                          "paddingVertical": 12,
                          "width": "100%",
                        }
                      }
                      value=""
                    />
                  </View>
                  <View
                    accessibilityState={
                      {
                        "busy": undefined,
                        "checked": undefined,
                        "disabled": false,
                        "expanded": undefined,
                        "selected": undefined,
                      }
                    }
                    accessibilityValue={
                      {
                        "max": undefined,
                        "min": undefined,
                        "now": undefined,
                        "text": undefined,
                      }
                    }
                    accessible={true}
                    collapsable={false}
                    focusable={true}
                    onClick={[Function]}
                    onResponderGrant={[Function]}
                    onResponderMove={[Function]}
                    onResponderRelease={[Function]}
                    onResponderTerminate={[Function]}
                    onResponderTerminationRequest={[Function]}
                    onStartShouldSetResponder={[Function]}
                    style={
                      {
                        "alignItems": "center",
                        "backgroundColor": "#3D5CFF",
                        "borderRadius": 12,
                        "marginTop": 10,
                        "opacity": 1,
                        "padding": 15,
                        "width": "100%",
                      }
                    }
                  >
                    <Text
                      style={
                        {
                          "color": "#FFFFFF",
                          "fontSize": 18,
                          "fontWeight": "bold",
                        }
                      }
                    >
                      Entrar
                    </Text>
                  </View>
                  <View
                    accessibilityState={
                      {
                        "busy": undefined,
                        "checked": undefined,
                        "disabled": undefined,
                        "expanded": undefined,
                        "selected": undefined,
                      }
                    }
                    accessibilityValue={
                      {
                        "max": undefined,
                        "min": undefined,
                        "now": undefined,
                        "text": undefined,
                      }
                    }
                    accessible={true}
                    collapsable={false}
                    focusable={true}
                    onClick={[Function]}
                    onResponderGrant={[Function]}
                    onResponderMove={[Function]}
                    onResponderRelease={[Function]}
                    onResponderTerminate={[Function]}
                    onResponderTerminationRequest={[Function]}
                    onStartShouldSetResponder={[Function]}
                    style={
                      {
                        "opacity": 1,
                      }
                    }
                  >
                    <Text
                      style={
                        {
                          "color": "#B0B0B0",
                          "fontSize": 14,
                          "marginTop": 30,
                        }
                      }
                    >
                      Esqueceu a senha? 
                      <Text
                        style={
                          {
                            "color": "#FDD835",
                            "fontWeight": "bold",
                          }
                        }
                      >
                        Clique aqui.
                      </Text>
                    </Text>
                  </View>
                </View>
              </RCTSafeAreaView>
            </RNSScreenContentWrapper>
            <RNSScreenStackHeaderConfig
              backButtonInCustomView={false}
              backTitleFontFamily="System"
              backTitleVisible={true}
              backgroundColor="rgb(255, 255, 255)"
              color="rgb(0, 122, 255)"
              direction="ltr"
              disableBackButtonMenu={false}
              hidden={true}
              hideBackButton={false}
              largeTitleFontFamily="System"
              largeTitleFontWeight="700"
              largeTitleHideShadow={false}
              pointerEvents="box-none"
              style={
                {
                  "alignItems": "center",
                  "flexDirection": "row",
                  "justifyContent": "space-between",
                  "position": "absolute",
                  "width": "100%",
                }
              }
              title="Login"
              titleColor="rgb(28, 28, 30)"
              titleFontFamily="System"
              titleFontWeight="600"
              topInsetEnabled={true}
              translucent={false}
            />
          </RNSScreen>
        </RNSScreenStack>
      </RNCSafeAreaProvider>
    `);
  });

  it('renderiza navegação principal quando user existe', () => {
    const tree = renderWithAuth({
      ...baseValue,
      token: 'token123',
      user: { id: 1, name: 'Admin', user_type: 'ADMIN' },
    });
    expect(tree.toJSON()).toMatchInlineSnapshot(`
      <RNCSafeAreaProvider
        onInsetsChange={[Function]}
        style={
          [
            {
              "flex": 1,
            },
            undefined,
          ]
        }
      >
        <RNCSafeAreaProvider
          onInsetsChange={[Function]}
          style={
            [
              {
                "flex": 1,
              },
              {
                "bottom": 0,
                "left": 0,
                "position": "absolute",
                "right": 0,
                "top": 0,
              },
            ]
          }
        />
        <RNSScreenStack
          style={
            {
              "flex": 1,
            }
          }
        >
          <RNSScreen
            activityState={2}
            aria-hidden={false}
            collapsable={false}
            fullScreenSwipeShadowEnabled={true}
            gestureResponseDistance={
              {
                "bottom": -1,
                "end": -1,
                "start": -1,
                "top": -1,
              }
            }
            hasLargeHeader={false}
            nativeBackButtonDismissalEnabled={false}
            onAppear={[Function]}
            onDisappear={[Function]}
            onDismissed={[Function]}
            onGestureCancel={[Function]}
            onHeaderBackButtonClicked={[Function]}
            onHeaderHeightChange={[Function]}
            onNativeDismissCancelled={[Function]}
            onSheetDetentChanged={[Function]}
            onTransitionProgress={[Function]}
            onWillAppear={[Function]}
            onWillDisappear={[Function]}
            replaceAnimation="push"
            screenId="Dashboard-0-UF_cnjkz-OwAQ8G-X4l"
            sheetAllowedDetents={
              [
                1,
              ]
            }
            sheetCornerRadius={-1}
            sheetElevation={24}
            sheetExpandsWhenScrolledToEdge={true}
            sheetGrabberVisible={false}
            sheetInitialDetent={0}
            sheetInitialDetentIndex={0}
            sheetLargestUndimmedDetent={-1}
            sheetLargestUndimmedDetentIndex={-1}
            stackPresentation="push"
            style={
              {
                "bottom": 0,
                "left": 0,
                "position": "absolute",
                "right": 0,
                "top": 0,
                "zIndex": undefined,
              }
            }
            swipeDirection="horizontal"
          >
            <RNSScreenContentWrapper
              collapsable={false}
              style={
                [
                  {
                    "flex": 1,
                  },
                  [
                    {
                      "backgroundColor": "rgb(242, 242, 242)",
                    },
                    undefined,
                  ],
                ]
              }
            >
              <RCTSafeAreaView
                style={
                  {
                    "backgroundColor": "#0A0A2A",
                    "flex": 1,
                  }
                }
              >
                <RCTScrollView
                  contentContainerStyle={
                    {
                      "padding": 20,
                    }
                  }
                >
                  <View>
                    <View
                      style={
                        {
                          "alignItems": "center",
                          "flexDirection": "row",
                          "justifyContent": "space-between",
                          "marginBottom": 20,
                        }
                      }
                    >
                      <View>
                        <Text
                          style={
                            {
                              "color": "#FFFFFF",
                              "fontSize": 24,
                            }
                          }
                        >
                          Bem-vindo(a),
                        </Text>
                        <Text
                          style={
                            {
                              "color": "#FFFFFF",
                              "fontSize": 24,
                              "fontWeight": "bold",
                            }
                          }
                        >
                          Admin
                          !
                        </Text>
                      </View>
                      <View
                        accessibilityState={
                          {
                            "busy": undefined,
                            "checked": undefined,
                            "disabled": undefined,
                            "expanded": undefined,
                            "selected": undefined,
                          }
                        }
                        accessibilityValue={
                          {
                            "max": undefined,
                            "min": undefined,
                            "now": undefined,
                            "text": undefined,
                          }
                        }
                        accessible={true}
                        collapsable={false}
                        focusable={true}
                        onClick={[Function]}
                        onResponderGrant={[Function]}
                        onResponderMove={[Function]}
                        onResponderRelease={[Function]}
                        onResponderTerminate={[Function]}
                        onResponderTerminationRequest={[Function]}
                        onStartShouldSetResponder={[Function]}
                        style={
                          {
                            "alignItems": "center",
                            "flexDirection": "row",
                            "opacity": 1,
                          }
                        }
                      >
                        <Text
                          allowFontScaling={false}
                          selectable={false}
                          style={
                            [
                              {
                                "color": "#FDD835",
                                "fontSize": 20,
                              },
                              undefined,
                              {
                                "fontFamily": "FontAwesome",
                                "fontStyle": "normal",
                                "fontWeight": "normal",
                              },
                              {},
                            ]
                          }
                        >
                          
                        </Text>
                        <Text
                          style={
                            {
                              "color": "#FDD835",
                              "fontSize": 16,
                              "fontWeight": "bold",
                            }
                          }
                        >
                          Sair
                        </Text>
                      </View>
                    </View>
                    <View
                      style={
                        {
                          "backgroundColor": "#1E1E3F",
                          "borderRadius": 12,
                          "marginBottom": 20,
                          "padding": 20,
                        }
                      }
                    >
                      <Text
                        style={
                          {
                            "color": "#FFFFFF",
                            "fontSize": 20,
                            "fontWeight": "bold",
                            "marginBottom": 16,
                          }
                        }
                      >
                        Pontuar Cliente
                      </Text>
                      <View
                        accessibilityState={
                          {
                            "busy": undefined,
                            "checked": undefined,
                            "disabled": undefined,
                            "expanded": undefined,
                            "selected": undefined,
                          }
                        }
                        accessibilityValue={
                          {
                            "max": undefined,
                            "min": undefined,
                            "now": undefined,
                            "text": undefined,
                          }
                        }
                        accessible={true}
                        collapsable={false}
                        focusable={true}
                        onClick={[Function]}
                        onResponderGrant={[Function]}
                        onResponderMove={[Function]}
                        onResponderRelease={[Function]}
                        onResponderTerminate={[Function]}
                        onResponderTerminationRequest={[Function]}
                        onStartShouldSetResponder={[Function]}
                        style={
                          {
                            "alignItems": "center",
                            "backgroundColor": "#16a34a",
                            "borderRadius": 12,
                            "marginBottom": 16,
                            "opacity": 1,
                            "padding": 15,
                          }
                        }
                      >
                        <Text
                          allowFontScaling={false}
                          selectable={false}
                          style={
                            [
                              {
                                "color": "#fff",
                                "fontSize": 20,
                              },
                              {
                                "marginRight": 8,
                              },
                              {
                                "fontFamily": "FontAwesome",
                                "fontStyle": "normal",
                                "fontWeight": "normal",
                              },
                              {},
                            ]
                          }
                        >
                          
                        </Text>
                        <Text
                          style={
                            {
                              "color": "#FFFFFF",
                              "fontSize": 18,
                              "fontWeight": "bold",
                            }
                          }
                        >
                          Escanear QR Code
                        </Text>
                      </View>
                      <View
                        style={
                          {
                            "marginBottom": 20,
                            "width": "100%",
                          }
                        }
                      >
                        <Text
                          style={
                            {
                              "color": "#FFFFFF",
                              "fontSize": 16,
                              "fontWeight": "500",
                              "marginBottom": 8,
                            }
                          }
                        >
                          Ou insira o ID do Cliente
                        </Text>
                        <TextInput
                          keyboardType="number-pad"
                          onChangeText={[Function]}
                          placeholder="ID do Cliente"
                          placeholderTextColor="#8A8A8A"
                          style={
                            {
                              "backgroundColor": "transparent",
                              "borderColor": "#FFFFFF",
                              "borderRadius": 12,
                              "borderWidth": 1,
                              "color": "#FFFFFF",
                              "fontSize": 16,
                              "paddingHorizontal": 15,
                              "paddingVertical": 12,
                              "width": "100%",
                            }
                          }
                          value=""
                        />
                      </View>
                      <View
                        accessibilityState={
                          {
                            "busy": undefined,
                            "checked": undefined,
                            "disabled": false,
                            "expanded": undefined,
                            "selected": undefined,
                          }
                        }
                        accessibilityValue={
                          {
                            "max": undefined,
                            "min": undefined,
                            "now": undefined,
                            "text": undefined,
                          }
                        }
                        accessible={true}
                        collapsable={false}
                        focusable={true}
                        onClick={[Function]}
                        onResponderGrant={[Function]}
                        onResponderMove={[Function]}
                        onResponderRelease={[Function]}
                        onResponderTerminate={[Function]}
                        onResponderTerminationRequest={[Function]}
                        onStartShouldSetResponder={[Function]}
                        style={
                          {
                            "alignItems": "center",
                            "backgroundColor": "#3D5CFF",
                            "borderRadius": 12,
                            "opacity": 1,
                            "padding": 15,
                          }
                        }
                      >
                        <Text
                          style={
                            {
                              "color": "#FFFFFF",
                              "fontSize": 18,
                              "fontWeight": "bold",
                            }
                          }
                        >
                          Adicionar 1 Ponto
                        </Text>
                      </View>
                    </View>
                    <View
                      style={
                        {
                          "backgroundColor": "#1E1E3F",
                          "borderRadius": 12,
                          "marginBottom": 20,
                          "padding": 20,
                        }
                      }
                    >
                      <Text
                        style={
                          {
                            "color": "#FFFFFF",
                            "fontSize": 20,
                            "fontWeight": "bold",
                            "marginBottom": 16,
                          }
                        }
                      >
                        Menu Principal
                      </Text>
                      <View
                        accessibilityState={
                          {
                            "busy": undefined,
                            "checked": undefined,
                            "disabled": undefined,
                            "expanded": undefined,
                            "selected": undefined,
                          }
                        }
                        accessibilityValue={
                          {
                            "max": undefined,
                            "min": undefined,
                            "now": undefined,
                            "text": undefined,
                          }
                        }
                        accessible={true}
                        collapsable={false}
                        focusable={true}
                        onClick={[Function]}
                        onResponderGrant={[Function]}
                        onResponderMove={[Function]}
                        onResponderRelease={[Function]}
                        onResponderTerminate={[Function]}
                        onResponderTerminationRequest={[Function]}
                        onStartShouldSetResponder={[Function]}
                        style={
                          {
                            "alignItems": "center",
                            "backgroundColor": "#3D5CFF",
                            "borderRadius": 12,
                            "marginBottom": 10,
                            "opacity": 1,
                            "padding": 15,
                          }
                        }
                      >
                        <Text
                          allowFontScaling={false}
                          selectable={false}
                          style={
                            [
                              {
                                "color": "#fff",
                                "fontSize": 20,
                              },
                              {
                                "marginRight": 8,
                              },
                              {
                                "fontFamily": "FontAwesome",
                                "fontStyle": "normal",
                                "fontWeight": "normal",
                              },
                              {},
                            ]
                          }
                        >
                          
                        </Text>
                        <Text
                          style={
                            {
                              "color": "#FFFFFF",
                              "fontSize": 18,
                              "fontWeight": "bold",
                            }
                          }
                        >
                          Gerir Colaboradores
                        </Text>
                      </View>
                      <View
                        accessibilityState={
                          {
                            "busy": undefined,
                            "checked": undefined,
                            "disabled": undefined,
                            "expanded": undefined,
                            "selected": undefined,
                          }
                        }
                        accessibilityValue={
                          {
                            "max": undefined,
                            "min": undefined,
                            "now": undefined,
                            "text": undefined,
                          }
                        }
                        accessible={true}
                        collapsable={false}
                        focusable={true}
                        onClick={[Function]}
                        onResponderGrant={[Function]}
                        onResponderMove={[Function]}
                        onResponderRelease={[Function]}
                        onResponderTerminate={[Function]}
                        onResponderTerminationRequest={[Function]}
                        onStartShouldSetResponder={[Function]}
                        style={
                          {
                            "alignItems": "center",
                            "backgroundColor": "#3D5CFF",
                            "borderRadius": 12,
                            "marginBottom": 10,
                            "opacity": 1,
                            "padding": 15,
                          }
                        }
                      >
                        <Text
                          allowFontScaling={false}
                          selectable={false}
                          style={
                            [
                              {
                                "color": "#fff",
                                "fontSize": 20,
                              },
                              {
                                "marginRight": 8,
                              },
                              {
                                "fontFamily": "FontAwesome",
                                "fontStyle": "normal",
                                "fontWeight": "normal",
                              },
                              {},
                            ]
                          }
                        >
                          
                        </Text>
                        <Text
                          style={
                            {
                              "color": "#FFFFFF",
                              "fontSize": 18,
                              "fontWeight": "bold",
                            }
                          }
                        >
                          Gerir Prémios
                        </Text>
                      </View>
                      <View
                        accessibilityState={
                          {
                            "busy": undefined,
                            "checked": undefined,
                            "disabled": undefined,
                            "expanded": undefined,
                            "selected": undefined,
                          }
                        }
                        accessibilityValue={
                          {
                            "max": undefined,
                            "min": undefined,
                            "now": undefined,
                            "text": undefined,
                          }
                        }
                        accessible={true}
                        collapsable={false}
                        focusable={true}
                        onClick={[Function]}
                        onResponderGrant={[Function]}
                        onResponderMove={[Function]}
                        onResponderRelease={[Function]}
                        onResponderTerminate={[Function]}
                        onResponderTerminationRequest={[Function]}
                        onStartShouldSetResponder={[Function]}
                        style={
                          {
                            "alignItems": "center",
                            "backgroundColor": "#3D5CFF",
                            "borderRadius": 12,
                            "marginBottom": 10,
                            "opacity": 1,
                            "padding": 15,
                          }
                        }
                      >
                        <Text
                          allowFontScaling={false}
                          selectable={false}
                          style={
                            [
                              {
                                "color": "#fff",
                                "fontSize": 20,
                              },
                              {
                                "marginRight": 8,
                              },
                              {
                                "fontFamily": "FontAwesome",
                                "fontStyle": "normal",
                                "fontWeight": "normal",
                              },
                              {},
                            ]
                          }
                        >
                          
                        </Text>
                        <Text
                          style={
                            {
                              "color": "#FFFFFF",
                              "fontSize": 18,
                              "fontWeight": "bold",
                            }
                          }
                        >
                          Ver Relatórios
                        </Text>
                      </View>
                      <View
                        accessibilityState={
                          {
                            "busy": undefined,
                            "checked": undefined,
                            "disabled": undefined,
                            "expanded": undefined,
                            "selected": undefined,
                          }
                        }
                        accessibilityValue={
                          {
                            "max": undefined,
                            "min": undefined,
                            "now": undefined,
                            "text": undefined,
                          }
                        }
                        accessible={true}
                        collapsable={false}
                        focusable={true}
                        onClick={[Function]}
                        onResponderGrant={[Function]}
                        onResponderMove={[Function]}
                        onResponderRelease={[Function]}
                        onResponderTerminate={[Function]}
                        onResponderTerminationRequest={[Function]}
                        onStartShouldSetResponder={[Function]}
                        style={
                          {
                            "alignItems": "center",
                            "backgroundColor": "#3D5CFF",
                            "borderRadius": 12,
                            "marginBottom": 10,
                            "opacity": 1,
                            "padding": 15,
                          }
                        }
                      >
                        <Text
                          allowFontScaling={false}
                          selectable={false}
                          style={
                            [
                              {
                                "color": "#fff",
                                "fontSize": 20,
                              },
                              {
                                "marginRight": 8,
                              },
                              {
                                "fontFamily": "FontAwesome",
                                "fontStyle": "normal",
                                "fontWeight": "normal",
                              },
                              {},
                            ]
                          }
                        >
                          
                        </Text>
                        <Text
                          style={
                            {
                              "color": "#FFFFFF",
                              "fontSize": 18,
                              "fontWeight": "bold",
                            }
                          }
                        >
                          Ver Transações
                        </Text>
                      </View>
                      <View
                        accessibilityState={
                          {
                            "busy": undefined,
                            "checked": undefined,
                            "disabled": undefined,
                            "expanded": undefined,
                            "selected": undefined,
                          }
                        }
                        accessibilityValue={
                          {
                            "max": undefined,
                            "min": undefined,
                            "now": undefined,
                            "text": undefined,
                          }
                        }
                        accessible={true}
                        collapsable={false}
                        focusable={true}
                        onClick={[Function]}
                        onResponderGrant={[Function]}
                        onResponderMove={[Function]}
                        onResponderRelease={[Function]}
                        onResponderTerminate={[Function]}
                        onResponderTerminationRequest={[Function]}
                        onStartShouldSetResponder={[Function]}
                        style={
                          {
                            "alignItems": "center",
                            "backgroundColor": "#3D5CFF",
                            "borderRadius": 12,
                            "marginBottom": 10,
                            "opacity": 1,
                            "padding": 15,
                          }
                        }
                      >
                        <Text
                          allowFontScaling={false}
                          selectable={false}
                          style={
                            [
                              {
                                "color": "#fff",
                                "fontSize": 20,
                              },
                              {
                                "marginRight": 8,
                              },
                              {
                                "fontFamily": "FontAwesome",
                                "fontStyle": "normal",
                                "fontWeight": "normal",
                              },
                              {},
                            ]
                          }
                        >
                          
                        </Text>
                        <Text
                          style={
                            {
                              "color": "#FFFFFF",
                              "fontSize": 18,
                              "fontWeight": "bold",
                            }
                          }
                        >
                          Editar Dados da Empresa
                        </Text>
                      </View>
                    </View>
                  </View>
                </RCTScrollView>
              </RCTSafeAreaView>
            </RNSScreenContentWrapper>
            <RNSScreenStackHeaderConfig
              backButtonInCustomView={false}
              backTitleFontFamily="System"
              backTitleVisible={true}
              backgroundColor="#0A0A2A"
              color="#FFFFFF"
              direction="ltr"
              disableBackButtonMenu={false}
              hidden={true}
              hideBackButton={false}
              largeTitleFontFamily="System"
              largeTitleFontWeight="700"
              largeTitleHideShadow={false}
              pointerEvents="box-none"
              style={
                {
                  "alignItems": "center",
                  "flexDirection": "row",
                  "justifyContent": "space-between",
                  "position": "absolute",
                  "width": "100%",
                }
              }
              title="Dashboard"
              titleColor="#FFFFFF"
              titleFontFamily="System"
              titleFontWeight="700"
              topInsetEnabled={true}
              translucent={false}
            />
          </RNSScreen>
        </RNSScreenStack>
      </RNCSafeAreaProvider>
    `);
  });
});
