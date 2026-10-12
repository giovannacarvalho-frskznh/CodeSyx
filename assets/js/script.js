
/* ==========================================
   LOGIN, CADASTRO E ESQUECI MINHA SENHA
========================================== */

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

    document.querySelectorAll('a[href="#cadastro"]').forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            mostrarCadastro();
        });
    });

    document.querySelectorAll('a[href="#login"]').forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            sairDaTelaExtra();
            mostrarLogin();
        });
    });

    if (location.hash === "#cadastro") {
        auth.classList.add("sem-animacao");
        mostrarCadastro();

        requestAnimationFrame(() =>
            requestAnimationFrame(() =>
                auth.classList.remove("sem-animacao")
            )
        );
    }

    const senha = document.getElementById("cad-senha");
    const confirmar = document.getElementById("confirmar-senha");

    if (senha && confirmar) {
        function conferirSenhas() {
            confirmar.setCustomValidity(
                confirmar.value !== senha.value
                    ? "As senhas não são iguais"
                    : ""
            );
        }

        senha.addEventListener("input", conferirSenhas);
        confirmar.addEventListener("input", conferirSenhas);
    }

    const formLogin = document.getElementById("form-login");

    if (formLogin) {
        formLogin.addEventListener("submit", e => {
            e.preventDefault();

            const emailDigitado =
                document.getElementById("login-email").value.trim();

            const senhaDigitada =
                document.getElementById("login-senha").value;

            const erroLogin = document.getElementById("erro-login");

            fetch("../assets/js/usuarios.json")
                .then(resposta => {
                    if (!resposta.ok) {
                        throw new Error("Não foi possível carregar usuários.");
                    }

                    return resposta.json();
                })
                .then(usuarios => {
                    const usuarioEncontrado = usuarios.find(
                        u =>
                            u.email === emailDigitado &&
                            u.senha === senhaDigitada
                    );

                    if (usuarioEncontrado) {
                        localStorage.setItem(
                            "usuarioLogado",
                            usuarioEncontrado.nome
                        );

                        window.location.href = "inicial.html";
                    } else if (erroLogin) {
                        erroLogin.textContent =
                            "E-mail ou senha incorretos.";
                    }
                })
                .catch(() => {
                    if (erroLogin) {
                        erroLogin.textContent =
                            "Erro ao verificar login. Tente novamente.";
                    }
                });
        });
    }

    const formCadastro = document.getElementById("form-cadastro");

    if (formCadastro) {
        formCadastro.addEventListener("submit", e => {
            e.preventDefault();
            mostrarLogin();
        });
    }

    function mostrarTelaExtra(classeDaTela) {
        auth.classList.add("tela-extra-ativa");

        document.querySelectorAll(
            ".tela-recuperar, .tela-verificar, " +
            ".tela-definir-senha, .tela-senha-redefinida"
        ).forEach(tela => {
            tela.classList.remove("tela-visivel");
        });

        const tela = document.querySelector("." + classeDaTela);

        if (tela) {
            tela.classList.add("tela-visivel");
        }
    }

    function sairDaTelaExtra() {
        auth.classList.remove("tela-extra-ativa");

        document.querySelectorAll(
            ".tela-recuperar, .tela-verificar, " +
            ".tela-definir-senha, .tela-senha-redefinida"
        ).forEach(tela => {
            tela.classList.remove("tela-visivel");
        });
    }

    document.querySelectorAll('a[href="#recuperar"]').forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            mostrarTelaExtra("tela-recuperar");
        });
    });

    const formRecuperar = document.getElementById("form-recuperar");

    if (formRecuperar) {
        formRecuperar.addEventListener("submit", e => {
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
    const confirmarNovaSenha =
        document.getElementById("confirmar-nova-senha");

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

    const formDefinirSenha =
        document.getElementById("form-definir-senha");

    if (formDefinirSenha) {
        formDefinirSenha.addEventListener("submit", e => {
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


/* ==========================================
   POP-UP DE CONEXÃO / MERGE
========================================== */

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

        tags.forEach(texto => {
            const span = document.createElement("span");
            span.textContent = texto;
            container.appendChild(span);
        });
    }

    function lerTags(coluna) {
        return Array.from(
            coluna.querySelectorAll(".pessoa-tags span")
        ).map(span => span.textContent);
    }

    function identificarPessoa(linha) {
        const nome = linha
            ?.querySelector("h3")
            ?.textContent.trim().toLowerCase();

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
        if (!pessoaSelecionada) return;

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
            colunas[0] ? lerTags(colunas[0]) : []
        );

        preencherTags(
            document.getElementById("modalAprender"),
            colunas[1] ? lerTags(colunas[1]) : []
        );

        passoPerfil.hidden = false;
        passoSucesso.hidden = true;
        modalConexao.hidden = false;
    }

    function fecharModal() {
        modalConexao.hidden = true;
    }

    document.querySelectorAll(".btn-ver-perfil").forEach(botao => {
        botao.addEventListener("click", () => abrirModal(botao));
    });

    if (btnFazerConexao) {
        btnFazerConexao.addEventListener("click", () => {
            if (!pessoaSelecionada) return;

            const nome = document.getElementById("modalNome")?.textContent;
            const foto = document.getElementById("modalFoto")?.getAttribute("src");

            // Guarda a pessoa escolhida para a tela de conversas.
            localStorage.setItem(
                "codesyxChatSelecionado",
                pessoaSelecionada
            );

            const sucessoNome = document.getElementById("sucessoNome");
            const sucessoNome2 = document.getElementById("sucessoNome2");
            const sucessoFoto = document.getElementById("sucessoFoto");
            const sugestao = document.getElementById("sucessoSugestao");

            if (sucessoNome) sucessoNome.textContent = nome || "";
            if (sucessoNome2) sucessoNome2.textContent = nome || "";

            if (sucessoFoto && foto) {
                sucessoFoto.src = foto;
                sucessoFoto.alt = `Foto de ${nome || "estudante"}`;
            }

            const sugestoes = {
                ana: "Que tal começar revisando Python juntos?",
                gabriel: "Que tal praticar Java e lógica juntos?",
                lucas: "Que tal resolver alguns exercícios de Python juntos?",
                gabriella: "Que tal trocar conhecimentos sobre programação?"
            };

            if (sugestao) {
                sugestao.textContent =
                    sugestoes[pessoaSelecionada] ||
                    "Que tal começar a trocar conhecimentos?";
            }

            passoPerfil.hidden = true;
            passoSucesso.hidden = false;
        });
    }

    // O link mantém o HTML original: href="conversas.html".
    // Este código garante que a pessoa escolhida seja guardada.
    const linkConversa = passoSucesso?.querySelector("a.modal-botao");

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

    modalConexao.querySelectorAll(".modal-fechar").forEach(botao => {
        botao.addEventListener("click", fecharModal);
    });

    modalConexao.addEventListener("click", evento => {
        if (evento.target === modalConexao) {
            fecharModal();
        }
    });

    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape") {
            fecharModal();
        }
    });
});


/* ==========================================
   CONVERSAS
========================================== */

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

    // Os nomes e as fotos correspondem aos arquivos do seu HTML.
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
            foto: "../assets/img/gabriellaferreira.png"
        }
    };

    let historico = {};

    try {
        historico = JSON.parse(localStorage.getItem(chave) || "{}");

        if (!historico || typeof historico !== "object" ||
            Array.isArray(historico)) {
            historico = {};
        }
    } catch {
        historico = {};
    }

    let conversaAtual = "ana";

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

        (historico[conversaAtual] || []).forEach(item => {
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

        conversas.forEach(botao => {
            botao.classList.toggle(
                "active",
                botao.dataset.chat === conversaAtual
            );

            atualizarPrevia(botao.dataset.chat);
        });
    }

    function abrirConversa(id) {
        if (!pessoas[id]) return;

        // Não abre uma pessoa que não existe na lista lateral.
        const botao = document.querySelector(
            `.conversa-item[data-chat="${id}"]`
        );

        if (!botao) {
            conversaAtual = "ana";
            renderizarConversa();
            return;
        }

        conversaAtual = id;
        renderizarConversa();
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

    conversas.forEach(botao => {
        botao.addEventListener("click", () => {
            abrirConversa(botao.dataset.chat);
        });
    });

    formulario.addEventListener("submit", evento => {
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

        const pessoaQueRecebeu = conversaAtual;

        // Resposta automática simulada para a demonstração.
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
            historico[conversaAtual] = {};
            historico[conversaAtual] = [];

            salvar();
            renderizarConversa();
        });
    }

    // Atualiza as prévias da lista.
    conversas.forEach(botao => {
        atualizarPrevia(botao.dataset.chat);
    });

    /*
      CORREÇÃO DO MERGE:
      Lê a pessoa selecionada na tela anterior.
      Assim, não começa sempre na Ana.
    */

    const pessoaSalva = localStorage.getItem(
        "codesyxChatSelecionado"
    );

    const conversaMarcada = document.querySelector(
        ".conversa-item.active"
    )?.dataset.chat;

    if (pessoaSalva && pessoas[pessoaSalva]) {
        abrirConversa(pessoaSalva);
    } else {
        abrirConversa(
            pessoas[conversaMarcada] ? conversaMarcada : "ana"
        );
    }

    // Remove apenas a seleção temporária depois de utilizá-la.
    localStorage.removeItem("codesyxChatSelecionado");
});


/* ==========================================
   CARROSSEL AUTOMÁTICO CONTÍNUO
   Mantido do código original
   Para elementos .funcionalidades
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const carrossel = document.querySelector(".funcionalidades");
    if (!carrossel) return;

    const cards = Array.from(
        carrossel.querySelectorAll(".card-funcionalidade")
    );

    if (cards.length < 2) return;

    // Prepara os cards em uma única linha.
    carrossel.style.display = "flex";
    carrossel.style.flexDirection = "row";
    carrossel.style.flexWrap = "nowrap";
    carrossel.style.justifyContent = "flex-start";
    carrossel.style.gap = "15px";
    carrossel.style.width = "max-content";
    carrossel.style.maxWidth = "none";
    carrossel.style.willChange = "transform";

    // Duplica os cards para formar o ciclo contínuo.
    cards.forEach(card => {
        const copia = card.cloneNode(true);
        copia.setAttribute("aria-hidden", "true");
        carrossel.appendChild(copia);
    });

    let posicao = 0;
    let ultimoTempo = 0;
    const velocidade = 45;

    function animar(tempo) {
        if (!ultimoTempo) ultimoTempo = tempo;

        const delta = Math.min(
            (tempo - ultimoTempo) / 1000,
            0.05
        );

        ultimoTempo = tempo;
        posicao += velocidade * delta;

        const distanciaCiclo = carrossel.scrollWidth / 2;

        if (distanciaCiclo > 0 && posicao >= distanciaCiclo) {
            posicao -= distanciaCiclo;
        }

        carrossel.style.transform = `translateX(${-posicao}px)`;

        requestAnimationFrame(animar);
    }

    requestAnimationFrame(animar);
});
