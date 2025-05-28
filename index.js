//import
require('dotenv').config();
const express = require('express');
const app = express();
const routes =require('./app/routes/routes')
const cors = require('cors');
require('./app/models/index')

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
//const
const PORT=process.env.PORT

app.use(cors());
//use
app.use(express.json())
app.use('/',routes)

const options={
  definition:{
    openapi:"3.0.0",
    info:{
      title:"Test API",
      version :"0.1",
    },
    servers:[
      {
        url:"http://localhost:3009/",
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis:["./app/routes/*.js"]
}

const spacs = swaggerJsdoc(options)
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(spacs))


app.listen(PORT, () => {
  console.log('Server chạy tại http://localhost:3000');
});
