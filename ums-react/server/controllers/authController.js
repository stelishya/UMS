import User from '../models/user.js';
// import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateTokensAndSetCookie = (res, userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return accessToken;
};

// const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exist = await User.findOne({ email });
    
    if (exist) return res.status(400).json({ message: 'User already exists' });
  
    // const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password });
    
    if(newUser){
      const accessToken = generateTokensAndSetCookie(res, newUser._id);
      res.status(201).json({
        accessToken,
        user: { _id: newUser._id, name: newUser.name, email: newUser.email, isAdmin:newUser.isAdmin,profileImage: newUser.profileImage },
      });
      // res.status(201).json({
      //   _id: newUser._id,
      //   name: newUser.name,
      //   email: newUser.email,
      //   isAdmin:newUser.isAdmin,
      //   token: generateToken(newUser._id)
      // });
    }else{
      res.status(400).json({message:"Invalid user data"})
    }   
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    if (user && (await user.matchPassword(password))) {
      const accessToken = generateTokensAndSetCookie(res, user._id);
      res.json({
        accessToken,
        user: { _id: user._id, name: user.name, email: user.email, isAdmin:user.isAdmin,profileImage: user.profileImage, },
      });
    }else{
      res.status(401).json({message:"Invalid email or password"})
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
  // const isValid = user && await bcrypt.compare(password, user.password);

  // if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });
  // if (user && (await user.matchPassword(password))) {
  //   res.json({
  //     _id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     isAdmin:user.isAdmin,
  //     profileImage: user.profileImage,
  //     token: generateToken(user._id)
  //   });
  // }else{
  //   res.status(401).json({message:"Invalid email or password"})
  // }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Access Denied. No refresh token provided.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token.' });
  }
};
 
export const logoutUser = (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};

//admin - login
export const loginAdmin = async (req,res)=>{
  const {email,password} = req.body;
  try {
    const user = await User.findOne({email})
    console.log("email and password in loginAdmin in authController.jsx : ",email,password)
    
    if(!user){
      console.log("user not found")
      return res.status(401).json({message:'User not found'})
    }
    console.log("user in loginAdmin in authController.jsx : ",user)
    if(!(await user.matchPassword(password))){
      console.log("invalid password")
      return res.status(401).json({message:'Invalid password'})
    } 
    if(!user.isAdmin){
      console.log("not authorized as an admin")
      return res.status(403).json({message:'Not authorized as an admin'})
    }
    const accessToken = generateTokensAndSetCookie(res, user._id);
    console.log("access token in loginAdmin in authController.jsx : ",accessToken)
    res.json({
      accessToken,
      user: { _id: user._id, name: user.name, email: user.email, isAdmin:user.isAdmin,profileImage: user.profileImage, },
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }

  // if(user && (await user.matchPassword(password))){
  //   console.log("user and password match")
  //   if(user.isAdmin){
  //     console.log("user is admin")
  //     res.json({
  //       _id:user._id,
  //       name:user.name,
  //       email:user.email,
  //       isAdmin:user.isAdmin,
  //       profileImage:user.profileImage,
  //       token:generateToken(user._id)
  //     })
  //   }else{
  //     console.log("user is not admin")
  //     console.log("response in loginAdmin : ",res)
  //     res.status(401).json({message:'Not authorized as an admin'})
  //   }
  // }else{
  //   console.log("user and password do not match")
  //   console.log("response in loginAdmin : ",res)
  //   res.status(401).json({message:'Invalid email or password'});
  // }
}