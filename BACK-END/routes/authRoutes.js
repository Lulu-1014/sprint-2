const express = require("express");

const authController = require("../controllers/authController");
const verificarToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/cadastro", authController.cadastrar);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.get("/perfil", verificarToken, authController.perfil);
router.get("/me", verificarToken, authController.me);
router.put("/perfil", verificarToken, authController.atualizarPerfil);

module.exports = router;



