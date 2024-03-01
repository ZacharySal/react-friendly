import prisma from "../prisma/prisma.js";
import { uploadFile } from "../s3.js";
import { postIncludeOptions } from "./postController.js";
export const getUserInfo = async (req, res) => {
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
        posts: {
          include: postIncludeOptions,
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

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    // if record already exists in table (they are friends), remove both, otherwise add both

    const isFriends = await prisma.friends.findFirst({
      where: {
        user_id: id,
        friend_id: friendId,
      },
    });

    if (isFriends) {
      // delete both records
      await prisma.friends.delete({
        where: {
          friends: {
            user_id: id,
            friend_id: friendId,
          },
        },
      });
      await prisma.friends.delete({
        where: {
          friends: {
            user_id: friendId,
            friend_id: id,
          },
        },
      });
    } else {
      // add both records
      await prisma.friends.createMany({
        data: [
          { user_id: id, friend_id: friendId },
          { user_id: friendId, friend_id: id },
        ],
      });
    }

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
        posts: true,
      },
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { profile_image, banner_image, biography, location } = req.body;

    console.log(id);

    let profile_image_upload = null;
    let banner_image_upload = null;

    if (profile_image != null) {
      profile_image_upload = await uploadFile(profile_image, true);
      console.log(profile_image_upload);
    }

    if (banner_image != null) {
      banner_image_upload = await uploadFile(profile_image, true);
      console.log(banner_image_upload);
    }

    // const new_user_data = {};

    // if (profile_image_upload) new_user_data["profile_img_key"] = profile_image_upload.Key;
    // if (banner_image_upload) new_user_data["banner_img_key"] = banner_image_upload.Key;
    // if (biography) new_user_data["biography"] = biography;
    // if (location) new_user_data["location"] = location;

    // console.log(new_user_data);

    const u = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    console.log(u);

    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        profile_img_key: profile_image_upload.Key,
        banner_img_key: banner_image_upload.Key,
        biography: biography,
        location: location,
      },
    });

    console.log(user);

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};
