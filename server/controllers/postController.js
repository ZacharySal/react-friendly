import prisma from "../prisma/prisma.js";
import { deleteFileByKey } from "../s3.js";

export const createPost = async (req, res) => {
  try {
    const { user_id, content, parent_id, isRepost, gif_url } = req.body;
    console.log(user_id, content, parent_id, isRepost, gif_url);
    const attachment_key = req?.file?.key ?? gif_url;
    console.log(attachment_key);
    const post = await prisma.post.create({
      data: {
        author_id: user_id,
        attachment_key: attachment_key,
        content: content,
        isRepost: isRepost === "true" ? true : false,
        parent_id: parent_id ? parent_id : null,
      },
    });

    console.log(post);
    res.status(201).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(409).json({ msg: err.message });
  }
};

export const getImage = async (req, res) => {
  try {
    const key = req.params.key;
    if (key != "null") {
      const readStream = getFileStream(key);
      readStream.pipe(res);
    } else {
      throw new Error("No key provided");
    }
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await prisma.post.findMany({
      include: postIncludeOptions,
      orderBy: {
        created_at: "desc",
      },
    });
    res.status(200).json(allPosts);
  } catch (err) {
    console.error(err.message);
    res.status(404).json({ msg: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const { post_id } = req.params;

    // TODO get parent posts with recursive cte
    const parent_ids = await prisma.$queryRawUnsafe(
      `WITH RECURSIVE parent_posts(id, parent_id, created_at) AS (
        SELECT id, parent_id, created_at from "Post" c WHERE id = $1
        UNION ALL
          SELECT p.id, p.parent_id, p.created_at
          from parent_posts po, "Post" p 
          WHERE p.id = po.parent_id
      )
      select id, created_at from parent_posts p where p.id != $2
      order by created_at`,
      post_id,
      post_id
    );

    const parent_posts = await Promise.all(
      parent_ids.map((parent) =>
        prisma.post.findUnique({
          where: {
            id: parent.id,
          },
          include: postIncludeOptions,
        })
      )
    );

    const post = await prisma.post.findUnique({
      where: {
        id: post_id,
      },
      include: postIncludeOptions,
    });
    res.status(200).json({ post, parent_posts });
  } catch (err) {
    console.error(err.message);
    res.status(404).json({ msg: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { user_id } = req.params;
    //const userPosts = await Post.find({ user_id }).populate("comments").sort("-createdAt").exec();
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      include: {
        posts: {
          include: postIncludeOptions,
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    res.status(200).json(user.posts);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { user_id } = req.body;

    // if record exists in post likes table, remove it, otherwise add it

    const likedPost = await prisma.postLikes.findFirst({
      where: {
        user_id: user_id,
        post_id: post_id,
      },
    });

    if (likedPost) {
      await prisma.postLikes.delete({
        where: {
          postLikes: {
            user_id: user_id,
            post_id: post_id,
          },
        },
      });
    } else {
      await prisma.postLikes.create({
        data: {
          user_id: user_id,
          post_id: post_id,
        },
      });
    }

    const updatedPost = await prisma.post.findUnique({
      where: {
        id: post_id,
      },
      include: postIncludeOptions,
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(404).json({ msg: err.message });
  }
};

export const savePost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { user_id } = req.body;

    // if record exists in post saves table, remove it, otherwise add it

    const savedPost = await prisma.postSaves.findFirst({
      where: {
        user_id: user_id,
        post_id: post_id,
      },
    });

    if (savedPost) {
      await prisma.postSaves.delete({
        where: {
          postSaves: {
            user_id: user_id,
            post_id: post_id,
          },
        },
      });
    } else {
      await prisma.postSaves.create({
        data: {
          user_id: user_id,
          post_id: post_id,
        },
      });
    }
    const updatedPost = await prisma.post.findUnique({
      where: {
        id: post_id,
      },
      include: postIncludeOptions,
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(404).json({ msg: err.message });
  }
};

export const deletePost = async (req, res) => {
  // we need to remove post from database and also remove the image from aws
  const { post_id } = req.params;

  try {
    const delete_post = await prisma.post.delete({
      where: {
        id: post_id,
      },
    });
    if (delete_post.picture_key) {
      // remove image from s3 bucket
      const response = await deleteFileByKey(delete_post.picture_key);
      console.log(response);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    res.status(404).json({ msg: err.message });
  }
};

export const postIncludeOptions = {
  author: true,
  parent: {
    include: {
      author: true,
      likes: true,
      saves: true,
      children: true,
    },
  },
  likes: true,
  saves: true,
  children: {
    include: {
      author: true,
      likes: true,
      saves: true,
    },
    orderBy: {
      created_at: "asc",
    },
  },
};
