import app from "./src/app.js";
import {connectDB} from "./config/database.js";
import {initUserModel} from "./src/models/user.model.js";
connectDB()
initUserModel()

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})