import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const maskSensitiveFields = (value) => {
  if (!value || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(maskSensitiveFields);
  }

  const masked = {};
  for (const [key, val] of Object.entries(value)) {
    if (["password", "token"].includes(key.toLowerCase())) {
      masked[key] = "***";
    } else {
      masked[key] = maskSensitiveFields(val);
    }
  }

  return masked;
};

const app = express()

app.use(cors({
  origin: "http://localhost:3002",
  credentials: true,
}));

app.use(express.json())

app.use((req, res, next) => {
  const startedAt = Date.now();
  let responsePayload;

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    responsePayload = body;
    return originalJson(body);
  };

  const originalSend = res.send.bind(res);
  res.send = (body) => {
    if (responsePayload === undefined) {
      responsePayload = body;
    }
    return originalSend(body);
  };

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    const payloadForLog = maskSensitiveFields(responsePayload);
    const payloadSuffix = payloadForLog !== undefined
      ? ` | response=${JSON.stringify(payloadForLog)}`
      : "";

    console.log(
      `[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs}ms)${payloadSuffix}`
    );
  });

  next();
});


app.use("/api/auth",authRoutes)


app.get("/",(req,res)=>{
    res.send("Welcome to the UBER EATS Auth Service")
})

export default app;


