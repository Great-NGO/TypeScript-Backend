// Import the schema from the mongoose module
import { model, Schema, InferSchemaType, Document, Types } from "mongoose";
const { ObjectId } = Schema.Types;

interface ISession extends Document {
    name: string,
    year: string,
    semesters: Types.Array<Types.ObjectId>,
    status: string
    startDate?: Date,
    endDate?: Date,

};

// const SessionSchema = new Schema<ISession>({
const SessionSchema = new Schema({
    name: { type: String, required: true },
    year: {
        type: String,
        required: true,
        unique: true,
        validate: {     //custom validator
            validator: (value: string) => {
                const pattern = /^20\d{2}\/20\d{2}$/;
                if(!pattern.test(value)){
                    return false;
                }

                const [startYear, endYear] = value.split('/');
                const firstYear = parseInt(startYear);
                const secondYear = parseInt(endYear);

                if(firstYear === secondYear - 1) {
                    return true;
                }

                return false;
            },
            message: 'Invalid session year format. Please use the format "YYYY/YYYY" '
        }
    },
    semesters: [{ type: ObjectId, ref: "semester" }],
    status: {
        type: String,
        enum: {
            values: ["ongoing", "paused", "closed"],
            message: '{VALUE} is not a valid session status'

        },
        default: "closed",
        required: true
    },
    startDate: { type: Date },
    endDate: { type: Date }


}, { timestamps: true });

export type TSession = InferSchemaType<typeof SessionSchema>;

const Session = model<TSession>("Session", SessionSchema);
export default Session;