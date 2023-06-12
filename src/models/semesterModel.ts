// Import the schema from the mongoose module
import mongoose, { Schema, InferSchemaType, Document, Types } from "mongoose";
const { ObjectId } = Schema.Types;

interface ISemester extends Document {
    number: number,
    semester: number,
    name: string,    
    sessionId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
    status: string
 
};

// const SemesterSchema = new Schema<ISemester>({
const SemesterSchema = new Schema({
    number: {
        type: Number,
        required: true,
        enum: {
            values: [1, 2, 3],
            message: '{VALUE} is not a valid semester number. Enter 1 for first semester, 2 for second semester, 3 for third semester or any other semester.'
        }
    },
    semester: {
        type: Number,
        required: true,
        enum: {
            values: [1, 2, 3],
            message: '{VALUE} is not a valid semester number. Enter 1 for first semester, 2 for second semester, 3 for third semester or any other semester.'
        }
    },
    name: { type: String, required: true },
    sessionId: { type: ObjectId, ref: "session", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
        type: String,
        enum: {
            values: ["ongoing", "paused", "closed"],
            message: '{VALUE} is not a valid semester status'

        },
        default: "closed",
        required: true
    }

}, { timestamps: true });

export type TSemester = InferSchemaType<typeof SemesterSchema>;

const Semester = mongoose.model<TSemester>("Semester", SemesterSchema);

export default Semester;