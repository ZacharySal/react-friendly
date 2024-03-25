import prisma from "../prisma/prisma.js";
import { deleteFileByKey } from "../s3.js";
import { postIncludeOptions } from "./postController.js";

export const getUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        followers: true,
        following: true,
        posts: {
          include: postIncludeOptions,
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(404).json({ msg: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        friends: {
          include: {
            friend: true,
          },
        },
      },
    });

    res.status(200).json(user.friends);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const getUserMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        posts: {
          include: postIncludeOptions,
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });

    const userMedia = user.posts
      .map((post) => {
        if (post.attachment_key) {
          return post.attachment_key;
        }
      })
      .filter(Boolean);

    res.status(200).json(userMedia);
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ msg: err.message });
  }
};

export const getUserSavedPosts = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        savedPosts: {
          include: {
            post: {
              include: postIncludeOptions,
            },
          },
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });

    res.status(200).json(user.savedPosts);
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ msg: err.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id, followeeId } = req.params;

    // if record already exists in table (they are friends), remove both, otherwise add both

    const isFollowing = await prisma.followers.findFirst({
      where: {
        follower_id: id,
        followee_id: followeeId,
      },
    });

    if (isFollowing) {
      await prisma.followers.delete({
        where: {
          followers: {
            follower_id: id,
            followee_id: followeeId,
          },
        },
      });
    } else {
      // add both records
      await prisma.followers.create({
        data: { follower_id: id, followee_id: followeeId },
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        followers: true,
        following: true,
        posts: {
          include: postIncludeOptions,
        },
      },
    });

    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ msg: err.message });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { biography, location } = req.body;
    const files = req.files;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (files?.profile_image) {
      //await fs.remove(files.profile_image[0].path);
      if (user.profile_img_key && user.profile_img_key != "1711340915231") {
        await deleteFileByKey(user.profile_img_key);
      }
    }
    if (files?.banner_image) {
      //await fs.remove(files.banner_image[0].path);
      if (user.banner_img_key && user.banner_img_key != "1711340915296") {
        await deleteFileByKey(user.banner_img_key);
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        profile_img_key: files?.profile_image?.[0]?.key ?? user.profile_img_key,
        banner_img_key: files?.banner_image?.[0]?.key ?? user.banner_img_key,
        biography: biography === "null" ? user.biography : biography,
        location: location === "null" ? user.location : location,
      },
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(404).json({ msg: err.message });
  }
};

export const getUserFeed = async (req, res) => {
  try {
    const { id } = req.params;

    const usersFollowed = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        following: true,
      },
    });

    const usersFollowedPosts = await Promise.all(
      usersFollowed?.following?.map(async (user) => {
        return await prisma.post.findMany({
          where: {
            author_id: user.followee_id,
          },
          include: postIncludeOptions,
        });
      })
    );

    res.status(200).json(usersFollowedPosts.flat(Infinity).reverse());
  } catch (err) {
    console.log(err);
    res.status(404).json({ msg: err.message });
  }
};
