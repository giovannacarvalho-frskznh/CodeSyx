document.addEventListener("DOMContentLoaded", () => {
    const auth = document.querySelector(".container-auth");

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

    // faz o cadastro e o login trocarem na hora, sem recarregar
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

    // Se abrir com cadastro.html#cadastro (vindo da home), já abre no cadastro sem animar
    if (location.hash === "#cadastro") {
        auth.classList.add("sem-animacao");
        mostrarCadastro();
        requestAnimationFrame(() =>
            requestAnimationFrame(() => auth.classList.remove("sem-animacao"))
        );
    }

    // Confere se as duas senhas do cadastro são iguais
    const senha = document.getElementById("cad-senha");
    const confirmar = document.getElementById("confirmar-senha");

    function conferirSenhas() {
        confirmar.setCustomValidity(
            confirmar.value !== senha.value ? "As senhas não são iguais" : ""
        );
    }

    senha.addEventListener("input", conferirSenhas);
    confirmar.addEventListener("input", conferirSenhas);

    // LOGIN: confere o e-mail e a senha no usuarios.json e manda pra tela inicial
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

    // Sem back-end: o cadastro só impede o envio e volta pro login
    document.getElementById("form-cadastro").addEventListener("submit", (e) => {
        e.preventDefault();
        mostrarLogin();
    });

    //  ESQUECI MINHA SENHA 
    // As telas extras (recuperar, verificar, definir-senha, senha-redefinida)
    // ficam escondidas por padrão (CSS). Pra mostrar uma delas, a gente:
    // 1. liga "tela-extra-ativa" no container (isso esconde login/cadastro à força)
    // 2. tira "tela-visivel" de todas as telas extras
    // 3. coloca "tela-visivel" só na que queremos mostrar
    function mostrarTelaExtra(classeDaTela) {
        auth.classList.add("tela-extra-ativa");

        document.querySelectorAll(
            ".tela-recuperar, .tela-verificar, .tela-definir-senha, .tela-senha-redefinida"
        ).forEach((tela) => tela.classList.remove("tela-visivel"));

        document.querySelector("." + classeDaTela).classList.add("tela-visivel");
    }

    // Tira o container do modo "tela extra" (usado antes de voltar pro login)
    function sairDaTelaExtra() {
        auth.classList.remove("tela-extra-ativa");
        document.querySelectorAll(
            ".tela-recuperar, .tela-verificar, .tela-definir-senha, .tela-senha-redefinida"
        ).forEach((tela) => tela.classList.remove("tela-visivel"));
    }

    // Link "Esqueceu sua senha?" dentro do login
    document.querySelectorAll('a[href="#recuperar"]').forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            mostrarTelaExtra("tela-recuperar");
        });
    });

    // Envia o e-mail de recuperação (sem back-end: só avança a tela)
    const formRecuperar = document.getElementById("form-recuperar");
    if (formRecuperar) {
        formRecuperar.addEventListener("submit", (e) => {
            e.preventDefault();
            mostrarTelaExtra("tela-verificar");
        });
    }

    // Botão "Abrir aplicativo de e-mail" (sem back-end real de e-mail,
    // aqui só simula que a pessoa clicou no link do e-mail dela)
    const btnAbrirEmail = document.getElementById("btn-abrir-email");
    if (btnAbrirEmail) {
        btnAbrirEmail.addEventListener("click", () => {
            mostrarTelaExtra("tela-definir-senha");
        });
    }

    // Confere se a nova senha e a confirmação são iguais
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

    // Define a nova senha (sem back-end: só avança pra tela de sucesso)
    const formDefinirSenha = document.getElementById("form-definir-senha");
    if (formDefinirSenha) {
        formDefinirSenha.addEventListener("submit", (e) => {
            e.preventDefault();
            mostrarTelaExtra("tela-senha-redefinida");
        });
    }

    // Botão "Continuar" depois da senha redefinida, volta pro login
    const btnContinuarRedefinida = document.getElementById("btn-continuar-redefinida");
    if (btnContinuarRedefinida) {
        btnContinuarRedefinida.addEventListener("click", () => {
            sairDaTelaExtra();
            mostrarLogin();
        });
    }
});