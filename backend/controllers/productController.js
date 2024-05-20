const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middlewares/roleMiddleware');



// const createProduct = async (req, res) => {
//   try {
//     const { name, description, categoryId, price } = req.body;
//     const createdBy = req.user.id;
//     const userRole = req.user.userRole;
//     console.log('userRole:', userRole);

//     const images = req.files ? Array.from(Object.values(req.files).flat()) : [];
//     console.log(req.body);
//     // const images = req.files.images

//     const dirExists = fs.existsSync(`public/assets/product/`);

//     if (!dirExists) {
//       fs.mkdirSync(`public/assets/product/`, { recursive: true });
//     }

//     if (images == undefined || images == null) throw new Error("file not found!");

//     let savePath = `/public/assets/product/${Date.now()}.${images.name.split(".").pop()}`

//     await new Promise((resolve, reject) => {
//       images.mv(path.join(__dirname, ".." + savePath), async (err) => {
//           if (err) return reject(err);

//           const updateQuery = 'UPDATE book SET image = ? WHERE book_id = ?'
//           await db.query(updateQuery, [[savePath], id]);
//           resolve([savePath]);
//       });
//     });
//     const result = await sequelize.query(
//       'INSERT INTO product (name, description, categoryId, price, images, createdBy, userRole) VALUES (?, ?, ?, ?, ?, ?, ?)',
//       {
//         replacements: [name, description, categoryId, price, savePath, createdBy, userRole],
//         type: QueryTypes.INSERT
//       }
//     );
//     res.json({ message: 'Product created!', id: result[0] });


//   } catch (error) {
//     console.error('Error creating product:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


const createProduct = async (req, res) => {
  try {
    const { name, description, categoryId, price } = req.body;
    const images = req.files ? Array.from(Object.values(req.files).flat()) : [];
    const createdBy = req.user.id;
    const userRole = req.user.userRole;
    console.log(userRole);
    console.log(images);

    const dirExists = fs.existsSync(`public/assets/`);
    if (!dirExists) {
      fs.mkdirSync(`public/assets/`, { recursive: true });
    }

    // Array to store paths of uploaded images
    let imagePaths = [];

    // Upload each image and store its path
    for (const image of images) {
      if (!image || !image.name) {
        throw new Error("Image or image name is undefined");
      }

      const savePath = `/public/assets/${Date.now()}.${image.name.split(".").pop()}`;

      // Move the file to the destination
      await new Promise((resolve, reject) => {
        image.mv(path.join(__dirname, ".." + savePath), (err) => {
          if (err) {
            reject(new Error("Error in uploading"));
          } else {
            imagePaths.push(savePath);
            resolve();
          }
        });
      });
    }
    const result = await sequelize.query(
      'INSERT INTO product (name, description, categoryId, price, images, createdBy, userRole) VALUES (?, ?, ?, ?, ?, ?, ?)',
      {
        replacements: [name, description, categoryId, price, imagePaths.join(','), createdBy, userRole],
        type: QueryTypes.INSERT
      }
    );

    res.json({ message: 'Product created!', id: result[0] });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Error creating product: Error: Positional replacement (?) 6 has no entry in the replacement map (replacements[6] is undefined).


const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const products = await sequelize.query(
      `SELECT * FROM product LIMIT ${pageSize} OFFSET ${offset}`,
      { type: QueryTypes.SELECT }
    );
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Function to get a specific product by ID
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await sequelize.query(
      'SELECT * FROM product WHERE id = ?',
      { replacements: [productId], type: QueryTypes.SELECT }
    );
    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to update a product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, categoryId, price, images } = req.body;

    await sequelize.query(
      'UPDATE product SET name = ?, description = ?, categoryId = ?, price = ?, images = ? WHERE id = ?',
      { replacements: [name, description, categoryId, price, images, productId], type: QueryTypes.UPDATE }
    );
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {

    const userRole = req.user.userRole;
    const userId = req.user.userId;
    console.log(userRole);
    const productId = req.params.id;

    if (userRole === 'Admin') {
      sequelize.query(
        'DELETE FROM product WHERE id = ? ',
        { replacements: [productId], type: QueryTypes.DELETE }
      );
    } else if (userRole === 'User') {
      sequelize.query(
        'DELETE FROM product WHERE id = ? AND userRole = ? ',
        { replacements: [productId, userRole], type: QueryTypes.DELETE }
      );
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// const deleteProduct = async (req, res) => {
//   try {
//     const userRole = req.user.userRole;
//     console.log(userRole);
//     const productId = req.params.id;

//     let query;

//     if (userRole === 'admin') {
//       await sequelize.query(
//         'DELETE FROM product WHERE id = ?',
//         { replacements: [productId], type: QueryTypes.DELETE }
//       );
//     } else if (userRole === 'User') {
//       await sequelize.query(
//         'DELETE FROM product WHERE id = ? AND userRole = ?',
//         { replacements: [productId, userRole], type: QueryTypes.DELETE }
//       );
//     } else {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     await sequelize.query(query);
//     res.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting product:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

const searchProducts = async (req, res) => {
  try {
    const { name } = req.query;
    console.log(name);
    if (!name) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const products = await sequelize.query(
      `SELECT p.*, c.categoryName AS categoryName
       FROM product p
       LEFT JOIN category c ON p.categoryId = c.id
       WHERE LOWER(p.name) LIKE :query
         OR LOWER(p.description) LIKE :query
         OR CAST(p.categoryId AS CHAR) LIKE :query
         OR CAST(p.price AS CHAR) LIKE :query`,
      {
        replacements: { query: `%${name.toLowerCase()}%` },
        type: QueryTypes.SELECT,
      }
    );

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const addPost = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const { des } = req.body;
    const result = await sequelize.query(
      'INSERT INTO posts (des, userId) VALUES (?, ?)',
      {
        replacements: [des, userId],
        type: QueryTypes.INSERT
      }
    );
    // Return the ID of the newly created category
    res.json({ message: 'Category created!', id: result[0] });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const { comment } = req.body;
    const result = await sequelize.query(
      'INSERT INTO comments (comment, postId, userId) VALUES (?, ?, ?)',
      {
        replacements: [comment, postId, userId],
        type: QueryTypes.INSERT
      }
    );
    res.json({ message: 'Comment added!', id: result[0] });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await sequelize.query(
      'SELECT * FROM comments WHERE postId = ?',
      {
        replacements: [postId],
        type: QueryTypes.SELECT
      }
    );
    res.json(comments);
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPostByPostId = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await sequelize.query(
      'SELECT * FROM posts WHERE id = ?',
      {
        replacements: [postId],
        type: QueryTypes.SELECT
      }
    );
    res.json(comments);
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const addlike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.body;
    const [like] = await sequelize.query(
      'SELECT * FROM likes WHERE postId = ? AND userId = ? ',
      {
        replacements: [postId, userId],
        type: QueryTypes.SELECT
      }
    );
    if (like) {
      // User has already liked the post, so remove the like
      await sequelize.query(
        'DELETE FROM likes WHERE postId = ? AND userId = ?',
        {
          replacements: [postId, userId],
          type: QueryTypes.DELETE
        }
      );
      res.json({ message: 'Like removed!' });
    } else {
      // User has not liked the post, so add the like
      const result = await sequelize.query(
        'INSERT INTO likes (postId, userId) VALUES (?, ?)',
        {
          replacements: [postId, userId],
          type: QueryTypes.INSERT
        }
      );
      res.json({ message: 'Like added!' });
    }
  } catch (error) {
    console.error('Error adding or removing like:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Add like or remove like to post

const countLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const [likes] = await sequelize.query(
      'SELECT COUNT(*) as count FROM likes WHERE postId = ?',
      {
        replacements: [postId],
        type: QueryTypes.SELECT
      }
    );
    const [dislikes] = await sequelize.query(
      'SELECT COUNT(*) as count FROM dislikes WHERE postId = ?',
      {
        replacements: [postId],
        type: QueryTypes.SELECT
      }
    );
    res.json({ likes: likes[0].count, dislikes: dislikes[0].count });
  } catch (error) {
    console.error('Error getting like and dislike count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Get total number of likes and dislikes for a post
const getPost = async (req, res) => {
  try {
    const posts = await sequelize.query(
      `
      SELECT p.id, p.des, p.userId, u.name as userName, (SELECT GROUP_CONCAT(comment SEPARATOR ', ') FROM comments c WHERE c.postId = p.id) as comments,
      (SELECT COUNT(*) FROM likes_post l WHERE l.post_id = p.id AND l.like_type = 'like') as likeCount
      FROM posts p
      LEFT JOIN users u ON p.userId = u.id
      GROUP BY p.id;
      `,
      { type: sequelize.QueryTypes.SELECT }
    );
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addlike_dislike = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id;

  try {
    const isFollowing = await sequelize.query(
      'SELECT like_type FROM likes_post WHERE post_id = :postId AND user_id = :userId',
      {
        replacements: { postId, userId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!isFollowing || !isFollowing.length) {
      await sequelize.query(
        'INSERT INTO likes_post (post_id, user_id, like_type) VALUES (:postId, :userId, :likeType)',
        {
          replacements: { postId, userId, likeType: 'like' },
          type: sequelize.QueryTypes.INSERT
        }
      );
    } else if (isFollowing[0].like_type === 'like') {
      await sequelize.query(
        'UPDATE likes_post SET like_type = :likeType WHERE post_id = :postId AND user_id = :userId',
        {
          replacements: { postId, userId, likeType: 'dislike' },
          type: sequelize.QueryTypes.UPDATE
        }
      );
    } else {
      await sequelize.query(
        'UPDATE likes_post SET like_type = :likeType WHERE post_id = :postId AND user_id = :userId',
        {
          replacements: { postId, userId, likeType: 'like' },
          type: sequelize.QueryTypes.UPDATE
        }
      );
    }

    res.json({ message: 'Like or dislike successfully added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};







const adddislike = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id;

  await sequelize.query(
    'INSERT INTO likes_post (post_id, user_id,like_type) VALUES (?, ?, ?)',
    {
      replacements: [postId, userId, 'like'],
      type: sequelize.QueryTypes.INSERT
    }
  );

  res.json({ message: 'Dislike successfully added' });
}


const follow = async (req, res) => {
  const followerId = req.user.id;
  const { followingId } = req.body;

  await sequelize.query(
    'INSERT INTO user_follows (user_id,following_user_id) VALUES (?, ?)',
    {
      replacements: [followerId, followingId],
      type: sequelize.QueryTypes.INSERT
    }
  );
  res.json({ message: 'follow successfully added' });
}
const unfollow = async (req, res) => {
  const followerId = req.user.id;
  const { followingId } = req.body;


  await sequelize.query(
    'DELETE FROM user_follows WHERE user_id = ? AND following_user_id = ?',
    {
      replacements: [followerId, followingId],
      type: sequelize.QueryTypes.INSERT
    }
  );
  res.json({ message: 'unfollow successfully added' });
  
}







const followUnfollow = async (req, res) => {
  const { followingId } = req.body;
  const userId = req.user.id;

  try {
    const isFollowing = await sequelize.query(
      'SELECT followStatus FROM user_follows WHERE user_id = ? AND following_user_id = ?',
      {
        replacements: [userId, followingId],
        type: sequelize.QueryTypes.SELECT
      }
    );
    if (!isFollowing || !isFollowing.length) {
      await sequelize.query(
        'INSERT INTO user_follows (following_user_id, user_id, followStatus) VALUES (?, ?, ?)',
        {
          replacements: [followingId, userId, 'follow'],
          type: sequelize.QueryTypes.INSERT
        }
      );
    } else if (isFollowing[0].followStatus === 'follow') {
      await sequelize.query(
        'UPDATE user_follows SET followStatus = ? WHERE following_user_id = ? AND user_id = ?',
        {
          replacements: ['unfollow', followingId, userId],
          type: sequelize.QueryTypes.UPDATE
        }
      );
    } else {
      await sequelize.query(
        'UPDATE user_follows SET followStatus = ? WHERE following_user_id = ? AND user_id = ?',
        {
          replacements: ['follow', followingId, userId],
          type: sequelize.QueryTypes.UPDATE
        }
      );
    }
    res.json({ message: 'follow or unfollow successfully added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};





const getFollowStatus = async (req, res) => {
  const userId = req.user.id;

  const followStatus = await sequelize.query(
    'SELECT followStatus FROM user_follows WHERE user_id = ?',
    {
      replacements: [userId],
      type: sequelize.QueryTypes.SELECT
    }
  );

  res.json(followStatus);
}



const sendMessage = async (req, res) => {
  const { content } = req.body;
  const receiverId = req.params.id;
  console.log(receiverId);
  const senderId = req.user.id;

  await sequelize.query(
    'INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES (?, ?, ?, NOW())',
    {
      replacements: [senderId, receiverId, content],
      type: sequelize.QueryTypes.INSERT
    }
  );

  res.json({ message: 'Message sent successfully' });
}

const getMessages = async (req, res) => {
  const receiverId = req.user.id;
  console.log(receiverId);
  const senderId = req.params.id;

  const messages = await sequelize.query(
    'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (receiver_id = ? AND sender_id = ?)  ORDER BY timestamp ASC',
    {
      replacements: [senderId, receiverId, senderId, receiverId],
      type: sequelize.QueryTypes.SELECT
    }
  );

  res.json(messages);
}

const getMessagesSender = async (req, res) => {
  const receiverId = req.params.id;
  console.log(receiverId);
  const senderId = req.user.id;

  const messages = await sequelize.query(
    'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?)  ORDER BY timestamp ASC',
    {
      replacements: [senderId, receiverId, senderId, receiverId],
      type: sequelize.QueryTypes.SELECT
    }
  );

  res.json(messages);
}




// today complated task 


// like dislike api 
// comment add on perticuler post 
// count total number of like 







module.exports = {follow, unfollow, getFollowStatus, followUnfollow, getMessages,getMessagesSender, sendMessage, createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, searchProducts, addPost, countLike, addlike, addlike_dislike, adddislike, addComment, getPost, getCommentsByPostId, getPostByPostId };