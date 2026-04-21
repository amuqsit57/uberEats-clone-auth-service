import dotenv from "dotenv";
import app from "./app.js"
import prisma from "./config/prisma.js";


dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection failed", err);
        process.exit(1);
    }

    app.listen(PORT,()=>{

        console.log(`Server is running on port ${PORT}`);
    })
};

startServer();