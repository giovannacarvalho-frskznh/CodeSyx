// MENU DO USUÁRIO (setinha do header) + SAIR
document.addEventListener("DOMContentLoaded", () => {
    function sair() {
        try {
            localStorage.removeItem("usuarioLogado");
        } catch {
            // sem acesso ao armazenamento: só volta pra index
        }
    }

    // Botão Sair do menu lateral
    const btnSair = document.getElementById("btn-sair");
    if (btnSair) btnSair.addEventListener("click", sair);

    // Menu da setinha
    const usuario = document.querySelector(".dash-topo-usuario");
    if (!usuario) return;

    const estilo = document.createElement("style");
    estilo.textContent = `
        .dash-topo-usuario {
            position: relative;
            cursor: pointer;
            user-select: none;
        }

        .dash-topo-usuario .fa-chevron-down {
            transition: transform 0.2s ease;
        }

        .dash-topo-usuario.menu-aberto .fa-chevron-down {
            transform: rotate(180deg);
        }

        .menu-usuario {
            display: none;
            position: absolute;
            top: calc(100% + 10px);
            right: 0;
            min-width: 160px;
            padding: 6px;
            border-radius: 10px;
            border: 1px solid var(--azul, #008cff);
            background: var(--carta-azul, #12396e);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
            z-index: 1500;
        }

        .dash-topo-usuario.menu-aberto .menu-usuario {
            display: block;
        }

        .menu-usuario-sair {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            border-radius: 8px;
            font-size: 14px;
            color: var(--texto, #e9edf7);
            text-decoration: none;
        }

        .menu-usuario-sair:hover {
            background: var(--azul-escuro, #0a1433);
        }

        .menu-usuario-sair i {
            color: #ff8a8a;
        }
    `;
    document.head.appendChild(estilo);

    // Cria o menu com a opção Sair
    const menu = document.createElement("div");
    menu.className = "menu-usuario";
    menu.setAttribute("role", "menu");

    const linkSair = document.createElement("a");
    linkSair.href = "../index.html";
    linkSair.className = "menu-usuario-sair";
    linkSair.setAttribute("role", "menuitem");

    const icone = document.createElement("i");
    icone.className = "fa-solid fa-right-from-bracket";

    const texto = document.createElement("span");
    texto.textContent = "Sair";

    linkSair.append(icone, texto);
    linkSair.addEventListener("click", sair);
    menu.appendChild(linkSair);
    usuario.appendChild(menu);

    // Acessibilidade: dá pra abrir com Tab + Enter
    usuario.tabIndex = 0;
    usuario.setAttribute("role", "button");
    usuario.setAttribute("aria-haspopup", "true");
    usuario.setAttribute("aria-expanded", "false");

    function abrir(aberto) {
        usuario.classList.toggle("menu-aberto", aberto);
        usuario.setAttribute("aria-expanded", String(aberto));
    }

    function alternar() {
        abrir(!usuario.classList.contains("menu-aberto"));
    }

    usuario.addEventListener("click", (evento) => {
        if (evento.target.closest(".menu-usuario")) return;
        alternar();
    });

    usuario.addEventListener("keydown", (evento) => {
        if (evento.target !== usuario) return;

        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            alternar();
        }
    });

    // Fecha ao clicar fora ou apertar Esc
    document.addEventListener("click", (evento) => {
        if (!usuario.contains(evento.target)) abrir(false);
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") abrir(false);
    });
});