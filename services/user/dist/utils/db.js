import mongoose from "mongoose";
const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            dbName: "blog-microservice",
        });
        console.log("Database Connected");
    }
    catch (error) {
        console.log(error);
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map