require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const morgan = require('morgan');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');
const fileUpload = require('express-fileupload');
const cloudinary= require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_API_SECRET
});

const cookieParser = require('cookie-parser');

//Swagger
const swagger = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

//middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileUpload({useTempFiles:true}));
// routes
app.get('/',(req,res)=>{
    res.send('E-commerce');
});
app.use('/api-docs',swagger.serve,swagger.setup(swaggerDocument));
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/products',productRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/orders',orderRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

//start function 
const start = async()=>{
    await connectDB(process.env.MONGO_URI).then(()=>console.log('connected to Database...'))
    app.listen(process.env.PORT,()=>console.log(`listening to port ${process.env.PORT}...`));
}

start();