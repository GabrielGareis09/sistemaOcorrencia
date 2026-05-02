document.addEventListener("DOMContentLoaded", function () {
    const btnMenu = document.getElementById("btnMenu");
    const menuDropdown = document.getElementById("menuDropdown");

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

    const btnEnviar = document.querySelector(".btnEnviar");
    const btnLimpar = document.querySelector(".btnLimpar");

    const nomeInput = document.querySelector(".nomeEstudante input");
    const cgmInput = document.querySelector(".cgm input");
    const serieSelect = document.querySelector(".serieTurma select");
    const disciplinaSelect = document.querySelector(".disciplina select");
    const profissionalInput = document.querySelector(".profissionalCgm input");
    const dataInput = document.querySelector(".data input");
    const fatoTextarea = document.querySelector(".textareaFatoObservado textarea");

    console.log("Campos encontrados:", {
        btnEnviar,
        nomeInput,
        cgmInput,
        serieSelect,
        disciplinaSelect,
        profissionalInput,
        dataInput,
        fatoTextarea
    });

    if (cgmInput) {
        cgmInput.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "");
        });
    }

    function limparFormulario() {
        nomeInput.value = "";
        cgmInput.value = "";
        serieSelect.selectedIndex = 0;
        disciplinaSelect.selectedIndex = 0;
        profissionalInput.value = "";
        dataInput.value = "";
        fatoTextarea.value = "";
    }

    btnEnviar.addEventListener("click", function (event) {
        event.preventDefault();

        const nome = nomeInput.value.trim();
        const cgm = cgmInput.value.trim();
        const serie = serieSelect.selectedIndex === 0 ? "" : serieSelect.value;
        const disciplina = disciplinaSelect.selectedIndex === 0 ? "" : disciplinaSelect.value;
        const profissional = profissionalInput.value.trim();
        const data = dataInput.value;
        const fato = fatoTextarea.value.trim();

        if (!nome || !serie || !disciplina || !profissional || !data) {
            alert("Preencha os campos obrigatórios.");
            return;
        }

        const ocorrencia = {
            id: Date.now(),
            tipo: "Negativa",
            nome,
            cgm,
            serie,
            disciplina,
            profissional,
            data,
            fato,
            motivo: "",
            status: "Pendente"
        };

        const ocorrencias = JSON.parse(localStorage.getItem("ocorrencias")) || [];
        ocorrencias.push(ocorrencia);

        localStorage.setItem("ocorrencias", JSON.stringify(ocorrencias));

        console.log("Salvou:", ocorrencias);

        alert("Ocorrência salva com sucesso.");

        limparFormulario();
    });

    btnLimpar.addEventListener("click", function (event) {
        event.preventDefault();
        limparFormulario();
    });
});