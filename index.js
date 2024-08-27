const express=require('express')
const app = express();
const databse=require('./database/db_conect')
const userRouter=require('./Routers/userRoute')
app.use(express.json())
app.use('/',userRouter)





const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});