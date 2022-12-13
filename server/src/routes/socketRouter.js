const userModel = require('../models/userModel')

module.exports = (io) => {
  
  io.on('connect', (socket) => {
    const get = async () => {
      const data = await userModel.find()
      return data
    }
    ///////////////
    // let interval
    // console.log('new connecttion')
    // if (interval) {
    //   clearInterval(interval);
    // }
    // interval = setInterval(() => getApiAndEmit(socket), 1000)
    // socket.on('disconnect', () => {
    //   console.log('disconnected')
    //   clearInterval(interval)
    // })

    // const getApiAndEmit = socket => {
    //   const response = new Date();
    //   socket.emit('fromAPI', response)
    // }
    //////////////
    let users = []
    setInterval(async () => {
    users = await userModel.find()
    }, 1000)
  
    socket.on('getData', async () => {
      get().then(value => {
        socket.emit('getData', 
        value) })
    })
  
    socket.on('getOne', async (data) => {
      get().then(value => {
        socket.emit('getOne', 
        value.filter((x) => x.username === data)) })
    })
  
    socket.on('uploadPicture', async (data) => {
      userModel.findOneAndUpdate({ 
        username: data.username }, 
        { $push: { pictures: data.newPicture } },
        function (error) {
          if (error) { console.log(error) }
          else console.log('picture uploaded') })
      get().then(value => {
        socket.emit('getData', value) })
    })
  
    socket.on('deletePicture', data => {
      userModel.findOneAndUpdate({ 
        username: data.username }, 
        { $pull: { pictures: data.picture } }, 
        function (error) { 
          if (error) { console.log(error) } 
          else console.log('picture deleted') })
      get().then(value => {
        socket.emit('getData', value) })
    })

    socket.on('dislike', data => {
      userModel.findOneAndUpdate({ 
        username: data[0] }, 
        { $push: { seen: data[1] } }, 
        function (error) { 
          if (error) { console.log(error) } 
          else console.log('user disliked') })
    })

    socket.on('like', data => {
      userModel.findOneAndUpdate({ 
        username: data[0] }, 
        { $push: { likes: data[1] } }, 
        function (error) { 
          if (error) { console.log(error) }
          else console.log('user liked') })
  
      userModel.findOneAndUpdate({ 
        username: data[0] },
        { $push: { seen: data[1] } }, 
        function (error) { 
          if (error) { console.log(error) } 
          else console.log('updated') })
    })
  
    socket.on('getUser', data => {
      const username = data[0]
      const user = users.filter((x) => x.username === username)
      if (user.length > 0) seenUsers = user[0].seen

      const preferences = data[1]
      let exceptMe = users.filter((x) => x.username !== username)
      if (preferences.city !== '') 
      { exceptMe = exceptMe.filter((x) => x.city === preferences.city) }
      if (preferences.sex !== '') 
      { exceptMe = exceptMe.filter((x) => x.sex === preferences.sex) }
      if (preferences.min !== '') 
      { exceptMe = exceptMe.filter((x) => x.age >= preferences.min) }
      if (preferences.max !== '') 
      { exceptMe = exceptMe.filter((x) => x.age <= preferences.max) }
      
      let seenUsers
      if (user.length > 0) seenUsers = user[0].seen
      else seenUsers = []
      const unseen = exceptMe.filter((x) => !seenUsers.includes(x.username))
      if (unseen.length === 0) {
        socket.emit('getUser', 'not found')
      } else (socket.emit('getUser', unseen[0]))
    })

  })  
}