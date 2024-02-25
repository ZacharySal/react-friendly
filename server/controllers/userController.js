import prisma from "../prisma/prisma.js";
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
