import mongoose from "mongoose"


const Schema = new mongoose.Schema({
    userId: { type: String, index: true },
    username: {
        type: String,
    },
    name: {
        type: String,
    },
    member_left: {
        type: Boolean,
    },
});

const OpenAiGroup = mongoose.model("OpenAiGroup", Schema);

export { OpenAiGroup }