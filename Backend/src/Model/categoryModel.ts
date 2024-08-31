import mongoose, { Document, Schema } from "mongoose";

interface ICategory extends Document {
    name: string;
}

const CategorySchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;