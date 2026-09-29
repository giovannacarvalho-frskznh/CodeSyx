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

    // faz o cadastro e o login trocarem  na hora, sem recarregarr
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

    // Se abrir com login.html#cadastro (vindo da home), já abre no cadastro sem animar
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

    // Sem back-end: só impede o envio por enquanto
    document.getElementById("form-login").addEventListener("submit", (e) => {
        e.preventDefault();
        // depois: window.location.href = "inicial.html";
    });

    document.getElementById("form-cadastro").addEventListener("submit", (e) => {
        e.preventDefault();
        mostrarLogin(); // depois de cadastrar, volta para o login
    });
});