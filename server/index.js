import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/authController.js";
import { createPost } from "./controllers/postController.js";
import { updateUserInfo } from "./controllers/userController.js";
import { verifyToken } from "./middleware/authorizeUser.js";
import prisma from "./prisma/prisma.js";
import authRouter from "./routes/authRouter.js";
import postRouter from "./routes/postRouter.js";
import userRouter from "./routes/userRouter.js";

/* CONFIG */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({ origin: "*" }));

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE*/
const upload = multer({ dest: "image_uploads/", limits: { fieldSize: 100 * 1024 * 1024 } });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.patch("/user/:id", verifyToken, upload.single("picture"), updateUserInfo);

// app.post("/testing", verifyToken, upload.single("picture"), async function (req, res, next) {
//   // req.file is the `profile-file` file
//   // req.body will hold the text fields, if there were any
//   if (req.file) {
//     const file = req.file;
//     let result = await uploadFile(file);
//     console.log(result);
//   }

//   return res.status(200);
// });

/* ROUTES */
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);

const PORT = process.env.PORT || 6001;

async function main() {
  await prisma.$connect();
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
