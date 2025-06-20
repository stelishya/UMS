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
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.profileImage = req.body.profileImage || user.profileImage;


  // await user.save();
  // res.json({ message: 'Profile updated' });

  const updatedUser = await user.save();
  res.json({
    message: 'Profile updated',
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
    }
  });
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
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// Admin: Update user
export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.isAdmin !== undefined) {
    user.isAdmin = req.body.isAdmin;
  }
  // user.role = req.body.role || user.role;

  const updatedUser= await user.save();
  res.json(updatedUser);
};

// Admin: Delete user
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // await user.remove();
  await user.deleteOne();
  res.json({ message: 'User deleted' });
};

//Admin : Login
export const loginAdmin = async (req,res)=>{
  const {email,password} = req.body;
  const user = await User.findOne({email})
  console.log("email and password in loginAdmin in userController.jsx : ",email,password)
  console.log("user in loginAdmin",user)

  if(user && (await user.matchPassword(password))){
    console.log("user and password match")
    if(user.isAdmin){
      console.log("user is admin")
      res.json({
        _id:user._id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin,
        profileImage:user.profileImage,
        token:generateToken(user._id)
      })
    }else{
      console.log("user is not admin")
      console.log("response in loginAdmin : ",res)
      res.status(401).json({message:'Not authorized as an admin'})
    }
  }else{
    console.log("user and password do not match")
    console.log("response in loginAdmin : ",res)
    res.status(401).json({message:'Invalid email or password'});
  }
}