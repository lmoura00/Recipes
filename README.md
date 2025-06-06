# ReceitasAPP

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub stars](https://img.shields.io/github/stars/lucas-moura-610579194/receitas-app?style=social)

Um aplicativo móvel de receitas desenvolvido com React Native e Expo. Permite aos usuários explorar, pesquisar, filtrar e favoritar receitas de uma forma moderna e interativa. Uma das principais funcionalidades é a tradução dinâmica do conteúdo das receitas para o português, proporcionando uma experiência de usuário mais fluida.

## 📸 Screenshots

É altamente recomendável adicionar um GIF ou screenshots aqui para mostrar o aplicativo em ação.

| Tela Principal | Lista de Receitas | Detalhes da Receita |
| :---: | :---: | :---: |
| *(adicione o screenshot aqui)* | *(adicione o screenshot aqui)* | *(adicione o screenshot aqui)* |
| **Filtros (Modal)** | **Favoritos** | **Sobre** |
| *(adicione o screenshot aqui)* | *(adicione o screenshot aqui)* | *(adicione o screenshot aqui)* |

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

O projeto utiliza o **Expo Router**, que organiza as rotas baseadas na estrutura de pastas dentro do diretório `app/`.

```
.
├── app/
│   ├── (tabs)/                # Layout principal com abas (se aplicável)
│   ├── about/
│   │   └── page.tsx           # Tela "Sobre"
│   ├── favorites/
│   │   └── page.tsx           # Tela "Meus Favoritos"
│   ├── recipes/
│   │   ├── [id].tsx           # Tela de Detalhes da Receita (rota dinâmica)
│   │   └── page.tsx           # Tela de Lista de Receitas
│   └── index.tsx              # Tela Inicial do App
├── assets/
│   ├── fonts/
│   └── recipes.json           # Animações Lottie
├── context/
│   └── FavoritesContext.tsx   # Contexto para gerenciar os favoritos
├── utils/
│   ├── googleTranslate.ts     # Função para interagir com a API de tradução
│   └── translations.ts        # Funções auxiliares de tradução
└── ...
```

## 🚀 Como Executar

Para clonar e rodar esta aplicação localmente, você precisará de [Node.js](https://nodejs.org/en/) e [Git](https://git-scm.com) instalados.

### 1. Pré-requisitos

Esta aplicação utiliza a API do Google Translate para as traduções dinâmicas. Você precisará de uma chave de API.

-   Obtenha uma chave de API do [Google Cloud Translation API](https://cloud.google.com/translate/docs/setup).

### 2. Instalação

```bash
# Clone o repositório
$ git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)

# Navegue para o diretório do projeto
$ cd receitas-app

# Instale as dependências
$ npm install
# ou
$ yarn install
```

### 3. Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto, seguindo o exemplo do `.env.example` (se houver) ou adicionando a seguinte variável:

```env
# .env
EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY="SUA_CHAVE_DE_API_AQUI"
```

**Importante:** O prefixo `EXPO_PUBLIC_` é necessário para que a variável de ambiente seja acessível no lado do cliente com o Expo.

### 4. Executando a Aplicação

```bash
# Inicie o servidor de desenvolvimento do Expo
$ npx expo start
```

Após iniciar, um código QR aparecerá no terminal. Use o aplicativo **Expo Go** (disponível na [App Store](https://apps.apple.com/us/app/expo-go/id982107779) e [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)) para escanear o QR code e rodar a aplicação em seu smartphone.

## 🌐 API

Este projeto utiliza a API gratuita **[DummyJSON](https://dummyjson.com/docs/recipes)** para buscar os dados das receitas. Agradecimentos à equipe do DummyJSON por fornecer este excelente recurso para desenvolvedores.

## 👨‍💻 Autor

**Lucas de Moura**

-   LinkedIn: [@lucas-moura-610579194](https://www.linkedin.com/in/lucas-moura-610579194/)
-   Instagram: [@lucas.m.galvao_](https://www.instagram.com/lucas.m.galvao_/)
-   WhatsApp: [+55 86 98101-9840](https://wa.me/+5586981019840)

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
