const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {getCommentForEditAdminById, updateCommentAdmin,  getCommnetsAdminById, getPostAdminById, updatePostAdmin, getFollowStatus,getPostAdmin, getFollowRequests, declineFollowRequest, acceptFollowRequest, follow, unfollow, createProduct, getAllProducts, getProductById,getMessages,getMessagesSender, updateProduct,sendMessage, deleteProduct, searchProducts,addPost,addComment,addlike,addlike_dislike,adddislike,countLike,getPost, getCommentsByPostId, getPostByPostId} = productController;
const { verifyToken } = require("../middlewares/roleMiddleware");

// Create a new product
router.post('/createProducts',verifyToken, createProduct);

router.post('/addPost',verifyToken, addPost);


router.put('/addLike_dislike/:id',verifyToken, adddislike );

router.post('/adddlikedislike',verifyToken, addlike_dislike);

router.put('/acceptFollowRequest',verifyToken, acceptFollowRequest);

router.put('/updatePostAdmin/:id',verifyToken, updatePostAdmin);

router.put('/updateCommentsById/:id',verifyToken, updateCommentAdmin);

router.post('/declineFollowRequest',verifyToken, declineFollowRequest);

router.post('/follow',verifyToken, follow);

router.delete('/unfollow',verifyToken, unfollow);

router.post('/sendMessage/:id',verifyToken, sendMessage);


router.post('/addComment/:id',verifyToken, addComment);

router.post('/addlike',verifyToken, addlike);

router.get('/getFollowRequests',verifyToken, getFollowRequests);

router.get('/countLike/:id',verifyToken, countLike);

router.get('/getPostAdminById/:id',verifyToken, getPostAdminById);

router.get('/getCommentForEditAdminById/:id',verifyToken, getCommentForEditAdminById);

router.get('/getFollowStatus',verifyToken, getFollowStatus);

router.get('/getMessages/:id',verifyToken, getMessages);

router.get('/getMessagesSender/:id',verifyToken, getMessagesSender);

router.get('/comments/:id',verifyToken, getCommentsByPostId);

router.get('/getPostId/:id',verifyToken, getPostByPostId);

router.get('/getCommnetsAdminById/:id',verifyToken, getCommnetsAdminById);

router.get('/getPost',verifyToken, getPost);

router.get('/getPostAdmin',verifyToken, getPostAdmin);

// Get all products
router.get('/products',verifyToken, getAllProducts);

// Get a specific product by ID
router.get('/productById/:id',verifyToken, getProductById);

// Update a product 
router.put('/updateProduct/:id',verifyToken, updateProduct);

// Delete a product
router.delete('/deleteProducts/:id',verifyToken, deleteProduct);

// Search products
router.get('/search',verifyToken, searchProducts);

module.exports = router;