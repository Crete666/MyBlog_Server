const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const port = 8080;
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post("/insertBoard", (req, res) => {
  const body = req.body;
  const { title, contents } = body;
  if (!title || !contents) {
    res.status(400).send("모든 필드를 입력하세요.");
  }
  models.Board.create({
    title,
    contents,
  })
    .then((result) => {
      console.log("게시글 등록 결과 : ", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("게시글 등록에 문제가 발생했습니다.");
    });
});

app.post("/insertProject", (req, res) => {
  const body = req.body;
  const { name, imageUrl, hubUrl } = body;
  if (!name || !imageUrl || !hubUrl) {
    res.status(400).send("모든 필드를 입력하세요.");
  }
  models.Project.create({
    name,
    imageUrl,
    hubUrl,
  })
    .then((result) => {
      console.log("프로젝트 등록 결과 : ", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("프로젝트 등록에 문제가 발생했습니다.");
    });
});

app.get("/boards", (req, res) => {
  models.Board.findAll({
    limit: 5,
    order: [["createdAt", "DESC"]],
    attributes: ["title", "createdAt", "id"],
  })
    .then((result) => {
      console.log("BOARD : ", result);
      res.send({
        board: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.send("게시글 불러오기 에러 발생");
    });
});

app.get("/boards/:id", (req, res) => {
  const params = req.params;
  const { id, eventId } = params;
  models.Board.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("BOARD : ", result);
      res.send({
        board: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.send("게시글 불러오기 에러 발생");
    });
});

app.get("/boardsRecently", async (req, res) => {
  var max = 0;
  await models.Board.max("id")
    .then((result) => {
      console.log("max id : ", result);
      max = result;
      console.log("max : ", max);
    })
    .catch((error) => {
      console.error(error);
    });
  models.Board.findOne({
    where: {
      id: parseInt(max),
    },
  })
    .then((result) => {
      console.log("BOARD : ", result);
      res.send({
        board: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.send("게시글 불러오기 에러 발생");
    });
});

app.get("/projects", (req, res) => {
  models.Project.findAll({
    limit: 5,
    order: [["createdAt", "DESC"]],
    attributes: ["name", "imageUrl", "hubUrl"],
  })
    .then((result) => {
      console.log("PROJECT : ", result);
      res.send({
        project: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.send("프로젝트 불러오기 에러 발생");
    });
});

app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path,
  });
});

app.listen(port, () => {
  console.log("서버 시작");
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB 연결 성공");
    })
    .catch((err) => {
      console.error(err);
      console.log("DB 연결 에러");
      process.exit();
    });
});
