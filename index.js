//import
require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./app/routes/auth.route')
const userRoutes=require('./app/routes/user.route')
const groupRoutes=require('./app/routes/group.route')
const groupMemberRoutes=require('./app/routes/group_member.route')

require('./app/models/index')
//const
const PORT=process.env.PORT


//use
app.use(express.json())
app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/groups',groupRoutes)
app.use('/api/group_member',groupMemberRoutes)


app.get('/', (req, res) => {
  res.send('Hello Express không cần package.json!');
});

app.listen(PORT, () => {
  console.log('Server chạy tại http://localhost:3000');
});
