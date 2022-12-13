const mongoose = require('mongoose')
const { Schema } = mongoose

const userModel = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String,
  city: String,
  sex: String,
  age: Number,
  pictures: {
    type: Array,
    default: ['https://cdn.drawception.com/images/panels/2018/5-11/D3PF2PRMMs-2.png']
  },
  likes: Array,
  dislikes: Array,
  seen: Array
})

module.exports = mongoose.model('User', userModel)
