import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Profile from "../models/profile.model.js";
import crypto from "crypto";


//Register User Controller

export const register = async (req, res) => {
  console.log(req.body);

  try {
    const { name, email, password, username } = req.body; //taking name,email,username and password from frontend from request body
    if (!name || !email || !password || !username)
      return res.status(400).json({ message: "All fields are required mama" }); //if any of the fields are missing from the request body return error
    const user = await User.findOne({
      //this checks the database if the user already exists
      email, //specifically finds email id in the database if found returns the below error
    });

    if (user)
      return res.status(400).json({ message: "User already Exists Macha" }); //this checks if the user already exists

    const hashedPassword = await bcrypt.hash(password, 10); //this is bcrypt package to hash the password sent from the request body

    const newUser = new User({
      //this is the data from the request body that is sent to the database
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save(); //after that it saves the data in the database

    const profile = new Profile({ userId: newUser._id });
    await profile.save();


    return res.json({ mesage: "user registered succesfully bro" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Login User controller

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required mama" }); //taking email and password from frontend from request body
    const user = await User.findOne({
      //this finds the user in the database
      email,
    });
    if (!user) return res.status(404).json({ message: "User does not exist" }); //this checks if the user exists

    const isMatch = await bcrypt.compare(password, user.password); //this compares the password in the request body with the password in the database
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" }); //if doesnt match return error message as invalid credentials
    const token = crypto.randomBytes(32).toString("hex"); // this generates the token where user do not need to login everytime
  
    await User.updateOne({ _id: user._id }, { token }); //the random token generated above is updated in the database
    return res.json({ token }) //this sends the token to the frontend
  } catch (error) {}
};


export const uploadProfilePicture = async (req, res) => {
  const{token}=req.body;

  try{
const user=await User.findOne({token});

if(!user){
  return res.status(404).json({message:'User does not exist'})
}
user.profilePicture=req.file.filename;
await user.save();

return res.status(200).json({message:'Profile picture uploaded successfully'})
  } 
  catch(error){
return res.status(500).json({message:error.message})
  }
}

export const updateUserProfile = async (req, res) => {
  try{
    const {token, ...newUserData}=req.body;   //...newuserdata is a spread operator where extracts all the info from token 

    const user=await User.findOne({token:token});

   if (!user){
    return res.status(404).json({message:'User does not exist'})
   }
  const {username,email}=newUserData;

  const existingUser=await User.findOne({$or:[{username},{email}]});

  if(existingUser){
    if(existingUser || String(existingUser._id)===String(user._id)){
      
  
    return res.status(400).json({message:'Username or email already exists'})
  }
  }
    object.assign(user,newUserData);
    await user.save();
    return res.status(200).json({message:'User updated successfully'})

  }
  catch(err){
    return res.status(500).json({message:error.message})

  }

}

export const getUserAndProfile =async(req,res)=>{
  try{
    const {token}=req.body;  //taking token from req body

    const user=await User.findOne({token:token});

    if(!user){
      return res.status(404).json({message:'User does not exist'})
    }

    const userProfile=await Profile.findOne({userId:user._id})
    .populate('userId','name email username profilePicture');
    return res.json(userProfile);


  }
  catch(err){
    return res.status(500).json({message:error.message})
  }
}

export const updateProfileData=async(req,res)=>{       //updating the profile with education and work

  try{
    const { token, ...newProfileData }=req.body;

    const userProfile= await User.findOne({token:token});
    if(!userProfile){
      return res.status(404).json({message:'User does not exist'})
    }
    const profile_to_update=  await Profile.findOne({userId:userProfile._id});

    Object.assign(profile_to_update,newProfileData);     //object.assign is a special object method where it updates the data (target)easily (please refer mdn objectassign for more info)
    await profile_to_update.save();
    return res.status(200).json({message:'Profile updated successfully'})

  }
  catch(err){
    res.sendStatus(500).json({message:error.message})
  }
}

export const getAllUserProfile=async(req,res)=>{

  try{
    const profiles=await Profile.find().populate('userId','name email username profilePicture');
    return res.json(profiles)
  }


  catch(err){
    return res.status(500).json({message:error.message})
  }
}