document.addEventListener("DOMContentLoaded",() => {
    const auth = document.querySelector(".container-auth");

    function mostrarCadastro () {
        auth.classList.remove("invertido");
        history.replaceState (null, "", "#cadastro");
        document.title = "CodeSyx - Cadastro"
    }

    function mostrarLogin () {
        auth.classList.remove("invertido");
        history.replaceState (null, "", "#login");
        document.title = "CodeSyx - Login"
    }
    
    
})