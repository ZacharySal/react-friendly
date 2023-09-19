import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    location: String,
    content: String,
    pictureKey: String,
    likes: {
        type: Map,
        of: Boolean
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Comment",
        default: [],
    }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;