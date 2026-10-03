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
});