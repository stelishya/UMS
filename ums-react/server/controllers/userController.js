import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// User Profile
export const getProfile = (req, res) => {
  res.json(req.user);
};

// Upload Profile Image
export const uploadProfileImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  req.user.profileImage = `/uploads/${req.file.filename}`;
  await req.user.save();

  res.json({ message: 'Image uploaded', profileImage: req.user.profileImage });
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    console.log('--- Update Profile Request ---');
    console.log('Request Body:', req.body);
    console.log('Request User:', req.user);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
  
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.profileImage) {
      user.profileImage = req.body.profileImage;
    }
  
    // await user.save();
    // res.json({ message: 'Profile updated' });
  
    const updatedUser = await user.save();
    console.log("updatedUser in updateProfile in userController.jsx : ",updatedUser)
    res.json({
      // message: 'Profile updated',
      // user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
      // }
    });
    
  } catch (error) {
    console.log("error in updateProfile in userController.jsx : ",error)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists!' });
    }
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// Admin: Get all users
export const getAllUsers = async (req, res) => {
  const keyword = req.query.search
    ? { 
        $or:[          
          {name: { $regex: req.query.search, $options: 'i' } },
          {email:{ $regex:req.query.search, $options: 'i'}}
        ],
      }
    : {};

  const users = await User.find({...keyword, isAdmin:false}).select('-password');
  res.json(users);
};


export const createUser = async (req, res) => {
  try {
    const { name, email, password ,profileImage} = req.body;
  
    const userExists = await User.findOne({ email });
  
    if (userExists) {
      res.status(400).json({message:'User already exists'});
      // throw new Error('User already exists');
    }
  
    const user = await User.create({
      name,
      email,
      password,
      profileImage,
    });
    
    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profileImage: user.profileImage,
      });
    } else {
      return res.status(400).json({message:'Invalid user data'});
      // throw new Error('Invalid user data');
    }
  } catch (error) {
    console.log("error in createUser in userController.jsx : ",error)
    return res.status(500).json({ message: 'Server error while creating user' });
  }

};

// Admin: Update user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
  
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profileImage = req.body.profileImage || user.profileImage;
    if (req.body.isAdmin !== undefined) {
      user.isAdmin = req.body.isAdmin;
    }
    // user.role = req.body.role || user.role;
  
    const updatedUser= await user.save();
    res.json(updatedUser);
    
  } catch (error) {
    console.error('Error updating user:', error);
    // handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    res.status(500).json({ message: 'Server error while updating user.' });
  }
};

// admin - delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
  
    // await user.remove();
    await user.deleteOne();
    res.json({ message: 'User deleted' });
    
  } catch (error) {
    console.error('Error deleting user in deleteUser in userController.jsx:', error);
    res.status(500).json({ message: 'Server error while deleting user.' });
  }
};

