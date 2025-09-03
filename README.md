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
* **Gestão de Prémios:**
  * Listar e criar novos prémios (recompensas).
* **Relatórios:**
  * Visualização do painel de resumo com as principais métricas de desempenho da loja.

## **🛠️ Tecnologias Utilizadas**

* **Framework:** [React Native](https://reactnative.dev/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** StyleSheet (API nativa do React Native)

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
   * Abra o arquivo `App.tsx`.
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

## **📂 Estrutura do Projeto**

Abaixo está uma visão geral da estrutura do projeto:

```
├── src/
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

## **📄 Licença**

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.