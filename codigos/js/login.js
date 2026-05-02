const senhasPermitidas = [
  "Gareis6",
  "Caio3",
  "Humberto7",
  "Luis10",
  "secretaria123"
];

const inputSenha = document.getElementById("senha");
const botaoEntrar = document.getElementById("btnEntrar");

function fazerLogin() {
  const senhaDigitada = inputSenha.value.trim();

  if (senhasPermitidas.includes(senhaDigitada)) {
    localStorage.setItem("autenticado", "true");
    localStorage.setItem("senhaAtual", senhaDigitada);

    window.location.href = "../html/escolha.html";
    return;
  }

  alert("Senha inválida.");
  inputSenha.value = "";
  inputSenha.focus();
}

botaoEntrar.addEventListener("click", fazerLogin);

inputSenha.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    fazerLogin();
  }
});

const toggleSenha = document.getElementById("toggleSenha");
const iconEye = document.getElementById("iconEye");

let visivel = false;

toggleSenha.addEventListener("click", () => {
  visivel = !visivel;

  if (visivel) {
    inputSenha.type = "text";

    // olho fechado
    iconEye.innerHTML = `
      <path d="M3 3l18 18" stroke="black" stroke-width="2"/>
      <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-1.2" stroke="black" stroke-width="2"/>
      <path d="M9.9 4.2A10.4 10.4 0 0 1 12 4c6.5 0 10 8 10 8a18.3 18.3 0 0 1-4.2 5.2" stroke="black" stroke-width="2"/>
      <path d="M6.1 6.1C3.6 8 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.3 4.6-.8" stroke="black" stroke-width="2"/>
    `;
  } else {
    inputSenha.type = "password";

    // olho aberto
    iconEye.innerHTML = `
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="black" stroke-width="2"/>
      <circle cx="12" cy="12" r="3" stroke="black" stroke-width="2"/>
    `;
  }
});
