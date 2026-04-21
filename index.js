require("dotenv").config();

const express=require("express");
const http=require("http");
const { Server }=require("socket.io");
const path=require("path");
const jwt=require("jsonwebtoken");

const connectDB=require("./config/db");
const Message=require("./models/Message");

const app=express();
const server=http.createServer(app);

// SOCKET.IO
const io=new Server(server, {
  cors: {
    origin: "*",
  },
});

connectDB();

app.use(express.json());

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/messages", require("./routes/messagesRoutes"));

// STATIC FILES
app.use(express.static(path.join(__dirname, "public")));

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


// SOCKET AUTH MIDDLEWARE
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("No token"));
  }

  try {
    const decoded=jwt.verify(token, process.env.JWT_SECRET); 
    socket.user={
      id: decoded.id || decoded.userId,
    };

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message); 
    return next(new Error("Authentication error"));
  }
});


//SOCKET LOGIC
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.id}`);

  socket.on("send message", async (data) => {
    try {
      if (!data.message || data.message.trim()==="") return;

      const message = await Message.create({
        sender: socket.user.id,
        content: data.message,
      });

      const populated = await message.populate("sender", "username");

      socket.broadcast.emit("receive message", populated);
      socket.emit("receive message", populated);

    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user.id}`);
  });


  // TODO: Add Redis caching for messages
});

const PORT=process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});