document.addEventListener("DOMContentLoaded", function () {
    const btnMenu = document.getElementById("btnMenu");
    const menuDropdown = document.getElementById("menuDropdown");

    const tabela = document.getElementById("tabelaOcorrencias");

    const inputBusca = document.getElementById("filtroNome");
    const selectTurma = document.getElementById("filtroTurma");
    const selectTipo = document.getElementById("filtroTipo");
    const inputData = document.getElementById("filtroData");
    const btnLimparFiltros = document.querySelector(".btnLimparFiltros");

    const botoesStatus = document.querySelectorAll(".filtroStatus");

    const modalOcorrencia = document.getElementById("modalOcorrencia");
    const modalBody = document.getElementById("modalBody");
    const fecharModal = document.getElementById("fecharModal");
    const alterarStatus = document.getElementById("alterarStatus");
    const salvarStatus = document.getElementById("salvarStatus");

    let statusAtual = "todas";
    let indiceAtual = null;

    if (btnMenu && menuDropdown) {
        btnMenu.addEventListener("click", function (event) {
            event.stopPropagation();
            menuDropdown.classList.toggle("ativo");
        });

        document.addEventListener("click", function (event) {
            if (!menuDropdown.contains(event.target)) {
                menuDropdown.classList.remove("ativo");
            }
        });
    }

    function formatarData(data) {
        if (!data) return "-";
        const partes = data.split("-");
        if (partes.length !== 3) return data;
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function obterOcorrencias() {
        return JSON.parse(localStorage.getItem("ocorrencias")) || [];
    }

    function atualizarBotoesStatus() {
        botoesStatus.forEach(function (botao) {
            const statusBotao = botao.dataset.status;

            if (statusBotao === statusAtual) {
                botao.classList.add("btnAtivado");
                botao.classList.remove("btnDesativado");
            } else {
                botao.classList.remove("btnAtivado");
                botao.classList.add("btnDesativado");
            }
        });
    }

    function filtrarOcorrencias(lista) {
        const nomeBusca = inputBusca.value.trim().toLowerCase();
        const turmaBusca = selectTurma.value;
        const tipoBusca = selectTipo.value;
        const dataBusca = inputData.value;

        return lista.filter(function (ocorrencia) {
            const nome = (ocorrencia.nome || "").toLowerCase();
            const turma = ocorrencia.serie || ocorrencia.turma || "";
            const tipo = ocorrencia.tipo || "";
            const data = ocorrencia.data || "";
            const status = (ocorrencia.status || "pendente").toLowerCase();

            const bateNome =
                !nomeBusca || nome.includes(nomeBusca);

            const bateTurma =
                !turmaBusca || turma === turmaBusca;

            const bateTipo =
                !tipoBusca || tipo === tipoBusca;

            const bateData =
                !dataBusca || data === dataBusca;

            const bateStatus =
                statusAtual === "todas" || status === statusAtual;

            return (
                bateNome &&
                bateTurma &&
                bateTipo &&
                bateData &&
                bateStatus
            );
        });
    }

    function renderizarTabela() {
        const ocorrencias = obterOcorrencias();
        const filtradas = filtrarOcorrencias(ocorrencias);

        tabela.innerHTML = "";

        if (filtradas.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6">Nenhuma ocorrência encontrada.</td>
                </tr>
            `;
            return;
        }

        filtradas.forEach(function (ocorrencia) {
            const indiceOriginal = ocorrencias.indexOf(ocorrencia);

            const tipoClasse =
                ocorrencia.tipo === "Negativa"
                    ? "negativa"
                    : "positiva";

            const statusClasse = (
                ocorrencia.status || "pendente"
            ).toLowerCase();

            const turma = ocorrencia.serie || ocorrencia.turma || "-";

            tabela.innerHTML += `
                <tr>
                    <td>${ocorrencia.nome || "-"}</td>
                    <td>${turma}</td>
                    <td>${formatarData(ocorrencia.data)}</td>
                    <td class="${tipoClasse}">
                        ${ocorrencia.tipo || "-"}
                    </td>
                    <td class="${statusClasse}">
                        ${ocorrencia.status || "pendente"}
                    </td>
                    <td>
                        <button class="btn btnVerMais" data-indice="${indiceOriginal}">
                            Ver mais
                        </button>
                    </td>
                </tr>
            `;
        });

        document.querySelectorAll(".btnVerMais").forEach(function (botao) {
            botao.addEventListener("click", function () {
                abrirModal(Number(this.dataset.indice));
            });
        });
    }

    function abrirModal(indice) {
        const ocorrencias = obterOcorrencias();
        const ocorrencia = ocorrencias[indice];

        if (!ocorrencia) return;

        indiceAtual = indice;

        alterarStatus.value =
            (ocorrencia.status || "pendente").toLowerCase();

        modalBody.innerHTML = `
            <div class="itemModal">
                <strong>Aluno</strong>
                ${ocorrencia.nome || "-"}
            </div>

            <div class="itemModal">
                <strong>CGM</strong>
                ${ocorrencia.cgm || "-"}
            </div>

            <div class="itemModal">
                <strong>Turma</strong>
                ${ocorrencia.serie || ocorrencia.turma || "-"}
            </div>

            <div class="itemModal">
                <strong>Disciplina</strong>
                ${ocorrencia.disciplina || "-"}
            </div>

            <div class="itemModal">
                <strong>Profissional CGM</strong>
                ${ocorrencia.profissional || "-"}
            </div>

            <div class="itemModal">
                <strong>Data</strong>
                ${formatarData(ocorrencia.data)}
            </div>

            <div class="itemModal">
                <strong>Tipo</strong>
                ${ocorrencia.tipo || "-"}
            </div>

            ${ocorrencia.motivo
                ? `
                    <div class="itemModal">
                        <strong>Motivo</strong>
                        ${ocorrencia.motivo}
                    </div>
                `
                : ""
            }

            <div class="itemModal">
                <strong>Fato observado</strong>
                ${ocorrencia.fato || "-"}
            </div>
        `;

        modalOcorrencia.classList.add("ativo");
    }

    if (fecharModal) {
        fecharModal.addEventListener("click", function () {
            modalOcorrencia.classList.remove("ativo");
        });
    }

    if (modalOcorrencia) {
        modalOcorrencia.addEventListener("click", function (event) {
            if (event.target === modalOcorrencia) {
                modalOcorrencia.classList.remove("ativo");
            }
        });
    }

    if (salvarStatus) {
        salvarStatus.addEventListener("click", function () {
            const ocorrencias = obterOcorrencias();

            if (indiceAtual === null) return;

            ocorrencias[indiceAtual].status = alterarStatus.value;

            localStorage.setItem(
                "ocorrencias",
                JSON.stringify(ocorrencias)
            );

            modalOcorrencia.classList.remove("ativo");

            renderizarTabela();
        });
    }

    botoesStatus.forEach(function (botao) {
        botao.addEventListener("click", function () {
            statusAtual = this.dataset.status;
            atualizarBotoesStatus();
            renderizarTabela();
        });
    });

    inputBusca.addEventListener("input", renderizarTabela);
    selectTurma.addEventListener("change", renderizarTabela);
    selectTipo.addEventListener("change", renderizarTabela);
    inputData.addEventListener("change", renderizarTabela);

    btnLimparFiltros.addEventListener("click", function () {
        inputBusca.value = "";
        selectTurma.value = "";
        selectTipo.value = "";
        inputData.value = "";

        statusAtual = "todas";

        atualizarBotoesStatus();
        renderizarTabela();
    });

    atualizarBotoesStatus();
    renderizarTabela();
});