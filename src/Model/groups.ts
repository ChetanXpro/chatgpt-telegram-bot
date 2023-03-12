
import mongoose from 'mongoose'


const Schema = new mongoose.Schema({
  groupId: { type: String },
  title: {
    type: String,
  },
});

const Group = mongoose.model("Groups", Schema);
export { Group }
