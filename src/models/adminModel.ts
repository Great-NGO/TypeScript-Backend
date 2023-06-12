// Import the schema from the mongoose module
import mongoose, { Schema, InferSchemaType, Document, Types } from "mongoose";
const { ObjectId } = Schema.Types;

 interface IAdmin extends Document {
    firstname: string,
    lastname: string,
    password: string,
    adminId: string,
    email: string,
    role: string
};

// const AdminSchema = new Schema<IAdmin>({
const AdminSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    adminId: { type: String, required: true, unique: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
        lowercase: true
    },
    role: {
        type: String,
        default: "admin",
        required: true
    }

}, { timestamps: true});

export type TAdmin = InferSchemaType<typeof AdminSchema>;

const Admin = mongoose.model<TAdmin>("Admin", AdminSchema);

export default Admin;