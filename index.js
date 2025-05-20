//import
require('dotenv').config();
const express = require('express');
const app = express();
const routes =require('./app/routes/routes')
const cors = require('cors');
require('./app/models/index')

// const swaggerUi = require('swagger-ui-express');
// const swaggerJsdoc = require('swagger-jsdoc');
//const
const PORT=process.env.PORT

app.use(cors());
//use
app.use(express.json())
app.use('/',routes)



app.get('/', (req, res) => {
  res.send('Hello Express không cần package.json!');
});

app.listen(PORT, () => {
  console.log('Server chạy tại http://localhost:3000');
});
