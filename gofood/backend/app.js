import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true, // Allow cookies to be sent
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Router Importion
import userRoutes from "./routes/user.routes.js";
import displayDataRoutes from "./routes/displayData.routes.js";

// Router declaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/home", displayDataRoutes);
// app.use("/api/v2/products", productRoutes);

export default app;
