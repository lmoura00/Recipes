# ReceitasAPP

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub stars](https://img.shields.io/github/stars/lucas-moura-610579194/ReceitasAPP?style=social)

Um aplicativo móvel de receitas desenvolvido com React Native e Expo. Permite aos usuários explorar, pesquisar, filtrar e favoritar receitas de uma forma moderna e interativa. Uma das principais funcionalidades é a tradução dinâmica do conteúdo das receitas para o português, proporcionando uma experiência de usuário mais fluida.

## 📸 Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/00527e0d-5251-4585-a337-0616e5999533" width="45%" alt="Tela Principal">
  <img src="https://github.com/user-attachments/assets/22e3ca4e-de04-46ca-87d3-7f32fbaf73c6" width="45%" alt="Lista de Receitas">
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/30eefb59-33dc-4f8d-a5d0-41b69f393ba2" width="45%" alt="Detalhes da Receita">
  <img src="https://github.com/user-attachments/assets/209f2cd7-31c1-434a-8ee4-ac330d80d0e3" width="45%" alt="Filtros (Modal)">
</p>
<p align="center">
 <img src="https://github.com/user-attachments/assets/30eefb59-33dc-4f8d-a5d0-41b69f393ba2" width="45%" alt="Detalhes da Receita">
  <img src="https://github.com/user-attachments/assets/209f2cd7-31c1-434a-8ee4-ac330d80d0e3" width="45%" alt="Filtros (Modal)">
</p>


## ✨ Funcionalidades

-   **Navegação Principal**: Tela de boas-vindas com acesso rápido às seções principais.
-   **Explorar Receitas**: Lista infinita de receitas carregadas sob demanda.
-   **Pesquisa Dinâmica**: Campo de busca com *debounce* para não sobrecarregar as requisições à API.
-   **Sistema de Filtros Avançado**:
    -   Filtro por Culinária/Tags.
    -   Filtro por Tipo de Refeição.
    -   Filtro por Nível de Dificuldade.
-   **Tradução Automática**: Nomes, ingredientes e instruções são traduzidos dinamicamente para o português usando uma API externa.
-   **Detalhes da Receita**: Visualização completa com imagem, tempo de preparo, ingredientes, modo de preparo, avaliações e outras informações.
-   **Sistema de Favoritos**: Marque e desmarque receitas como favoritas, com os dados persistidos no dispositivo.
-   **Animações**: Uso da biblioteca Lottie para animações, tornando a interface mais agradável.
-   **Design Responsivo e Moderno**: Interface limpa e adaptada para Android e iOS.

## 🛠️ Tecnologias Utilizadas

-   **[React Native](https://reactnative.dev/)**: Framework para desenvolvimento de aplicações móveis multiplataforma.
-   **[Expo](https://expo.dev/)**: Plataforma e conjunto de ferramentas para construir e rodar aplicações React Native.
-   **[Expo Router](https://expo.github.io/router/)**: Sistema de roteamento baseado em arquivos para uma navegação declarativa.
-   **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática.
-   **[Axios](https://axios-http.com/)**: Cliente HTTP para realizar requisições à API.
-   **[Lottie](https://lottiefiles.com/)**: Para renderizar animações vetoriais de alta qualidade.
-   **[Context API](https://react.dev/reference/react/useContext)**: Para gerenciamento de estado global (ex: Favoritos).

## 📁 Estrutura do Projeto

O projeto utiliza o **Expo Router** e segue uma estrutura organizada dentro do diretório `src/`, que é uma prática recomendada para separar o código da aplicação de arquivos de configuração.

.
└── src/
├── app/
│   ├── about/
│   │   └── page.tsx            # Rota: /about
│   ├── favorites/
│   │   └── page.tsx            # Rota: /favorites
│   ├── recipes/
│   │   ├── [id].tsx            # Rota dinâmica: /recipes/[id]
│   │   ├── _layout.tsx         # Layout compartilhado para as rotas de recipes
│   │   └── page.tsx            # Rota: /recipes/page (Tela de Lista de Receitas)
│   └── index.tsx               # Rota principal do app: /
│
├── assets/                     # Imagens, fontes e animações Lottie
│   ├── coding.json
│   ├── favoriteEmpty.json
│   └── ...
│
├── context/
│   └── FavoritesContext.tsx    # Contexto para gerenciar o estado dos favoritos
│
└── utils/
├── googleTranslate.ts      # Funções para a API de tradução
└── translations.ts         # Funções auxiliares


## 🚀 Como Executar

Para clonar e rodar esta aplicação localmente, você precisará de [Node.js](https://nodejs.org/en/) e [Git](https://git-scm.com) instalados.

### 1. Pré-requisitos

Esta aplicação utiliza a API do Google Translate para as traduções dinâmicas. Você precisará de uma chave de API.

-   Obtenha uma chave de API do [Google Cloud Translation API](https://cloud.google.com/translate/docs/setup).

### 2. Instalação

```bash
# Clone o repositório
$ git clone [https://github.com/lucas-moura-610579194/ReceitasAPP.git](https://github.com/lucas-moura-610579194/ReceitasAPP.git)

# Navegue para o diretório do projeto
$ cd ReceitasAPP

# Instale as dependências
$ npm install
# ou
$ yarn install
3. Configuração do Ambiente
Crie um arquivo .env na raiz do projeto, seguindo o exemplo do .env.example (se houver) ou adicionando a seguinte variável:

Snippet de código

# .env
EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY="SUA_CHAVE_DE_API_AQUI"
Importante: O prefixo EXPO_PUBLIC_ é necessário para que a variável de ambiente seja acessível no lado do cliente com o Expo.

4. Executando a Aplicação
Bash

# Inicie o servidor de desenvolvimento do Expo
$ npx expo start
Após iniciar, um código QR aparecerá no terminal. Use o aplicativo Expo Go (disponível na App Store e Play Store) para escanear o QR code e rodar a aplicação em seu smartphone.

🌐 API
Este projeto utiliza a API gratuita DummyJSON para buscar os dados das receitas. Agradecimentos à equipe do DummyJSON por fornecer este excelente recurso para desenvolvedores.

👨‍💻 Autor
Lucas de Moura

LinkedIn: @lucas-moura-610579194
Instagram: @lucas.m.galvao_
WhatsApp: +55 86 98101-9840
📄 Licença
Distribuído sob a licença MIT. Veja LICENSE para mais informações.