const express = require("express");
const postController = require("../controllers/postController");
const verificarToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", verificarToken, postController.listar);
router.post("/", verificarToken, postController.criar);
router.post("/:id/curtir", verificarToken, postController.curtir);
router.delete("/:id", verificarToken, postController.deletar);

router.post(
  "/:id/comentarios",
  verificarToken,
  postController.criarComentario
);

router.get(
  "/:id/comentarios",
  verificarToken,
  postController.listarComentarios
);

router.put(
  "/:id/comentarios/:comentarioId",
  verificarToken,
  postController.atualizarComentario
);

router.delete(
  "/:id/comentarios/:comentarioId",
  verificarToken,
  postController.deletarComentario
);


module.exports = router;