const express =  require('express');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors =  require('cors');

const app  = express();
const routes =  require('./routes');
const config = require('./config/config');


// parse json request body

// parse urlencoded request body
app.use(express.json());
const corsOptions ={
  origin:[config.frontendUrl,"http://localhost:3001","http://localhost:3000"],
  credentials:true,
  optionSuccessStatus:200,
  allowedHeaders: ['Content-Type','Authorization','x-csrf-token'],
}
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())
app.use(express.urlencoded({ extended: true }));


app.use('/api',routes);
app.use('/',(req,res)=>{
  res.json({status:"home page"});
})
module.exports = app;
