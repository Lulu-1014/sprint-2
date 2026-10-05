const express = require("express");
const postController = require("../controllers/postController");
const verificarToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", verificarToken, postController.listar);
router.post("/", verificarToken, postController.criar);
router.post("/:id/curtir", verificarToken, postController.curtir);
router.post("/:id/comentarios", verificarToken, postController.criarComentario);
router.get("/:id/comentarios", verificarToken, postController.listarComentarios);

module.exports = router;