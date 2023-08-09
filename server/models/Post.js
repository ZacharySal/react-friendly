import mongoose from "mongoose";

/* TODO: Create seperate model for comments, so we can have likes, replies */

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    location: String,
    content: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
        /* TODO: Look into mongoose type: map */
        type: Map,
        of: Boolean
    },
    comments: {
        type: Array,
        default: [],
    }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;