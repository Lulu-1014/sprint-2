require("dotenv").config();

const app = require("./app");
const { testarConexao } = require("./config/database");

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    await testarConexao();

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (erro) {
    console.error("Não foi possível iniciar o servidor.");
    console.error(erro.message);
  }
}

iniciarServidor();
