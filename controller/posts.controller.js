const constants = require("../constants");
const mongoose = require("mongoose");
const createError = require("http-errors");
const mail = require("../services/mail.service");
const User = require("./../models/user.model");
const Post = require("./../models/posts.model");

let likesCounter = 0;

module.exports.doCreate = (req, res, next) => {
  const userId = req.params.userId;
  //1. FORMA LARGA
  
  User.findById(userId)
  .then(user => {
    if (user) {
      
      const post = new Post({ title: req.body.title, text: req.body.text, author: userId });
      
      post.save()
      .then(post => {
        res.redirect(`/${user._id}`);
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          Post.find({ author: userId })
          .then(posts => {
            
            res.render("users/profile", { user: user, errors: error.errors });
          });
        } else {
          next(error);
        }
      });
    } else{
      next(createError(404, 'user not found'));
    }
  })
  .catch(error => { 
    if (error instanceof mongoose.Error.CastError) {
      console.log('CAST ERROR');  
      next(createError(404, 'cast error'));
    } else {
      console.log('LAST ERROR'); 
      next(error);
    }
  });
  
  
  
  
  //2. REFRACTORIZADO SIN PROMISE.ALL, aqui en catch user tampoco existe!!!
  // User.findById(userId)
  // .then(user => {
  //   if (!user) {
  //     next(createError(404, 'user does not exist'));
  //   } else{
  
  //     let post = new Post({ title: req.body.title, text: req.body.text, author: userId });
  //     return post.save()
  //     .then(post => {
  //       res.redirect(`/${user._id}`);
  //     });
  //   }
  // })
  // .catch(error => {
  
  //   if (error instanceof mongoose.Error.ValidationError) {
  //     Post.find({ author: userId })
  //     .then(posts => {
  //       res.render("users/profile", { user: user,  errors: error.errors });
  //     });
  
  //   } else if(error instanceof mongoose.Error.CastError){
  //     next(createError(404, 'cast error'));
  //   } else {
  //     next(error);
  //   } 
  // });
  
  
  // 3. PROMISE.ALL aqui no puedo hacerla 
  
  
  
  
};















module.exports.doDelete = (req, res, next) => {
  const postId = req.params.postId;
  
  Post.findByIdAndRemove(postId)
  .then(post => {
    console.log("DO DELETE POST");
    res.redirect(`/${req.params.userId}`);
  })
  .catch(error => {
    if (error instanceof mongoose.Error.CastError) {
      next(createError(404));
    } else {
      next(error);
    }
  });
};

// module.exports.doUpdate = (req, res, next) => {
//   likesCounter++;
//   const id = req.params.id;

//   Post.findByIdAndUpdate(id, {$set:{likes:likesCounter}}, { runValidators: true, new: true })
//   .then(post =>{

//     if (post) {
//       console.log("POST UPDATED");
//       res.redirect(`/${id}`);
//     } else {     

//       next(createError(404, "Post not updated"));
//     }
//   })
//   .catch(error => {
//     console.log('2');

//     next(error);
//   });

// };




module.exports.update = (req, res, next) => {};
