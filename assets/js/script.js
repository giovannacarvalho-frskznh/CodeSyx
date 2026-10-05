// login, cadastro e esqueci minha senha
// (só roda na página que tem .container-auth)

document.addEventListener("DOMContentLoaded", () => {
    const auth = document.querySelector(".container-auth");

    // se não for a página de login/cadastro, não faz nada aqui
    if (!auth) return;

    function mostrarCadastro() {
        auth.classList.remove("invertido");
        history.replaceState(null, "", "#cadastro");
        document.title = "CodeSyx - Cadastro";
    }

    function mostrarLogin() {
        auth.classList.add("invertido");
        history.replaceState(null, "", "#login");
        document.title = "CodeSyx - Login";
    }

    // faz o cadastro e o login trocarem na hora, sem recarregar a página
    document.querySelectorAll('a[href="#cadastro"]').forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            mostrarCadastro();
        });
    });

    document.querySelectorAll('a[href="#login"]').forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            sairDaTelaExtra();
            mostrarLogin();
        });
    });

    // se a pessoa vier da home já clicando em "cadastre-se", abre direto
    // no cadastro, sem a animação de deslizar (fica mais natural)
    if (location.hash === "#cadastro") {
        auth.classList.add("sem-animacao");
        mostrarCadastro();
        requestAnimationFrame(() =>
            requestAnimationFrame(() => auth.classList.remove("sem-animacao"))
        );
    }

    // confere se a senha e a confirmação do cadastro batem
    const senha = document.getElementById("cad-senha");
    const confirmar = document.getElementById("confirmar-senha");

    function conferirSenhas() {
        confirmar.setCustomValidity(
            confirmar.value !== senha.value ? "As senhas não são iguais" : ""
        );
    }

    senha.addEventListener("input", conferirSenhas);
    confirmar.addEventListener("input", conferirSenhas);

    // login: procura o e-mail e a senha digitados dentro do usuarios.json
    // se bater, salva o nome no localStorage e manda pra tela inicial
    document.getElementById("form-login").addEventListener("submit", (e) => {
        e.preventDefault();

        const emailDigitado = document.getElementById("login-email").value.trim();
        const senhaDigitada = document.getElementById("login-senha").value;
        const erroLogin = document.getElementById("erro-login");

        fetch("../assets/js/usuarios.json")
            .then((resposta) => resposta.json())
            .then((usuarios) => {
                const usuarioEncontrado = usuarios.find(
                    (u) => u.email === emailDigitado && u.senha === senhaDigitada
                );

                if (usuarioEncontrado) {
                    localStorage.setItem("usuarioLogado", usuarioEncontrado.nome);
                    window.location.href = "inicial.html";
                } else {
                    erroLogin.textContent = "E-mail ou senha incorretos.";
                }
            })
            .catch(() => {
                erroLogin.textContent = "Erro ao verificar login. Tente novamente.";
            });
    });

    // ainda não temos back-end de verdade, então o cadastro só
    // segura o envio da página e devolve pro login
    document.getElementById("form-cadastro").addEventListener("submit", (e) => {
        e.preventDefault();
        mostrarLogin();
    });

    // esqueci minha senha
    // as telas extras (recuperar, verificar, definir-senha, senha-redefinida)
    // começam todas escondidas (isso tá no css). pra mostrar uma delas:
    // 1. liga a classe "tela-extra-ativa" no container (esconde login/cadastro à força)
    // 2. tira "tela-visivel" de todas as telas extras
    // 3. bota "tela-visivel" só na que a gente quer mostrar agora
    function mostrarTelaExtra(classeDaTela) {
        auth.classList.add("tela-extra-ativa");

        document.querySelectorAll(
            ".tela-recuperar, .tela-verificar, .tela-definir-senha, .tela-senha-redefinida"
        ).forEach((tela) => tela.classList.remove("tela-visivel"));

        document.querySelector("." + classeDaTela).classList.add("tela-visivel");
    }

    // tira o container do "modo tela extra" (usa antes de voltar pro login)
    function sairDaTelaExtra() {
        auth.classList.remove("tela-extra-ativa");
        document.querySelectorAll(
            ".tela-recuperar, .tela-verificar, .tela-definir-senha, .tela-senha-redefinida"
        ).forEach((tela) => tela.classList.remove("tela-visivel"));
    }

    // link "esqueceu sua senha?" dentro do login
    document.querySelectorAll('a[href="#recuperar"]').forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            mostrarTelaExtra("tela-recuperar");
        });
    });

    // "enviar" o e-mail de recuperação (sem back-end real, só avança a tela mesmo)
    const formRecuperar = document.getElementById("form-recuperar");
    if (formRecuperar) {
        formRecuperar.addEventListener("submit", (e) => {
            e.preventDefault();
            mostrarTelaExtra("tela-verificar");
        });
    }

    // botão "abrir aplicativo de e-mail" - aqui a gente só finge que a
    // pessoa clicou no link que teria vindo no e-mail dela
    const btnAbrirEmail = document.getElementById("btn-abrir-email");
    if (btnAbrirEmail) {
        btnAbrirEmail.addEventListener("click", () => {
            mostrarTelaExtra("tela-definir-senha");
        });
    }

    // confere se a nova senha bate com a confirmação
    const novaSenha = document.getElementById("nova-senha");
    const confirmarNovaSenha = document.getElementById("confirmar-nova-senha");

    if (novaSenha && confirmarNovaSenha) {
        function conferirNovaSenha() {
            confirmarNovaSenha.setCustomValidity(
                confirmarNovaSenha.value !== novaSenha.value
                    ? "As senhas não são iguais"
                    : ""
            );
        }
        novaSenha.addEventListener("input", conferirNovaSenha);
        confirmarNovaSenha.addEventListener("input", conferirNovaSenha);
    }

    // define a nova senha (de novo, sem back-end: só avança pra tela de sucesso)
    const formDefinirSenha = document.getElementById("form-definir-senha");
    if (formDefinirSenha) {
        formDefinirSenha.addEventListener("submit", (e) => {
            e.preventDefault();
            mostrarTelaExtra("tela-senha-redefinida");
        });
    }

    // botão "continuar" depois que a senha foi redefinida, volta pro login
    const btnContinuarRedefinida = document.getElementById("btn-continuar-redefinida");
    if (btnContinuarRedefinida) {
        btnContinuarRedefinida.addEventListener("click", () => {
            sairDaTelaExtra();
            mostrarLogin();
        });
    }
});


// pop-up de conexão
// (só roda na página que tem #modalConexao: encontrar pessoas)

document.addEventListener("DOMContentLoaded", () => {
    const modalConexao = document.getElementById("modalConexao");

    // se não for a página de encontrar pessoas, não faz nada aqui
    if (!modalConexao) return;

    const passoPerfil = document.getElementById("modalPerfil");
    const passoSucesso = document.getElementById("modalSucesso");

    // monta as tagzinhas (Python, Git...) dentro de uma caixa do pop-up
    function preencherTags(container, tags) {
        container.innerHTML = "";
        tags.forEach((texto) => {
            const span = document.createElement("span");
            span.textContent = texto;
            container.appendChild(span);
        });
    }

    // pega as tags que já estão escritas numa coluna do card
    // (tanto faz se é "pode te ensinar" ou "quer aprender")
    function lerTags(coluna) {
        return Array.from(coluna.querySelectorAll(".pessoa-tags span")).map(
            (s) => s.textContent
        );
    }

    // abre o pop-up já preenchido com os dados da pessoa que a gente clicou
    function abrirModal(botao) {
        const linha = botao.closest(".pessoa-linha");
        const foto = linha.querySelector(".pessoa-foto");
        const colunas = linha.querySelectorAll(".pessoa-coluna");

        const modalFoto = document.getElementById("modalFoto");
        modalFoto.src = foto.src;
        modalFoto.alt = foto.alt;

        document.getElementById("modalNome").textContent =
            linha.querySelector("h3").textContent;
        document.getElementById("modalCurso").textContent =
            linha.querySelector(".pessoa-perfil p").textContent;
        document.getElementById("modalSobre").textContent =
            botao.dataset.sobre || "";

        preencherTags(document.getElementById("modalEnsinar"), lerTags(colunas[0]));
        preencherTags(document.getElementById("modalAprender"), lerTags(colunas[1]));

        passoPerfil.hidden = false;
        passoSucesso.hidden = true;
        modalConexao.hidden = false;
    }

    function fecharModal() {
        modalConexao.hidden = true;
    }

    // cada botão "ver perfil" abre o modal com os dados daquela pessoa
    document.querySelectorAll(".btn-ver-perfil").forEach((botao) => {
        botao.addEventListener("click", () => abrirModal(botao));
    });

    // clicar em "fazer conexão" troca pra tela de "conexão realizada"
    document.getElementById("btnFazerConexao").addEventListener("click", () => {
        passoPerfil.hidden = true;
        passoSucesso.hidden = false;
    });

    // os botõezinhos de "x" fecham o modal
    modalConexao.querySelectorAll(".modal-fechar").forEach((botao) => {
        botao.addEventListener("click", fecharModal);
    });

    // clicar fora da caixinha também fecha
    modalConexao.addEventListener("click", (evento) => {
        if (evento.target === modalConexao) fecharModal();
    });

    // e apertar ESC fecha também, é mais prático
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") fecharModal();
    });
});