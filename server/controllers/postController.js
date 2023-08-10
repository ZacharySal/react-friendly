import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
    try {
        const { userId, location, content, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            location: location ? location : user.location,
            content,
            picturePath,
            likes: {},
            comments: [],
        });

        await newPost.save();
        const allPosts = await Post.find();
        // TODO: why are we sending back all posts?
        res.status(201).json(allPosts);
    } catch (err) {
        res.status(409).json({ msg: err.message });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const allPosts = await Post.find();
        res.status(200).json(allPosts);
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const userPosts = await Post.find({ userId });
        res.status(200).json(userPosts);
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(postId);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, { likes: post.likes }, { new: true });
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
};

export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, content } = req.body;
        console.log(req.body);
        const newComment = new Comment({
            userId,
            postId,
            content,
            likes: {},
        });
        await newComment.save();

        const post = await Post.findById(postId);
        post.comments.push(newComment._id);
        await post.save();
        res.status(201).json(post);

    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
};

export const likeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body;
        console.log(req.body);

        const comment = await Comment.findById(commentId);
        const isLiked = comment.likes.get(userId);

        if (isLiked) {
            comment.likes.delete(userId);
        } else {
            comment.likes.set(userId, true);
        }

        await comment.save();
        res.status(201).json(comment);

    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
};

// export const addCommentReply = async (req, res) => {
//     try {
//         const { postId } = req.params;
//         const { userId, content } = req.body;
//         console.log(req.body);
//         const newComment = new Comment({
//             userId,
//             postId,
//             content,
//             likes: {},
//             replies: [],
//         });
//         await newComment.save();

//         const post = await Post.findById(postId);
//         post.comments.push(newComment._id);
//         await post.save();
//         res.status(201).json(post);

//     } catch (err) {
//         res.status(404).json({ msg: err.message });
//     }
// };