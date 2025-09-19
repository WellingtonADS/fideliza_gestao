# **Aplicação de Gestão - Fideliza+ (React Native)**

Bem-vindo ao repositório da **Aplicação de Gestão Fideliza+**. Esta aplicação, construída em React Native, é a ferramenta de trabalho para os Administradores e Colaboradores das empresas parceiras, permitindo-lhes gerir os seus programas de fidelidade de forma eficiente.

## **🚀 Status do Projeto**

A aplicação está funcional e pronta para uso, fornecendo todas as ferramentas de gestão necessárias para os administradores e colaboradores.

## **✨ Funcionalidades Disponíveis**

### **Para Colaboradores e Administradores:**

* **Autenticação Segura:** Tela de login para acesso ao painel de gestão.
* **Atribuição de Pontos:**
  * Funcionalidade de câmara para ler o QR Code dos clientes.
  * Interface para atribuir pontos rapidamente após a identificação do cliente.
  * Opção de pesquisa manual de clientes.

### **Apenas para Administradores:**

* **Gestão de Colaboradores:**
  * Listar, criar, editar e excluir os colaboradores da sua empresa.
* **Gestão de Prêmios:**
  * Listar e criar novos prêmios (recompensas).
* **Relatórios:**
  * Visualização do painel de resumo com as principais métricas de desempenho da loja.
* **Gestão de Empresa:**
  * Atualizar informações da empresa, incluindo o nome do usuário administrador, endereço e categoria.

## **🛠️ Tecnologias Utilizadas**

* **Framework:** [React Native](https://reactnative.dev/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** StyleSheet (API nativa do React Native)
* **Gerenciamento de Estado:** Context API
* **Bibliotecas:**
  * `react-native-vector-icons`
  * `react-native-vision-camera` (scanner de QR com ML Kit, Android)
  * `react-native-toast-message`

## **🚀 Como Executar o Projeto Localmente**

### **1. Pré-requisitos**

* Ambiente de desenvolvimento React Native configurado (Node.js, JDK 17, Android Studio).
* O [servidor backend do Fideliza+](https://github.com/wellingtonads/fideliza_backend) em execução localmente.

### **2. Configuração do Ambiente**

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO_GESTAO>
   cd fideliza_gestao
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure a Conexão com a API:**
   * Abra o arquivo `src/services/api.ts`.
   * No topo do arquivo, encontre a constante `API_BASE_URL`.
   * **IMPORTANTE:** Altere o endereço para corresponder ao seu ambiente de desenvolvimento:
     * Para o **Emulador Android**, o endereço é geralmente: `http://10.0.2.2:8000/api/v1`
     * Para um **dispositivo físico** na mesma rede Wi-Fi, use o IP da sua máquina: `http://SEU_IP_LOCAL:8000/api/v1`

### **3. Executar a Aplicação**

1. Inicie um emulador a partir do Android Studio.
2. No terminal, dentro da pasta `fideliza_gestao`, execute:
   ```bash
   npx react-native run-android
   ```

A aplicação será compilada e instalada no seu emulador, pronta para uso.

## **📷 Scanner de QR (Android)**

O leitor de QR Code foi implementado com a biblioteca `react-native-vision-camera` (v4) utilizando o backend CameraX e o detector de códigos do Google ML Kit (on-device). O fluxo é robusto para produção e não depende do Metro.

### Fluxo de uso no app
- Acesse a tela “Scanner”.
- Ao abrir, o app solicita permissão de câmera, caso necessário.
- Aponte a câmera para o QR do cliente.
- Ao detectar um QR válido, o app chama a API `addPoints` e navega para o Dashboard exibindo um Toast de sucesso; em caso de erro, exibe um Toast com a mensagem correspondente.

Arquivo principal: `src/screens/ScannerScreen.tsx` (Vision Camera + ML Kit, com tratamento de permissão e UI de fallback).

### Permissões e declarações no Android
As permissões e features estão declaradas em `android/app/src/main/AndroidManifest.xml`:
- Permissões:
  - `android.permission.CAMERA` (obrigatória para o scanner)
  - `android.permission.INTERNET` (necessária para chamadas à API ao adicionar pontos)
  - `android.permission.VIBRATE` (opcional, caso use feedback tátil)
- Features (declaram capacidades do dispositivo, melhorando compatibilidade com a Play Store):
  - `<uses-feature android:name="android.hardware.camera" />`
  - `<uses-feature android:name="android.hardware.camera.autofocus" />`

Observação: A permissão de câmera é solicitada em tempo de execução ao entrar na tela (via `Camera.getCameraPermissionStatus()` / `Camera.requestCameraPermission()`).

### Dependências e flags de build (Android)
- Dependência do ML Kit adicionada em `android/app/build.gradle`:
  - `implementation("com.google.mlkit:barcode-scanning:17.3.0")`
- Flags em `android/gradle.properties`:
  - `VisionCamera_enableCodeScanner=true`
  - `VisionCamera_enableFrameProcessors=false` (não usado nesta implementação)

### Dicas de troubleshooting
- Sem permissão: a tela orienta a abrir as configurações do sistema para conceder acesso à câmera.
- Nenhuma câmera disponível: verifique permissões e se o dispositivo possui câmera traseira funcional.
- API retornando 401: a sessão pode ter expirado; faça login novamente e tente ler o QR de novo.
- Produção: prefira builds de Release (APK/ABB) para testar o scanner, evitando dependências do Metro.
- Bibliotecas legadas removidas: `react-native-camera` e `react-native-qrcode-scanner` não são mais utilizadas.

## **📂 Estrutura do Projeto**

Abaixo está uma visão geral da estrutura do projeto:

```
├── src/
│   ├── assets/              # Recursos estáticos como imagens
│   ├── components/          # Componentes reutilizáveis
│   ├── context/             # Context API para gerenciamento de estado
│   ├── navigation/          # Configuração de navegação
│   ├── screens/             # Telas da aplicação
│   ├── services/            # Serviços como chamadas à API
│   ├── types/               # Definições de tipos TypeScript
├── android/                 # Configurações específicas para Android
├── ios/                     # Configurações específicas para iOS
├── App.tsx                  # Arquivo principal da aplicação
├── package.json             # Dependências e scripts do projeto
```

## **🎨 Padrão de Ícones (Semantic Icon Mapping)**

Este projeto utiliza o mesmo padrão de mapeamento semântico de ícones adotado no app cliente para garantir consistência entre as aplicações do ecossistema Fideliza+.

- Arquivo de mapeamento: `src/components/iconNames.ts`
- Componente base: `src/components/IconComponent.tsx`

### Objetivos
1. Centralizar a definição dos ícones.
2. Facilitar substituição futura da biblioteca de ícones sem alterar telas.
3. Usar chaves de domínio (ex: `home`, `pointHistory`) ao invés de strings literais espalhadas.

### Uso

```tsx
import Icon from '../components/IconComponent';

// Preferencial: chave semântica
<Icon icon="home" size={24} color="#333" />

// Alternativa: nome literal da fonte (fallback)
<Icon name="user" />

// Com rótulo
<Icon icon="home" label="Início" />
```

### Adicionando um novo ícone
1. Edite `iconNames.ts`.
2. Acrescente a nova chave ao tipo `AppIconKey`.
3. Inclua o par no objeto `AppIcons` apontando para o nome FontAwesome.
4. Utilize `<Icon icon="novaChave" />` nas telas.

### Boas práticas
- Use `icon` (semântico) sempre que possível.
- Evite nomes genéricos demais (`temp`, `generic`, etc.).
- Se precisar trocar de FontAwesome para outra lib, apenas ajuste `IconComponent` + `AppIcons`.

### Evoluções futuras sugeridas
- Criar pacote npm interno compartilhado (ex: `@fideliza/ui-icons`).
- Adicionar testes de snapshot para garantir estabilidade visual.
- Suporte a theming dinâmico (cores diferentes por papel: admin x colaborador).

---

## **📄 Licença**

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.