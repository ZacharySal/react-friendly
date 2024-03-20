import { S3Client } from "@aws-sdk/client-s3";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { register } from "./controllers/authController.js";
import { createPost } from "./controllers/postController.js";
import { updateUserInfo } from "./controllers/userController.js";
import { verifyToken } from "./middleware/authorizeUser.js";
import prisma from "./prisma/prisma.js";
import authRouter from "./routes/authRouter.js";
import imageRouter from "./routes/imageRouter.js";
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
//const upload = multer({ dest: "image_uploads/", limits: { fieldSize: 100 * 1024 * 1024 } });
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
});

const upload = multer({
  storage: multerS3({
    s3: client,
    bucket: bucketName,
    contentType: function (req, file, cb) {
      const mime = "application/octet-stream";
      const outStream = sharp().webp({ quality: 40 }).rotate();
      file.stream.pipe(outStream);

      cb(null, mime, outStream);
    },
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("attachment"), createPost);

app.patch(
  "/user/:id",
  verifyToken,
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "banner_image", maxCount: 1 },
  ]),
  updateUserInfo
);

/* ROUTES */
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/image", imageRouter);

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
