// Import the schema from the mongoose module
import mongoose, { Schema, InferSchemaType, Document, Types } from "mongoose";
const { ObjectId } = Schema.Types;

 interface IAttendance extends Document {
    courseInstance: Types.ObjectId,
    studentId: Types.ObjectId,
    studentPicture: string,
    studentPicturePublicId: string,
    studentLocation: {
        type: string,
        coordinates: [number]
    }

};

const AttendanceSchema = new Schema({
    courseInstance: { type: ObjectId, ref: "courseinstance", required: true},
    studentId: { type: ObjectId, ref: "student", required: true},
    studentPicture: { type: String, required: true },
    studentPicturePublicId: { type: String, required: true },
    studentLocation: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }

}, { timestamps: true});

AttendanceSchema.index({ studentLocation: "2dsphere" });

export type TAttendance = InferSchemaType<typeof AttendanceSchema>;

const Attendance = mongoose.model<TAttendance>("Admin", AttendanceSchema);

export default Attendance;