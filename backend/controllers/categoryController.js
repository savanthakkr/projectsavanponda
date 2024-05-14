const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');


// Function to create a new category
const createCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const { categoryName } = req.body;
    const result = await sequelize.query(
      'INSERT INTO category (categoryName, createdBy) VALUES (?, ?)',
      {
        replacements: [categoryName, userId],
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

const getAllCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const categories = await sequelize.query(
      'SELECT * FROM category WHERE createdBy = ?',
      { replacements: [userId], type: QueryTypes.SELECT }
    );
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to get a specific category by ID
const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
 
    const category = await sequelize.query(
      'SELECT * FROM categories WHERE id = ?',
      { replacements: [categoryId], type: QueryTypes.SELECT }
    );
    if (category.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to update a category
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { categoryname } = req.body;

    await sequelize.query(
      'UPDATE categories SET categoryname = ? WHERE id = ?',
      { replacements: [categoryname, categoryId], type: QueryTypes.UPDATE }
    );
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to delete a category
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    console.log(categoryId);
    const userId = req.user.id;
    console.log(userId);

    const [existingId] = await sequelize.query('SELECT * FROM category WHERE id = ?',
    { replacements: [categoryId], type: QueryTypes.SELECT });

    if(existingId){
      await sequelize.query(
        'DELETE FROM category WHERE id = ? AND createdBy = ?',
        { replacements: [categoryId, userId], type: QueryTypes.DELETE }
      );
      res.json({ message: 'Category deleted successfully' });
    }else{
      res.json({ message: 'enter valid category id' });
    }
    
    
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory}