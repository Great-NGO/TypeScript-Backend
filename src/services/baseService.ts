import { Model, Document, FilterQuery } from "mongoose";
import { translateError } from "../utils/translateError";

// Utility Type - Partial<T> makes all the properties in T optional
// The <T> specifies the type of data being returned - Model array or document e.g. User[] or User
// type ServiceResponse<T> = [success:boolean, data: T | null, message: string, statusCode: number];
type ServiceResponse<T> = [
    success: boolean,
    data: T | null,
    message: string,
    metadata: {
        status: number,
        metadata?: any
    }
];


type PaginationOptions = {
    page: number;
    limit: number;
}

type PaginatedData<T> = {
    data: T[],
    currentPage: number,
    totalCount: number,
    totalPages: number
}
// Abstract classes; methods are by default - protected
export abstract class BaseService<T extends Document> {
    protected model: Model<T>;
    protected defaultPageSize: number = 10;

    constructor(model: Model<T>) {
        this.model = model;
    }

    // Promise<ServiceResponse<T[]>> - For whichever sub class inherits this; it would return the associated type
    async getAll(): Promise<ServiceResponse<T[]>> {
        try {

            // Retrieve all data from database
            const foundAll = await this.model.find();
            return [true, foundAll, "All Data returned", { status: 200 }];

        } catch (error) {
            return [false, null, "Failed to get all", { status: 500 }];
        }
    }

    async getById(id: string | number): Promise<ServiceResponse<T>> {
        try {

            let data = await this.model.findById(id);
            if (data) {
                return [true, data, "Data returned successfully", { status: 200 }];
            }
            return [false, null, "Not found.", { status: 404 }];
        } catch (error) {
            return [false, null, translateError(error)[0], { status: 500 }];
        }
    }

    async getOne(queryCondition: any): Promise<ServiceResponse<T>> {
        try {

            const data = await this.model.findOne(queryCondition);
            if (data) {
                return [true, data, "Data returned successfully", { status: 200 }];
            }
            return [false, null, "Not found.", { status: 404 }];
        } catch (error) {
            return [false, null, translateError(error)[0], { status: 500 }]
        }
    }

    async create(data: Partial<T>): Promise<ServiceResponse<T>> {
        try {
            const createdData = await this.model.create(data);
            if (createdData) {
                return [true, createdData, 'Success', { status: 201 }];
            }
            return [false, null, 'Failed to create data', { status: 400 }];
        } catch (error) {
            return [false, null, translateError(error)[0], { status: 500 }];
        }
    }

    async update(id: string, data: Partial<T>): Promise<ServiceResponse<T>> {
        try {
            const updatedData = await this.model.findByIdAndUpdate(id, data, { new: true });
            if (updatedData) {
                return [true, updatedData, 'Update Success', { status: 200 }];
            }
            return [false, null, 'Update Failed', { status: 400 }];
        } catch (error) {
            return [false, null, `Failed to update data: ${translateError(error)[0]}`, { status: 500 }];

        }
    }

    async delete(id: string): Promise<ServiceResponse<T>> {
        try {
            const deletedData = await this.model.findByIdAndDelete(id);
            if (deletedData) {
                return [true, deletedData, 'Delete Successful', { status: 200 }];
            }
            return [false, null, 'Resource not found. Delete Failed!', { status: 404 }];
        } catch (error) {
            return [false, null, `Failed to delete data: ${translateError(error)[0]}`, { status: 500 }];

        }
    }

    /** findAllByCondition - Base Service class method that returns all data that match a particular condition */
    async findAllByCondition(query: FilterQuery<T>): Promise<ServiceResponse<T[]>> {
        try {
            const data = await this.model.find(query);
            return [true, data, 'Data retrieved successfully', { status: 200 }];
        } catch (error) {
            return [false, null, `Failed to retrieve data: ${translateError(error)[0]}`, { status: 500 }];

        }
    }

    async findAllPaginated(paginationOptions?: PaginationOptions): Promise<ServiceResponse<PaginatedData<T>>> {

        try {
            // Destructure the page and limit from the paginationOptions passed in else if none, destructure from empty object and assign default value of 1 and defaultpage size (behave like normal variable declarations and initializations)
            const { page = 1, limit = this.defaultPageSize } = paginationOptions || {}

            const totalCount = await this.model.countDocuments();
            const totalPages = Math.ceil(totalCount / limit);

            const data = await this.model.find().skip((page - 1) * limit).limit(limit);

            const paginatedData : PaginatedData<T> = {
                data, 
                currentPage: page,
                totalCount,
                totalPages
            };

            return [true, paginatedData, "Data returned successfully.", { status: 200 }];
        } catch (error) {
            return [false, null, `Failed to retrieve data: ${translateError(error)[0]}`, { status: 500 }];
        }
    }

    /** findAllByConditionPaginated - takes a query condition as a param, and an optional pagination option parameter as well. It returns a promise using our ServiceResponse type format which contains a type of Paginated Data */
    async findAllByConditionPaginated (query: FilterQuery<T>, paginationOptions?: PaginationOptions) : Promise <ServiceResponse<PaginatedData<T>>> {
        try {
            
            const { page = 1, limit = this.defaultPageSize } = paginationOptions || {};

            const totalCount = await this.model.countDocuments(query);
            const totalPages = Math.ceil(totalCount / limit);

            const data = await this.model.find(query).skip( (page - 1) * limit).limit(limit);

            const paginatedData : PaginatedData<T> = {
                data,
                currentPage:page,
                totalCount,
                totalPages
            };

            return [true, paginatedData, "Data returned successfully.", { status: 200 }];
        } catch (error) {
            return [false, null, `Failed to retrieve data: ${translateError(error)[0]}`, { status: 500 }];
            
        }
    }




}