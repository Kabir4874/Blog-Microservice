import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
    image: string;
    instagram: string;
    facebook: string;
    linkedin: string;
    bio: string;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=user.model.d.ts.map