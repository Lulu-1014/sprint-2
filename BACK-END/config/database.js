// const mysql = require("mysql2/promise");
// const { inicializarBanco } = require("./initDb");

// const conexao = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "",
//   database: process.env.DB_NAME || "never_alone",
//   waitForConnections: true,
//   connectionLimit: 10
// });

// async function testarConexao() {
//   await inicializarBanco();
//   const connection = await conexao.getConnection();
//   console.log("Conectado ao MySQL com sucesso!");
//   connection.release();
// }

// module.exports = {
//   conexao,
//   testarConexao
// };
const mysql = require("mysql2/promise");
const { inicializarBanco } = require("./initDb");

const conexao = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "never_alone",
  waitForConnections: true,
  connectionLimit: 10
});

async function testarConexao() {
  await inicializarBanco();
  const connection = await conexao.getConnection();
  console.log("Conectado ao MySQL com sucesso!");
  connection.release();
}

module.exports = {
  conexao,
  testarConexao
};