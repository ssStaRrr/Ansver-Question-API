const express=require("express");
const dotenv=require("dotenv");
const connectDatabase = require("./helpers/database/connectDatabase");
const customerErrorHandler = require("./middlewares/errors/customErrorHandler");
const routers = require("./routers");
const path = require("path");     //Express'in kendi paketi.
 

//Environment Variables
dotenv.config({
    path:"./config/env/config.env"
});

//MongoDb Connection

connectDatabase();
const app=express();

//Express - Body Middleware         //Expressin gövde işlemlerini oluşturan arayazılım 
app.use(express.json());           //Kullanıcı kaydı yaparken Json verisini Post edebilmek için Express'in fonksiyonunu kullanıyoruz.
const PORT=process.env.PORT;

//Routers Middleware
app.use("/api",routers);            //Router objemizi express modulünde /api yolunda dahil ediyor.
app.use(customerErrorHandler);

//Static Files
app.use(express.static(path.join(__dirname,"public")));   //__dirname = default path'imiz. yanı projeyi gösteren ana path. public dosyası altındaki static dosyamıza erişmek için path'imizi publicle join ile birleştiriyoruz.

app.listen(PORT,()=>{
    console.log("listening port : " + PORT +" "+ process.env.NODE_ENV);
})