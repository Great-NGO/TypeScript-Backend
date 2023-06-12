// Import the schema from the mongoose module
import mongoose, { model, Schema, InferSchemaType, Document, Types } from "mongoose";
const { ObjectId } = Schema.Types;

interface ICourse extends Document {
    lecturers: Types.Array<Types.ObjectId>,
    courseTitle: string,
    courseCode: string,
    department: string,
    // dept: Types.ObjectId,    //If Department was a table/model of its own
    // takenBy?: Types.Array<Types.ObjectId>,
    // semester: Types.ObjectId

};

const CourseSchema = new Schema({
    lecturers: [{ type: ObjectId, ref: "lecturer" }],
    courseTitle: { type: String, required: true },
    courseCode: { type: String, required: true },
    department: { type: String, required: true },
    // dept: { type: ObjectId, ref: "department"},
    // takenBy: [ { type: ObjectId, ref: "student" }],     //Students Offering course
    // semester: { type:ObjectId, ref: "semester"},    //The Semester the course belongs to

}, { timestamps: true });

interface ICourseInstance {
    course: Types.ObjectId,
    courseCode: string,
    semester: number,
    semesterId: Types.ObjectId,
    session: string,
    sessionId: Types.ObjectId,
    lecturerId: Types.ObjectId,
    isAttendanceEnabled: boolean,
    enrollmentCode: string,
    enrollmentExpiration ?: Date,
    students?: Types.Array<Types.ObjectId>
}

// const CourseInstanceSchema = new Schema<ICourseInstance>({
const CourseInstanceSchema = new Schema({
    courseId: { type: ObjectId, ref: "course", required: true },
    courseCode: { type: String, required: true },
    semester: { type: Number, required: true },
    semesterId: { type: ObjectId, ref: "semester", required: true },
    session: { type: String, required: true },
    sessionId: { type: ObjectId, ref: "session", required: true },
    lecturerId: { type: ObjectId, ref: "lecturer", required: true },
    isAttendanceEnabled: { type: Boolean, default: false },
    // Unique Enrollment Code and expiration time which can be set by the lecturer
    enrollmentCode: { type: String, required: true, unique: true },
    enrollmentExpiration : { type: Date },
    students: [{ type: ObjectId, ref: "student" }]

}, { timestamps: true });




export type TCourse = InferSchemaType<typeof CourseSchema>;
export type TCourseInstance = InferSchemaType<typeof CourseInstanceSchema>;

const Course = mongoose.model<TCourse>("Course", CourseSchema);
const CourseInstance = model<TCourseInstance>("CourseInstance", CourseInstanceSchema);
// const CourseInstance = model<ICourseInstance>("CourseInstance", CourseInstanceSchema);

export { Course, CourseInstance };