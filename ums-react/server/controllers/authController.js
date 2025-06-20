import User from '../models/user.js';
// import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ message: 'User already exists' });

  // const hashed = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password });
  
  if(newUser){
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin:newUser.isAdmin,
      token: generateToken(newUser._id)
    });
  }else{
    res.status(400).json({message:"Invalid user data"})
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // const isValid = user && await bcrypt.compare(password, user.password);

  // if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin:user.isAdmin,
      profileImage: user.profileImage,
      token: generateToken(user._id)
    });
  }else{
    res.status(401).json({message:"Invalid email or password"})
  }
};
