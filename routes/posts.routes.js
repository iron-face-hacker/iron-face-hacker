const express = require('express');
const router = express.Router({ mergeParams: true });
const postsController = require('../controller/posts.controller');
const middleware = require('../middlewares/auth.middleware');

router.post('/create', middleware.auth, middleware.isOwneredByOwnSession, postsController.doCreate);
// router.post('/:postId/edit', middleware.auth, middleware.isOwneredByOwnSession, postsController.doUpdate);
// router.post('/:postId/like', middleware.auth, middleware.isOwneredByOwnSession, postsController.doUpdate);
router.post('/:postId/delete', middleware.auth, middleware.isOwneredByOwnSession, postsController.doDelete);

//`/users/:userId/posts/:postId`
//`/posts/:postId`

// `/users/:id/posts/create` DONE
// `/users/:id/posts/` ???
// `/users/:userId/posts/:postId/delete` DONE

module.exports = router;
