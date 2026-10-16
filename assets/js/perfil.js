// PERFIL - CRUD com localStorage
document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("perfil-nome")) return;

    const CHAVE = "codesyxPerfil";

    // Tecnologias que têm ícone na pasta assets/img
    const CATALOGO = [
        { nome: "Python", img: "Python.png" },
        { nome: "Java", img: "Java.png" },
        { nome: "JavaScript", img: "JavaScript.png" },
        { nome: "HTML", img: "HTML.png" },
        { nome: "CSS", img: "CSS.png" },
        { nome: "SQL", img: "SQL.png" },
        { nome: "Git", img: "Git.png" },
        { nome: "Lógica", img: "Logica.png" }
    ];

    // Perfil padrão (usado na primeira vez e no "Restaurar")
    const PADRAO = {
        nome: "Carlos Almeida",
        semestre: "1º Semestre | ADS",
        sobre: "Curto tecnologia, programação e sempre estou buscando aprender algo novo. Gosto de trocar ideias, ajudar quem está aprendendo e crescer junto com a galera.",
        aprender: ["Python", "Lógica", "Git"],
        conhecimentos: ["HTML", "CSS", "JavaScript"],
        email: "carlosalmeida19@email.com",
        curso: "ADS - 1º Semestre",
        foto: ""
    };

    // Elementos da página
    const el = {
        foto: document.getElementById("perfil-foto"),
        nome: document.getElementById("perfil-nome"),
        semestre: document.getElementById("perfil-semestre"),
        sobre: document.getElementById("sobre-texto"),
        aprender: document.getElementById("lista-aprender"),
        conhecimentos: document.getElementById("lista-conhecimentos"),
        email: document.getElementById("dados-email"),
        curso: document.getElementById("dados-curso"),
        inputFoto: document.getElementById("input-foto"),
        headerNome: document.querySelector(".dash-usuario-nome"),
        headerSemestre: document.querySelector(".dash-usuario-semestre"),
        headerFoto: document.querySelector(".dash-usuario-avatar img")
    };

    // Fotos originais do HTML (aparecem quando não há foto salva)
    const fotoOriginal = el.foto.getAttribute("src");
    const headerFotoOriginal = el.headerFoto ? el.headerFoto.getAttribute("src") : "";


    // DADOS (localStorage)
    function carregar() {
        try {
            const salvo = JSON.parse(localStorage.getItem(CHAVE));

            if (salvo && typeof salvo === "object" && !Array.isArray(salvo)) {
                const dados = { ...PADRAO, ...salvo };

                if (!Array.isArray(dados.aprender)) dados.aprender = [...PADRAO.aprender];
                if (!Array.isArray(dados.conhecimentos)) dados.conhecimentos = [...PADRAO.conhecimentos];

                return dados;
            }
        } catch {
            // dado corrompido: usa o padrão
        }

        return { ...PADRAO, aprender: [...PADRAO.aprender], conhecimentos: [...PADRAO.conhecimentos] };
    }

    let perfil = carregar();

    function salvar() {
        try {
            localStorage.setItem(CHAVE, JSON.stringify(perfil));
        } catch {
            alert("Não foi possível salvar. O armazenamento do navegador está cheio.");
        }
    }

    function gravar() {
        salvar();
        renderizar();
    }


    // ---------- TELA ----------

    function criarTech(nome) {
        const item = document.createElement("div");
        item.className = "perfil-tech";

        const info = CATALOGO.find((t) => t.nome.toLowerCase() === nome.toLowerCase());

        if (info) {
            const img = document.createElement("img");
            img.src = "../assets/img/" + info.img;
            img.alt = "";
            item.appendChild(img);
        } else {
            const icone = document.createElement("i");
            icone.className = "fa-solid fa-code";
            item.appendChild(icone);
        }

        const texto = document.createElement("span");
        texto.textContent = nome;
        item.appendChild(texto);

        return item;
    }

    function renderizarTechs(container, lista) {
        container.replaceChildren();

        if (lista.length === 0) {
            const vazio = document.createElement("p");
            vazio.className = "perfil-vazio";
            vazio.textContent = "Nada por aqui ainda.";
            container.appendChild(vazio);
            return;
        }

        lista.forEach((nome) => container.appendChild(criarTech(nome)));
    }

    function renderizar() {
        el.nome.textContent = perfil.nome;
        el.semestre.textContent = perfil.semestre;
        el.sobre.textContent = perfil.sobre;
        el.email.textContent = perfil.email;
        el.curso.textContent = perfil.curso;

        el.foto.src = perfil.foto || fotoOriginal;

        renderizarTechs(el.aprender, perfil.aprender);
        renderizarTechs(el.conhecimentos, perfil.conhecimentos);

        // Header
        if (el.headerNome) el.headerNome.textContent = perfil.nome.split(" ")[0];
        if (el.headerSemestre) el.headerSemestre.textContent = perfil.semestre;
        if (el.headerFoto) el.headerFoto.src = perfil.foto || headerFotoOriginal;
    }


    // POP-UP

    const estilo = document.createElement("style");
    estilo.textContent = `
        .pf-modal-fundo {
            position: fixed;
            inset: 0;
            z-index: 2000;
            display: grid;
            place-items: center;
            padding: 16px;
            background: rgba(0, 0, 0, 0.65);
        }

        .pf-modal {
            width: 100%;
            max-width: 440px;
            max-height: 90vh;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 22px;
            border-radius: 14px;
            border: 1px solid var(--azul, #008cff);
            background: var(--carta-azul, #12396e);
            color: var(--texto, #e9edf7);
            font-family: inherit;
        }

        .pf-modal h2 {
            font-size: 20px;
        }

        .pf-campos {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .pf-campo {
            display: flex;
            flex-direction: column;
            gap: 6px;
            font-size: 13px;
            color: var(--silenciado, #b7c0d4);
        }

        .pf-campo input,
        .pf-campo textarea {
            padding: 10px 12px;
            border-radius: 8px;
            border: 1px solid var(--azul, #008cff);
            background: var(--azul-escuro, #0a1433);
            color: var(--texto, #e9edf7);
            font-family: inherit;
            font-size: 14px;
            outline: none;
        }

        .pf-campo textarea {
            min-height: 110px;
            resize: vertical;
        }

        .pf-previa {
            width: 160px;
            height: 160px;
            align-self: center;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid var(--verde, #6fcc39);
        }

        .pf-grade {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        }

        .pf-check {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 10px;
            border-radius: 8px;
            border: 1px solid var(--azul, #008cff);
            font-size: 14px;
            cursor: pointer;
        }

        .pf-check input {
            accent-color: var(--verde, #6fcc39);
        }

        .pf-extras,
        .pf-acoes {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .pf-acoes {
            justify-content: flex-end;
        }

        .pf-btn {
            padding: 10px 18px;
            border-radius: 20px;
            border: 1px solid transparent;
            font-family: inherit;
            font-size: 14px;
            font-weight: bold;
            color: #fff;
            cursor: pointer;
        }

        .pf-btn-salvar {
            background: linear-gradient(90deg, var(--verde, #6fcc39), var(--azul, #008cff));
        }

        .pf-btn-cancelar {
            background: transparent;
            border-color: var(--azul, #008cff);
        }

        .pf-btn-perigo {
            background: transparent;
            border-color: #ff5c5c;
            color: #ff8a8a;
        }

        .perfil-vazio {
            font-size: 13px;
            color: var(--silenciado, #b7c0d4);
        }

        @media (max-width: 480px) {
            .pf-grade {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(estilo);

    function criarBotao(texto, classe, tipo = "button") {
        const botao = document.createElement("button");
        botao.type = tipo;
        botao.className = "pf-btn " + classe;
        botao.textContent = texto;
        return botao;
    }

    function criarCampo(container, rotulo, tipo, valor, opcoes = {}) {
        const label = document.createElement("label");
        label.className = "pf-campo";

        const texto = document.createElement("span");
        texto.textContent = rotulo;

        const input = tipo === "textarea"
            ? document.createElement("textarea")
            : document.createElement("input");

        if (tipo !== "textarea") input.type = tipo;

        input.value = valor;
        input.required = Boolean(opcoes.obrigatorio);
        if (opcoes.max) input.maxLength = opcoes.max;

        label.append(texto, input);
        container.appendChild(label);

        return input;
    }

    // montarCampos(container, fechar) cria os campos e devolve os inputs
    // aoSalvar(inputs) recebe os inputs e grava os dados
    // textos (opcional): { salvar: "...", cancelar: "..." }
    function abrirModal(titulo, montarCampos, aoSalvar, textos = {}) {
        const fundo = document.createElement("div");
        fundo.className = "pf-modal-fundo";

        const caixa = document.createElement("form");
        caixa.className = "pf-modal";

        const h2 = document.createElement("h2");
        h2.textContent = titulo;

        const campos = document.createElement("div");
        campos.className = "pf-campos";

        const acoes = document.createElement("div");
        acoes.className = "pf-acoes";

        const btnCancelar = criarBotao(textos.cancelar || "Cancelar", "pf-btn-cancelar");
        const btnSalvar = criarBotao(textos.salvar || "Salvar", "pf-btn-salvar", "submit");
        acoes.append(btnCancelar, btnSalvar);

        caixa.append(h2, campos, acoes);
        fundo.appendChild(caixa);
        document.body.appendChild(fundo);

        function teclado(evento) {
            if (evento.key === "Escape") fechar();
        }

        function fechar() {
            fundo.remove();
            document.removeEventListener("keydown", teclado);
        }

        document.addEventListener("keydown", teclado);

        const inputs = montarCampos(campos, fechar);

        btnCancelar.addEventListener("click", fechar);

        fundo.addEventListener("click", (evento) => {
            if (evento.target === fundo) fechar();
        });

        caixa.addEventListener("submit", (evento) => {
            evento.preventDefault();
            aoSalvar(inputs);
            fechar();
        });

        const primeiro = caixa.querySelector("input, textarea");
        if (primeiro) primeiro.focus();
    }


    // EDITAR PERFIL nome, semestre e opções da foto)

    document.getElementById("btn-editar-perfil").addEventListener("click", () => {
        abrirModal(
            "Editar perfil",
            (container, fechar) => {
                const inputs = {
                    nome: criarCampo(container, "Nome", "text", perfil.nome, { max: 40, obrigatorio: true }),
                    semestre: criarCampo(container, "Semestre e curso", "text", perfil.semestre, { max: 40, obrigatorio: true })
                };

                const extras = document.createElement("div");
                extras.className = "pf-extras";

                // Voltar pra foto anterior (alterna entre a atual e a anterior)
                if (typeof perfil.fotoAnterior === "string") {
                    const btnAnterior = criarBotao("Voltar à foto anterior", "pf-btn-cancelar");

                    btnAnterior.addEventListener("click", () => {
                        const atual = perfil.foto;
                        perfil.foto = perfil.fotoAnterior;
                        perfil.fotoAnterior = atual;
                        gravar();
                        fechar();
                    });

                    extras.appendChild(btnAnterior);
                }

                // Remover a foto (volta pra foto padrão)
                if (perfil.foto) {
                    const btnRemoverFoto = criarBotao("Remover foto", "pf-btn-perigo");

                    btnRemoverFoto.addEventListener("click", () => {
                        perfil.fotoAnterior = perfil.foto;
                        perfil.foto = "";
                        gravar();
                        fechar();
                    });

                    extras.appendChild(btnRemoverFoto);
                }

                // Apagar tudo e voltar ao padrão
                const btnRestaurar = criarBotao("Restaurar perfil padrão", "pf-btn-perigo");

                btnRestaurar.addEventListener("click", () => {
                    if (!confirm("Isso apaga tudo que você editou no perfil. Continuar?")) return;

                    try {
                        localStorage.removeItem(CHAVE);
                    } catch {
                        // sem acesso ao armazenamento: só volta o padrão na tela
                    }

                    perfil = carregar();
                    renderizar();
                    fechar();
                });

                extras.appendChild(btnRestaurar);
                container.appendChild(extras);

                return inputs;
            },
            (inputs) => {
                const nome = inputs.nome.value.trim();
                const semestre = inputs.semestre.value.trim();

                if (!nome || !semestre) return;

                perfil.nome = nome;
                perfil.semestre = semestre;
                gravar();
            }
        );
    });


    //  ALTERAR FOTO 

    function abrirPreviaFoto(novaFoto) {
        abrirModal(
            "Nova foto de perfil",
            (container) => {
                const previa = document.createElement("img");
                previa.className = "pf-previa";
                previa.src = novaFoto;
                previa.alt = "Prévia da nova foto";
                container.appendChild(previa);

                return {};
            },
            () => {
                perfil.fotoAnterior = perfil.foto;
                perfil.foto = novaFoto;
                gravar();
            },
            { salvar: "Usar esta foto", cancelar: "Descartar" }
        );
    }

    document.getElementById("btn-alterar-foto").addEventListener("click", () => {
        el.inputFoto.click();
    });

    el.inputFoto.addEventListener("change", () => {
        const arquivo = el.inputFoto.files[0];
        if (!arquivo) return;

        if (!arquivo.type.startsWith("image/")) {
            alert("Escolha um arquivo de imagem.");
            el.inputFoto.value = "";
            return;
        }

        const leitor = new FileReader();

        leitor.onload = () => {
            const imagem = new Image();

            imagem.onload = () => {
                // Reduz a foto pra caber no localStorage
                const maximo = 400;
                const escala = Math.min(1, maximo / Math.max(imagem.width, imagem.height));

                const canvas = document.createElement("canvas");
                canvas.width = Math.round(imagem.width * escala);
                canvas.height = Math.round(imagem.height * escala);
                canvas.getContext("2d").drawImage(imagem, 0, 0, canvas.width, canvas.height);

                // Só mostra a prévia: nada é salvo até confirmar
                abrirPreviaFoto(canvas.toDataURL("image/jpeg", 0.85));
            };

            imagem.onerror = () => alert("Não foi possível ler essa imagem.");
            imagem.src = leitor.result;
        };

        leitor.readAsDataURL(arquivo);
        el.inputFoto.value = "";
    });


    // SOBRE MIM

    document.getElementById("btn-editar-sobre").addEventListener("click", () => {
        abrirModal(
            "Sobre mim",
            (container) => ({
                sobre: criarCampo(container, "Conte um pouco sobre você", "textarea", perfil.sobre, { max: 300, obrigatorio: true })
            }),
            (inputs) => {
                const sobre = inputs.sobre.value.trim();
                if (!sobre) return;

                perfil.sobre = sobre;
                gravar();
            }
        );
    });


    //  QUERO APRENDER / CONHECIMENTOS 

    function editarTechs(titulo, chave) {
        abrirModal(
            titulo,
            (container) => {
                const atuais = perfil[chave];
                const nomes = CATALOGO.map((t) => t.nome);

                // Tecnologias próprias já salvas também aparecem pra poder desmarcar
                atuais.forEach((nome) => {
                    if (!nomes.some((n) => n.toLowerCase() === nome.toLowerCase())) {
                        nomes.push(nome);
                    }
                });

                const grade = document.createElement("div");
                grade.className = "pf-grade";

                const caixas = nomes.map((nome) => {
                    const label = document.createElement("label");
                    label.className = "pf-check";

                    const caixa = document.createElement("input");
                    caixa.type = "checkbox";
                    caixa.value = nome;
                    caixa.checked = atuais.some((n) => n.toLowerCase() === nome.toLowerCase());

                    const texto = document.createElement("span");
                    texto.textContent = nome;

                    label.append(caixa, texto);
                    grade.appendChild(label);

                    return caixa;
                });

                container.appendChild(grade);

                const novo = criarCampo(container, "Adicionar outra (opcional)", "text", "", { max: 20 });

                return { caixas, novo };
            },
            (inputs) => {
                const lista = inputs.caixas
                    .filter((caixa) => caixa.checked)
                    .map((caixa) => caixa.value);

                const extra = inputs.novo.value.trim();

                if (extra && !lista.some((n) => n.toLowerCase() === extra.toLowerCase())) {
                    lista.push(extra);
                }

                perfil[chave] = lista;
                gravar();
            }
        );
    }

    document.getElementById("btn-editar-aprender").addEventListener("click", () => {
        editarTechs("Quero aprender", "aprender");
    });

    document.getElementById("btn-editar-conhecimentos").addEventListener("click", () => {
        editarTechs("Conhecimentos", "conhecimentos");
    });


    // ---------- DADOS PESSOAIS ----------

    document.getElementById("btn-editar-dados").addEventListener("click", () => {
        abrirModal(
            "Dados pessoais",
            (container) => ({
                email: criarCampo(container, "E-mail", "email", perfil.email, { max: 60, obrigatorio: true }),
                curso: criarCampo(container, "Curso", "text", perfil.curso, { max: 40, obrigatorio: true })
            }),
            (inputs) => {
                const email = inputs.email.value.trim();
                const curso = inputs.curso.value.trim();

                if (!email || !curso) return;

                perfil.email = email;
                perfil.curso = curso;
                gravar();
            }
        );
    });


    // Primeira renderização
    renderizar();
});