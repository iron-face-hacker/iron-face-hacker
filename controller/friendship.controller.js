const constants = require("../constants");
const mongoose = require("mongoose");
const createError = require("http-errors");
const Friendship = require("../models/frienship.model");
const User = require("../models/user.model");

module.exports.doCreate = (req, res, next) => {
    const me = req.user._id.toString();
    const friend = req.params.id;
    
    Friendship.find({ users: { $all: [me, friend] } })
    .then(friendship => {
        if (friendship && friendship.length > 0) {
            console.log("FRIENDSHIP EXISTS", friendship[0].status);
            
            res.redirect("/users/list");
        } else {
            
            console.log("FRIENDSHIP DOES NOT EXIST, CREATING IT");
            const friendship = new Friendship({ users: [req.params.id, req.user._id], owner: req.user._id , receiver: req.params.id});
            friendship.save()
            .then(() => {
                res.redirect("/users/list");
            })
            .catch(error => {
                res.render("users/profile", { errors: error.error });
            });
        }
    })
    .catch(error => {
        if (error instanceof mongoose.Error.CastError) {
            next(createError(404, "cast error"));
        } else {
            next(error);
        }
    });
};

module.exports.list = (req, res, next) => {
    const me = req.user._id;
    
    Friendship.find({ $and: [ { users: { $in: [me]}}, { status:'PENDING'} ] })
    .populate('users')
    .populate('owner')
    .populate('receiver')
    .then(pendingRequests => { 
        console.log(pendingRequests);
        
        if (pendingRequests && pendingRequests.length > 0) {
            
            res.render("users/friendRequest", {pendingRequests});
            
        } else {
            res.render("users/friendRequest", {
                error: "You dont have friend requests"
            });
        }
    })
    .catch(error => {
        if (error instanceof mongoose.Error.CastError) {
            next(createError(404, `friendship not found`));
        } else {
            next(error);
        }
    });
};

module.exports.acceptFriendship = (req, res, next) => {
    
    Friendship.findByIdAndUpdate(req.params.id, { $set: { status: "FRIENDS" } }, { new: true })
    .then(friendship => {
        console.log('FRIENDSHIP ACCEPTED, ' + friendship);
        res.redirect(`/${req.user._id}`)

    })
    .catch(error => { 
        if (error instanceof mongoose.Error.CastError) {
            next(createError(404));
        } else {
            next(error);
        }
    });
};
