// Import the schema from the mongoose module
import mongoose, { Schema, InferSchemaType, Document } from "mongoose";
const { ObjectId } = Schema.Types;

 interface IStudent extends Document {
    firstname: string,
    lastname: string,
    password: string,
    matricNum: string,
    email: string,
    role: string,
    level?: number,
    department?: string,
    courses?: [ mongoose.ObjectId ],
    profilePicture ?: string,
    profilePicturePublicId ?: string

};

const StudentSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    matricNum: { type: String, required: true, unique: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
        lowercase: true
    },
    role: {
        type: String,
        default: "student",
        required: true
    },
    level: { type: Number },
    department: { type: String },
    courses: [ { type: ObjectId, ref: "course"}],
    profilePicture: { type: String},
    profilePicturePublicId: { type: String }

}, { timestamps: true});

export type TStudent = InferSchemaType<typeof StudentSchema>;

const Student = mongoose.model<TStudent>("Student", StudentSchema);

export default Student;