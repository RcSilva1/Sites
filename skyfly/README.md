# Skyfly — Simulador de programa de milhas (projeto escolar)

Aplicação web React + Vite + Firebase que simula, de forma funcional e visualmente realista, o
sistema de milhas e fidelidade de uma companhia aérea fictícia chamada **Skyfly**. Feita para uma
apresentação escolar sobre como funcionam programas de fidelidade.

> Todos os valores, regras, benefícios e níveis apresentados são fictícios e servem apenas para
> fins educacionais — não representam nenhum programa real de milhagem.

---

## 1. Arquitetura, em resumo

```
Usuário → React (Vite) → Firebase Authentication (login/cadastro)
                        → Firebase Realtime Database (perfil, saldo, histórico)
```

- **Frontend**: React 18 + React Router, sem framework de estado extra (Context API já cobre a
  necessidade do projeto: sessão do usuário e notificações).
- **Autenticação**: Firebase Authentication (e-mail/senha).
- **Dados**: Firebase Realtime Database. Estrutura:

  ```
  users/{uid}
    ├── name, email
    ├── milesBalance        saldo atual (o que pode ser gasto)
    ├── milesAccumulated    total histórico acumulado (define o nível)
    ├── milesRedeemed       total histórico resgatado
    ├── level               basic | silver | gold | platinum
    └── createdAt

  transactions/{uid}/{transactionId}
    ├── type        "accumulate" | "redeem"
    ├── amount
    ├── description
    └── date
  ```

  `milesBalance` muda para cima e para baixo (acúmulo e resgate). `milesAccumulated` só cresce —
  é ele que define o nível do usuário, para que resgatar milhas nunca derrube a categoria, como em
  programas reais.

- **Fluxo de acúmulo**: `src/firebase/database.js → accumulateMiles()` usa `runTransaction` do
  Realtime Database para incrementar o saldo de forma atômica (evita condição de corrida com duas
  abas abertas), registra uma transação em `transactions/{uid}` e recalcula o nível.
- **Fluxo de resgate**: `redeemMiles()` verifica saldo suficiente **dentro** da transação do
  banco (não apenas no componente React antes de chamar a função), já que um valor checado só no
  cliente pode estar desatualizado.

## 2. Estrutura de pastas

```
src/
├── components/       componentes reutilizáveis (Navbar, Button, MilesBalance, etc.)
│   └── illustrations/  ilustrações SVG originais (sem imagens de terceiros)
├── pages/             uma página por rota
├── layouts/           layout raiz (Navbar + Footer + Outlet)
├── context/           AuthContext (sessão) e ToastContext (notificações)
├── hooks/             useAuth, useMiles, useTransactions, useToast
├── firebase/          config.js (único lugar com o firebaseConfig), auth.js, database.js
├── data/              conteúdo do site: marca, níveis, benefícios, textos de "Como funciona"
├── utils/             formatadores e constantes de rota
└── styles/            tokens.css (paleta/tipografia) e global.css (reset)
```

Trocar o nome da marca em todo o site é feito em **um único lugar**: `src/data/brand.js`.

## 3. Como rodar o projeto localmente

Pré-requisitos: [Node.js](https://nodejs.org) 18 ou superior.

```bash
npm install
cp .env.example .env    
npm run dev
```

O projeto abre em `http://localhost:5173`.

## 4. Configurando o Firebase (Console)

O projeto já vem com a configuração do Firebase abaixo, mas ela precisa ser colocada no arquivo
`.env` (não direto no código) — veja `.env.example`:

```
apiKey: "AIzaSyClNEgpdQkPKQHaziY-cfpp3tMK8nQCxCQ"
authDomain: "banco-de-dados-milhas-90ada.firebaseapp.com"
databaseURL: "https://banco-de-dados-milhas-90ada-default-rtdb.firebaseio.com"
projectId: "banco-de-dados-milhas-90ada"
storageBucket: "banco-de-dados-milhas-90ada.firebasestorage.app"
messagingSenderId: "24599723553"
appId: "1:24599723553:web:42407acf6e9ebbe43cad60"
measurementId: "G-7CZT1MJCY0"
```

Ainda é preciso **ativar manualmente** dois recursos no [Firebase Console](https://console.firebase.google.com):

### 4.1 Ativar o Authentication

1. Abra o projeto `banco-de-dados-milhas-90ada` no Console.
2. Menu lateral → **Build → Authentication → Get started**.
3. Aba **Sign-in method** → clique em **E-mail/senha** → ative a primeira opção → **Salvar**.

### 4.2 Ativar o Realtime Database e publicar as regras

1. Menu lateral → **Build → Realtime Database → Create database**.
2. Escolha a localização e inicie em **modo bloqueado** (locked mode) — as regras corretas vêm no
   próximo passo, então não use o modo de teste.
3. Aba **Rules**, apague o conteúdo e cole o conteúdo do arquivo `database.rules.json` (na raiz
   deste projeto). Clique em **Publish**.
4. Confirme que a `databaseURL` da aba **Data** bate com a do `.env`.

## 5. Conta de demonstração para a apresentação

Não existe usuário/senha fixos no código — por segurança, toda conta é criada de verdade pelo
formulário de cadastro. Para preparar a demo:

1. Rode o projeto localmente (`npm run dev`).
2. Acesse **Criar conta** e cadastre um usuário de teste (ex.: `demo@skyfly.app`).
3. O cadastro já credita automaticamente um bônus de boas-vindas de 5.000 milhas, então a conta
   nasce com saldo suficiente para já demonstrar um resgate.
4. Para a apresentação em si, use esse mesmo login — os dados persistem no Firebase entre sessões.

Se quiser uma conta com saldo maior para a demonstração, use o simulador na página **Como
funciona** ou no **Painel** para creditar mais milhas rapidamente antes de apresentar.

## 6. Fluxo sugerido de apresentação

Home → Como funciona → Criar conta / Entrar → Painel (ver saldo e nível) → simular acúmulo no
painel → Resgatar (escolher um benefício e confirmar) → ver saldo diminuir → Histórico (ver a
transação registrada) → Perfil → Sair.

Todas essas páginas já existem e estão conectadas de ponta a ponta ao Firebase — nada nesse fluxo
é simulado apenas visualmente.

## 7. Segurança — o que está implementado e o que é uma simplificação escolar

- As regras em `database.rules.json` garantem que **cada usuário só lê e escreve os próprios
  dados** (`auth.uid === $uid`) e validam o **tipo e formato** de cada campo (números não
  negativos, strings dentro de um tamanho máximo, transações imutáveis depois de criadas).
- **Limitação conhecida e assumida**: como toda a lógica de acúmulo/resgate roda no cliente (não
  existe backend próprio), as regras do Realtime Database não conseguem validar sozinhas que um
  novo saldo é exatamente "saldo anterior − custo do benefício resgatado" — elas garantem que o
  valor final é um número válido, mas não impedem que alguém consiga, manipulando diretamente o
  SDK fora da interface do site, escrever um saldo arbitrário na própria conta. Numa versão de
  produção real, o acúmulo e o resgate de milhas deveriam ser feitos por uma **Cloud Function**
  (backend), que é a única com permissão de escrita em `milesBalance`, `milesAccumulated`,
  `milesRedeemed` e `level` — o cliente apenas pediria a operação, nunca escreveria o resultado
  diretamente. Isso foi deixado documentado aqui, em vez de escondido, conforme pedido no
  briefing do projeto.
- Da mesma forma, a criação do perfil em duas etapas (Authentication + Realtime Database, em
  `src/firebase/auth.js → registerUser`) não é atômica. Em produção, isso também seria resolvido
  com uma Cloud Function acionada pelo evento de criação de usuário.
- Nenhuma credencial de administrador (Admin SDK / service account) existe em nenhum arquivo do
  frontend.

## 8. Limitações conhecidas

- Sem backend próprio: todas as regras de negócio (cálculo de nível, validação de saldo) rodam no
  cliente, com a Realtime Database como única camada de proteção — ver seção 7.
- As imagens de aeroporto/aviação foram substituídas por ilustrações SVG originais
  (`src/components/illustrations`), para não depender de bancos de imagem externos com direitos
  incertos.
- Não há recuperação de conta além do e-mail de redefinição de senha padrão do Firebase.

## 9. Scripts disponíveis

```bash
npm run dev       # ambiente de desenvolvimento
npm run build     # build de produção em /dist
npm run preview   # pré-visualiza o build de produção
```
