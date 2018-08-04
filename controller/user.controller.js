const constants = require("../constants");
const mongoose = require("mongoose");
const createError = require("http-errors");
const mail = require("../services/mail.service");
const User = require("./../models/user.model");
const Post = require("./../models/posts.model");
const Friendship = require("./../models/frienship.model");

module.exports.create = (req, res, next) => {
  res.render("users/create");
};

module.exports.doCreate = (req, res, next) => {
  
  User.findOne({ email: req.body.email })
  .then(user => {
    if (user) {
      res.render("users/create", { user: req.body, errors: { email: "user exists" } });
    } else {
      user = new User(req.body);
      return user.save()
      .then(user => {
        mail.sendToken(user);
        
        console.log("USER SAVED");
        res.redirect("/sessions/create");
      });
    }
  })
  .catch(error => { 
    if (error instanceof mongoose.Error.CastError) {
      next(createError(404, "cast error"));
    } else if (error instanceof mongoose.Error.ValidationError) {
      res.render("users/create", {
        user: req.body,
        errors: error.errors
      });
    } else {
      next(error);
    }
  });
};

module.exports.profile = (req, res, next) => {
  
  const userId = req.params.id; 
  
  //PRIMERA FORMA (EL ELSE SI HACE FALTA NO? / hacer render no 
  //despues del return sino en otro then principal, que ees mejor? pero USER no existira)
  
  // User.findById(userId)
  // .then(user =>{
  //   if (user) {
  //     return Post.find({author: userId})
  //     .then(posts =>{
  //       res.render("users/profile", { user: user, posts: posts });
  //     });
  //   } else{
  //     //ESTO ESTA MAL HAGO USER NO EXISTE, hago un return para que vaya al catch compartido? 
  //     next(createError(404, 'user does not exist'));
  //   }
  // })
  // //// .then(posts =>{    
  // ////   res.render("users/profile", { user: user, posts: posts });
  // //// })
  // .catch(error =>{
  //   if (error instanceof mongoose.Error.CastError) {
  //     next(createError(404));
  //   } else {
  //     next(error);
  //   }
  // });
  
  
  // SEGUNDA FORMA
  // User.findById(userId)
  // .then(user =>{
  //   if (user) {
  //     return Post.find({author: userId})
  //   } else{
  //     throw createError(404);
  //   }
  // })
  // .then(posts => {
  //   res.render("users/profile", { user: user, posts: posts });
  // })
  // .catch(error =>{
  //   if (error instanceof mongoose.Error.CastError) {
  //     next(createError(404));
  //   } else {
  //     next(error);
  //   }
  // });
  
  
  //PROMISE.ALL
  Promise.all([
    User.findById(userId),
    Post.find({ author: userId })
  ])
  .then(([user, posts]) => {
    
    if (!user) {
      next(createError(404));
    } else {
      res.render("users/profile", { user: user, posts: posts });
    }
  })
  .catch(error => {
    if (error instanceof mongoose.Error.CastError) {
      next(createError(404));
    } else {
      next(error);
    }
  });
  


};



module.exports.list = (req, res, next) => {
  const criteria = { _id: { $ne: req.user._id }};
  
  if (req.query.name) {
    criteria.name = req.query.name;
  }
  
  let page = 0;
  if (req.query.page) {
    page = Number(req.query.page) || 0;
    console.log(page);
  }
  
  User.find(criteria)
  // .limit(5)
  .skip(5 * page) 
  .sort({'name': 1})
  .then(users => {
    if (users.length === 0) {
      console.log(users);
      res.render("users/list", { errors: `No users match ${criteria.name}`});
    } else{

       Friendship.find({ $or: [{ owner: req.user._id }, { receiver: req.user._id  } ]})
      .then(friendships =>{
        if (friendships) {
          
          console.log(friendships);
          
          console.log('1');
          
          res.render("users/list", { users, friendships });
        } else{
          console.log('2');
          
          res.render("users/list", { users });
        }
      })
      .catch(error =>{
        console.log('AAA');
        
        console.log(error);
        
      });

    }
  })
  .catch(error => {
    if (error instanceof mongoose.Error.CastError) {
      next(createError(404, `user not found`));
    }
  });
};

module.exports.update = (req, res, next) => {
  console.log("UPDATE");
  const id = req.params.id;
  User.findById(id)
  .then(user => {
    if (user) {
      res.render("users/edit", { user });
    } else {
      next(createError(404, "User not found"));
    }
  })
  .catch(error => {
    next(error);
  });
};

module.exports.doUpdate = (req, res, next) => {
  const id = req.params.id;
  
  delete req.body.password;
  if (req.user.role !== constants.user.ADMIN) {
    delete req.body.role;
    // req.body.role = 'GUEST';
  }
  
  User.findByIdAndUpdate(id,{ $set: req.body },{ runValidators: true, new: true })
  .then(user => {
    if (user) {
      console.log("USER UPDATED");
      res.redirect(`/users/${id}/`);
    } else {
      next(createError(404, "User not found"));
    }
  })
  .catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      req.body.id = id; // en el momento de haber error ya no hay id en body asique lo reasigno
      res.render("users/edit", { user: req.body, errors: error.errors });
    } else {
      next(error);
    }
  });
};

module.exports.confirm = (req, res, next) => {
  const tokenUser = req.query.token;
  
  User.findOne({ token: tokenUser })
  .then(user => {
    if (user) {
      user.active = true;
      return user.save()
      .then(user => {
        res.redirect("/sessions/create");
      });
    } else {
      next(createError(404));
    }
  })
  .catch(error => {
    next(error);
  });
};

module.exports.delete = (req, res, next) => {
  console.log("DO DELETE USER");
  
  User.findByIdAndRemove(req.params.id)
  
  .then(() => {
    res.redirect("/users/list");
    console.log("USER DELETED");
  })
  .catch(error => {
    if (error instanceof mongoose.Error.CastError) {
      next(createError(404, "user not found"));
    } else {
      next(error);
    }
  });
};
