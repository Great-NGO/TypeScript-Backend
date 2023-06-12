// Import the schema from the mongoose module
import mongoose, { Schema, InferSchemaType, Document, Types } from "mongoose";
const { ObjectId } = Schema.Types;

 interface ILecturer extends Document {
    firstname: string,
    lastname: string,
    password: string,
    staffId: Types.ObjectId,
    email: string,
    role: string
};

interface ILecturerLocation extends Document {
    lecturerId: Types.ObjectId,
    location: {
        type: string,
        coordinates: [number]
    },
    courseId: mongoose.ObjectId,
    courseCode: string,
    date: Date
};

const LecturerSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    staffId: { type: String, required: true, unique: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
        lowercase: true
    },
    role: {
        type: String,
        default: "lecturer",
        required: true
    }

}, { timestamps: true});

/** Lecturer Location Shema -  */
const LecturerLocationSchema = new Schema({
    lecturerId: { type: ObjectId, ref: "lecturer", required: true},
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    courseId: { type: ObjectId, ref: "course", required: true},
    courseCode: { type: String, required: true},
    date: { type: Date, default: Date.now }
}, { timestamps: true});

LecturerLocationSchema.index({ location: "2dsphere" });


export type TLecturer = InferSchemaType<typeof LecturerSchema>;
export type TLecturerLocation = InferSchemaType<typeof LecturerLocationSchema>;

const Lecturer = mongoose.model<TLecturer>("Lecturer", LecturerSchema);
const LecturerLocation = mongoose.model<TLecturerLocation>("LecturerLocation", LecturerLocationSchema);

export { Lecturer, LecturerLocation };
