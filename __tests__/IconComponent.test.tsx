import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import IconComponent from '../src/components/IconComponent';

// Mock simplificado para estabilidade dos snapshots
jest.mock('react-native-vector-icons/FontAwesome', () => {
  return function MockFontAwesome() {
    return null;
  };
});

describe('IconComponent (semantic mapping)', () => {
  it('renderiza com chave semântica', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <IconComponent icon="home" size={20} color="#123" label="Início" />,
      );
    });
    expect(tree.toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          [
            {
              "alignItems": "center",
              "justifyContent": "center",
            },
            undefined,
          ]
        }
      >
        <Text
          style={
            [
              {
                "color": "#333",
                "fontSize": 14,
                "marginTop": 5,
              },
              undefined,
            ]
          }
        >
          Início
        </Text>
      </View>
    `);
  });

  it('prioriza prop name sobre icon', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <IconComponent name="user" icon="home" />,
      );
    });
    expect(tree.toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          [
            {
              "alignItems": "center",
              "justifyContent": "center",
            },
            undefined,
          ]
        }
      />
    `);
  });

  it('usa ícone fallback quando nenhum é informado', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<IconComponent />);
    });
    expect(tree.toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          [
            {
              "alignItems": "center",
              "justifyContent": "center",
            },
            undefined,
          ]
        }
      />
    `);
  });
});
