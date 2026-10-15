
// LOGIN, CADASTRO E RECUPERAÇÃO DE SENHA
// ACESSO LIVRE À CODESYX


document.addEventListener("DOMContentLoaded", () => {
    const auth = document.querySelector(".container-auth");
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

    function mostrarTelaExtra(classeDaTela) {
        auth.classList.add("tela-extra-ativa");

        document.querySelectorAll(
            ".tela-recuperar, .tela-verificar, .tela-definir-senha, .tela-senha-redefinida"
        ).forEach((tela) => tela.classList.remove("tela-visivel"));

        document.querySelector("." + classeDaTela)?.classList.add("tela-visivel");
    }

    function sairDaTelaExtra() {
        auth.classList.remove("tela-extra-ativa");

        document.querySelectorAll(
            ".tela-recuperar, .tela-verificar, .tela-definir-senha, .tela-senha-redefinida"
        ).forEach((tela) => tela.classList.remove("tela-visivel"));
    }

    // Alternar entre login e cadastro
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

    // Abrir diretamente a tela de cadastro quando a URL tiver #cadastro
    if (location.hash === "#cadastro") {
        auth.classList.add("sem-animacao");
        mostrarCadastro();

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                auth.classList.remove("sem-animacao");
            });
        });
    }

 
    // LOGIN LIVRE: NÃO EXIGE E-MAIL NEM SENHA


    const emailLogin = document.getElementById("login-email");
    const senhaLogin = document.getElementById("login-senha");
    const erroLogin = document.getElementById("erro-login");
    const formLogin = document.getElementById("form-login");

    if (emailLogin) emailLogin.required = false;
    if (senhaLogin) senhaLogin.required = false;

    if (formLogin) {
        formLogin.noValidate = true;

        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();

            localStorage.setItem("usuarioLogado", "Visitante CodeSyx");

            if (erroLogin) {
                erroLogin.textContent = "";
            }

            window.location.href = "inicial.html";
        });
    }

  
    // CADASTRO LIVRE: TAMBÉM ENTRA NO SITE


    const formCadastro = document.getElementById("form-cadastro");

    if (formCadastro) {
        formCadastro.noValidate = true;

        formCadastro.querySelectorAll("input").forEach((campo) => {
            campo.required = false;
        });

        formCadastro.addEventListener("submit", (e) => {
            e.preventDefault();

            localStorage.setItem("usuarioLogado", "Visitante CodeSyx");

            window.location.href = "inicial.html";
        });
    }


    // RECUPERAR SENHA - SIMULAÇÃO VISUAL
    document.querySelectorAll('a[href="#recuperar"]').forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            mostrarTelaExtra("tela-recuperar");
        });
    });

    const formRecuperar = document.getElementById("form-recuperar");

    if (formRecuperar) {
        formRecuperar.addEventListener("submit", (e) => {
            e.preventDefault();
            mostrarTelaExtra("tela-verificar");
        });
    }

    const btnAbrirEmail = document.getElementById("btn-abrir-email");

    if (btnAbrirEmail) {
        btnAbrirEmail.addEventListener("click", () => {
            mostrarTelaExtra("tela-definir-senha");
        });
    }

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

    const formDefinirSenha = document.getElementById("form-definir-senha");

    if (formDefinirSenha) {
        formDefinirSenha.addEventListener("submit", (e) => {
            e.preventDefault();
            mostrarTelaExtra("tela-senha-redefinida");
        });
    }

    const btnContinuarRedefinida = document.getElementById(
        "btn-continuar-redefinida"
    );

    if (btnContinuarRedefinida) {
        btnContinuarRedefinida.addEventListener("click", () => {
            sairDaTelaExtra();
            mostrarLogin();
        });
    }
});


// POP-UP DE CONEXÃO / MERGE

document.addEventListener("DOMContentLoaded", () => {
    const modalConexao = document.getElementById("modalConexao");
    if (!modalConexao) return;

    const passoPerfil = document.getElementById("modalPerfil");
    const passoSucesso = document.getElementById("modalSucesso");
    const btnFazerConexao = document.getElementById("btnFazerConexao");

    let pessoaSelecionada = null;

    function preencherTags(container, tags) {
        if (!container) return;

        container.replaceChildren();

        tags.forEach((texto) => {
            const span = document.createElement("span");
            span.textContent = texto;
            container.appendChild(span);
        });
    }

    function lerTags(coluna) {
        if (!coluna) return [];

        return Array.from(
            coluna.querySelectorAll(".pessoa-tags span")
        ).map((span) => span.textContent);
    }

    function identificarPessoa(linha) {
        const nome = linha?.querySelector("h3")?.textContent
            .trim()
            .toLowerCase();

        if (!nome) return null;
        if (nome.includes("ana costa")) return "ana";
        if (nome.includes("gabriel santos")) return "gabriel";
        if (nome.includes("lucas almeida")) return "lucas";
        if (nome.includes("gabriella ferreira")) return "gabriella";

        return null;
    }

    function abrirModal(botao) {
        const linha = botao.closest(".pessoa-linha");
        if (!linha) return;

        pessoaSelecionada = identificarPessoa(linha);

        const foto = linha.querySelector(".pessoa-foto");
        const colunas = linha.querySelectorAll(".pessoa-coluna");

        const modalFoto = document.getElementById("modalFoto");
        const modalNome = document.getElementById("modalNome");
        const modalCurso = document.getElementById("modalCurso");
        const modalSobre = document.getElementById("modalSobre");

        if (modalFoto && foto) {
            modalFoto.src = foto.getAttribute("src");
            modalFoto.alt = foto.alt;
        }

        if (modalNome) {
            modalNome.textContent =
                linha.querySelector("h3")?.textContent || "";
        }

        if (modalCurso) {
            modalCurso.textContent =
                linha.querySelector(".pessoa-perfil p")?.textContent || "";
        }

        if (modalSobre) {
            modalSobre.textContent = botao.dataset.sobre || "";
        }

        preencherTags(
            document.getElementById("modalEnsinar"),
            lerTags(colunas[0])
        );

        preencherTags(
            document.getElementById("modalAprender"),
            lerTags(colunas[1])
        );

        if (passoPerfil) passoPerfil.hidden = false;
        if (passoSucesso) passoSucesso.hidden = true;

        modalConexao.hidden = false;
    }

    function fecharModal() {
        modalConexao.hidden = true;
    }

    document.querySelectorAll(".btn-ver-perfil").forEach((botao) => {
        botao.addEventListener("click", () => abrirModal(botao));
    });

    if (btnFazerConexao) {
        btnFazerConexao.addEventListener("click", () => {
            if (!pessoaSelecionada) return;

            const nome = document.getElementById("modalNome")?.textContent;

            localStorage.setItem(
                "codesyxChatSelecionado",
                pessoaSelecionada
            );

            if (nome) {
                localStorage.setItem("codesyxNomeSelecionado", nome);
            }

            if (passoPerfil) passoPerfil.hidden = true;
            if (passoSucesso) passoSucesso.hidden = false;
        });
    }

    modalConexao.querySelectorAll(".modal-fechar").forEach((botao) => {
        botao.addEventListener("click", fecharModal);
    });

    modalConexao.addEventListener("click", (evento) => {
        if (evento.target === modalConexao) {
            fecharModal();
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            fecharModal();
        }
    });

    // Guarda a pessoa escolhida ao abrir a conversa.
    const linkConversa = document.querySelector("#modalSucesso a.modal-botao");

    if (linkConversa) {
        linkConversa.addEventListener("click", () => {
            if (pessoaSelecionada) {
                localStorage.setItem(
                    "codesyxChatSelecionado",
                    pessoaSelecionada
                );
            }
        });
    }
});



// CONVERSAS - CHAT SIMULADO
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector(".chat-form");
    const campo = document.querySelector(".chat-input");
    const areaMensagens = document.getElementById("chat-mensagens");
    const botaoLimpar = document.getElementById("btn-limpar");
    const conversas = document.querySelectorAll(".conversa-item");
    const titulo = document.querySelector(".chat-user-info h2");
    const avatarChat = document.querySelector(".chat-avatar");
    const statusChat = document.getElementById("chat-status");

    if (!formulario || !campo || !areaMensagens) return;

    const chave = "codesyxConversas";

    const pessoas = {
        ana: {
            nome: "Ana Costa",
            foto: "../assets/img/anacosta.png"
        },
        gabriel: {
            nome: "Gabriel Santos",
            foto: "../assets/img/gabrielsantos.png"
        },
        lucas: {
            nome: "Lucas Almeida",
            foto: "../assets/img/lucasalmeida.png"
        },
        gabriella: {
            nome: "Gabriella Ferreira",
            foto: "../assets/img/avatar-gabriella.png"
        }
    };

    let historico = {};

    try {
        historico = JSON.parse(localStorage.getItem(chave) || "{}");

        if (
            !historico ||
            typeof historico !== "object" ||
            Array.isArray(historico)
        ) {
            historico = {};
        }
    } catch {
        historico = {};
    }

    const pessoaSalva = localStorage.getItem("codesyxChatSelecionado");

    let conversaAtual = pessoas[pessoaSalva]
        ? pessoaSalva
        : document.querySelector(".conversa-item.active")?.dataset.chat || "ana";

    if (!pessoas[conversaAtual]) {
        conversaAtual = "ana";
    }

    function salvar() {
        localStorage.setItem(chave, JSON.stringify(historico));
    }

    function mostrarMensagem(texto, autor) {
        const mensagem = document.createElement("div");

        mensagem.className = autor === "voce"
            ? "mensagem mensagem-propria"
            : "mensagem mensagem-recebida";

        mensagem.textContent = texto;
        areaMensagens.appendChild(mensagem);
        areaMensagens.scrollTop = areaMensagens.scrollHeight;
    }

    function atualizarPrevia(id) {
        const botao = document.querySelector(
            `.conversa-item[data-chat="${id}"]`
        );

        const previa = botao?.querySelector(".conversa-previa");
        const mensagens = historico[id] || [];

        if (previa) {
            previa.textContent = mensagens.length
                ? mensagens[mensagens.length - 1].texto
                : "Nenhuma mensagem ainda";
        }
    }

    function renderizarConversa() {
        areaMensagens.replaceChildren();

        (historico[conversaAtual] || []).forEach((item) => {
            mostrarMensagem(item.texto, item.autor);
        });

        const pessoa = pessoas[conversaAtual];

        if (pessoa && titulo) {
            titulo.textContent = pessoa.nome;
        }

        if (pessoa && avatarChat) {
            avatarChat.src = pessoa.foto;
            avatarChat.alt = `Foto de ${pessoa.nome}`;
        }

        if (statusChat) {
            statusChat.textContent = "Online";
        }

        conversas.forEach((botao) => {
            botao.classList.toggle(
                "active",
                botao.dataset.chat === conversaAtual
            );

            atualizarPrevia(botao.dataset.chat);
        });
    }

    function responder(texto) {
        const mensagem = texto.toLowerCase().trim();

        if (/\b(oi|olá|ola|e aí|eai|opa|bom dia|boa tarde|boa noite)\b/.test(mensagem)) {
            return "Oii! Tudo bem? 😊";
        }

        if (/\b(tudo bem|td bem|como você está|como vc tá|como vai)\b/.test(mensagem)) {
            return "Tudo bem por aqui! E com você?";
        }

        if (/\b(obrigado|obrigada|valeu|vlw)\b/.test(mensagem)) {
            return "Imagina! 😊";
        }

        if (/\b(java|python|javascript|js|sql|banco de dados|html|css|react)\b/.test(mensagem)) {
            return "Legal! Podemos estudar isso juntos. Qual parte você quer praticar?";
        }

        if (/\b(estudar|estudo|exercício|exercicio|ajuda|dúvida|duvida)\b/.test(mensagem)) {
            return "Claro! Me conta qual é sua dúvida e vamos tentar resolver juntos.";
        }

        return "Entendi! 😊 Me conta mais sobre isso.";
    }

    conversas.forEach((botao) => {
        botao.addEventListener("click", () => {
            const id = botao.dataset.chat;
            if (!pessoas[id]) return;

            conversaAtual = id;
            localStorage.setItem("codesyxChatSelecionado", id);
            renderizarConversa();
        });
    });

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const texto = campo.value.trim();
        if (!texto) return;

        historico[conversaAtual] ||= [];
        historico[conversaAtual].push({
            texto,
            autor: "voce"
        });

        salvar();
        renderizarConversa();
        campo.value = "";

        // Resposta fictícia para a demonstração do protótipo.
        const pessoaQueRecebeu = conversaAtual;

        setTimeout(() => {
            const resposta = responder(texto);

            historico[pessoaQueRecebeu] ||= [];
            historico[pessoaQueRecebeu].push({
                texto: resposta,
                autor: "outro"
            });

            salvar();
            atualizarPrevia(pessoaQueRecebeu);

            if (conversaAtual === pessoaQueRecebeu) {
                renderizarConversa();
            }
        }, 700);
    });

    if (botaoLimpar) {
        botaoLimpar.addEventListener("click", () => {
            historico[conversaAtual] = [];
            salvar();
            renderizarConversa();
        });
    }

    renderizarConversa();
});
