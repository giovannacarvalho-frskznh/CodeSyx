# CodeSyx

Plataforma para estudantes de tecnologia se conectarem e estudarem juntos. A pessoa encontra colegas da mesma área, do mesmo semestre ou que já passaram pela matéria que ela está estudando, vê o que cada um pode ensinar e o que quer aprender, e inicia uma conversa.

Projeto final do programa Serasa + PROA, feito em grupo.

---

## 1. Objetivo

Facilitar a troca de conhecimento entre estudantes. Em vez de estudar sozinho, a pessoa encontra alguém que sabe o que ela precisa aprender e que também quer aprender algo que ela sabe (por isso o card mostra "Pode te ensinar" e "Quer aprender" e uma porcentagem de compatibilidade).

## 2. Tecnologias

- HTML5
- CSS3
- JavaScript puro (sem framework)
- Sem back-end: os dados são simulados
  - `usuarios.json` guarda os usuários do login
  - `localStorage` guarda as conversas do chat no navegador
- Design prototipado no Figma
- Organização do grupo no Trello

## 3. Identidade visual

- Tema escuro com detalhes em verde e azul
- Paleta de 13 cores (tons de azul e verde) definida no Canva
- Mascote com cabeça em formato de átomo, usando camiseta "CodeSyx"
- Fontes: Poppins (textos) e Playfair Display (título da página pública)

## 4. Páginas

| Página | Arquivo | O que faz |
|---|---|---|
| Home pública | `index.html` | Apresenta a plataforma antes do login, com botões para entrar e cadastrar |
| Login e cadastro | `pages/login.html` | Login e cadastro na mesma tela, com animação de troca. Também tem o fluxo de "esqueci minha senha" |
| Início | `pages/inicial.html` | Boas-vindas, pessoas recomendadas, progresso (XP) e SOS Dúvida |
| Encontrar pessoas | `pages/encontrar_pessoas.html` | Lista de pessoas com filtros e cards de compatibilidade. O botão "Ver perfil" abre um pop-up |
| Conversas | `pages/conversas.html` | Chat com 3 pessoas (Ana, Gabriel e Lucas) |

## 5. Estrutura de pastas

```
CodeSyx/
├── index.html
├── assets/
│   ├── css/      → style.css (variáveis e partes compartilhadas) + um CSS para cada página
│   ├── js/       → script.js e usuarios.json
│   └── img/      → logo, mascote, ícones e fotos
└── pages/
    ├── login.html
    ├── inicial.html
    ├── encontrar_pessoas.html
    └── conversas.html
```

### Como o CSS está organizado

- `style.css` guarda só o que todas as páginas usam: variáveis de cor (`:root`), reset e partes compartilhadas como header e sidebar
- Cada página tem o seu próprio arquivo CSS, só com o que é exclusivo dela
- Regra do grupo: um CSS de página nunca repete uma classe que já existe no `style.css`, senão as telas ficam diferentes umas das outras

## 6. Como cada parte funciona

### Login e cadastro

- O login lê o `usuarios.json` e compara e-mail e senha. Se bater, salva o nome no `localStorage` e vai para `inicial.html`
- Login e cadastro ficam no mesmo container. O JS liga e desliga a classe `invertido`, e o CSS faz os dois lados trocarem de posição com animação
- O cadastro confere se a senha e a confirmação são iguais antes de enviar
- Como não existe back-end, o cadastro só volta para o login depois de enviar

### Esqueci minha senha

São 4 telas que ficam escondidas por padrão: recuperar, verificar e-mail, definir nova senha e senha redefinida. O JS liga a classe `tela-extra-ativa` no container (que esconde login e cadastro) e coloca `tela-visivel` só na tela que deve aparecer. Nenhum e-mail é enviado de verdade, o fluxo apenas avança as telas.

### Pop-up de conexão (Encontrar pessoas)

1. Cada card tem um botão "Ver perfil"
2. Ao clicar, a função `abrirModal` sobe até o card daquele botão (`closest(".pessoa-linha")`) e copia foto, nome, curso, texto "sobre" e as tags para o pop-up
3. O pop-up começa escondido (`hidden = true`). `abrirModal` troca para `hidden = false`, e ele aparece
4. O botão "Fazer conexão" troca o pop-up para a tela "Conexão realizada"
5. `fecharModal` volta para `hidden = true`. Ela é chamada pelo botão X, por um clique fora da caixa ou pela tecla ESC

Nenhum dado novo é criado: o pop-up só reaproveita o que já está escrito no HTML do card.

### Conversas

- O chat começa vazio e o usuário alterna entre as 3 pessoas pela lista da esquerda
- As mensagens ficam salvas no `localStorage`, então continuam ali ao recarregar a página
- Toda mensagem enviada recebe a mesma resposta padrão ("Olá, como você tá?") depois de 1,5 segundo
- O botão "Limpar conversa" apaga as mensagens da pessoa aberta

## 7. Como baixar e rodar

### Passo 1: pegar o projeto

**Opção A: clonar com Git** (precisa ter o [Git](https://git-scm.com/) instalado)

```bash
git clone https://github.com/SEU-USUARIO/CodeSyx.git
cd CodeSyx
```

**Opção B: baixar o ZIP** (não precisa de Git)

1. Abra o repositório no GitHub
2. Clique no botão verde **Code**
3. Clique em **Download ZIP**
4. Extraia o ZIP em uma pasta do computador

> Troque `SEU-USUARIO` pelo usuário do GitHub que guarda o repositório do grupo.

### Passo 2: abrir e rodar

Não precisa instalar mais nada. Abra a pasta do projeto no VS Code e use a extensão Live Server (clique direito em `index.html` > "Open with Live Server"). O Live Server é recomendado porque o login usa `fetch` para ler o `usuarios.json`, e o navegador bloqueia isso quando o arquivo é aberto direto pelo explorador.

### Usuário para testar o login

Use qualquer e-mail e senha que estejam no arquivo `assets/js/usuarios.json`.

## 8. Limitações atuais

- Sem back-end: login, cadastro, conexões e respostas do chat são simulados
- As senhas ficam em texto puro no `usuarios.json`, o que serve para demonstração mas não seria usado em um sistema real
- Os filtros de Encontrar pessoas ainda não filtram de verdade (os selects estão só com a opção "Todos")
- Os dados das pessoas (Ana, Gabriel, Lucas) são fixos

## 9. Próximos passos possíveis

- Criar um back-end para guardar usuários e conversas
- Fazer os filtros da página Encontrar pessoas funcionarem
- Calcular a compatibilidade com base no que cada pessoa ensina e quer aprender
- Concluir a página de Perfil
