import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { USER_VALID_FOR_SIGNUP } from '../constants/index.js';

import { INVALID_CREDENTIALS, USERNAME_DNE, USER_ALREADY_EXISTS, INVALID_OTP } from '../constants/index.js';
import nodemailer from 'nodemailer';
import {google} from 'googleapis';
import {OAuth2Client} from 'google-auth-library';

import User from '../models/user.js';

export const signin= async (req,res)=>{
    //sign in logic goes here
    const {email,password}= req.body;

    try {
        const existingUser= await User.findOne({email});
        if(!existingUser)
            return res.status(401).json({message:USERNAME_DNE});

        const isPasswordCorrect= await bcrypt.compare(password,existingUser.password);
        if(!isPasswordCorrect)
            return res.status(401).json({message:INVALID_CREDENTIALS});
        const token=jwt.sign({email: existingUser.email, id: existingUser._id}, 'test',{expiresIn:"1h"});//move test to env
        res.status(200).json({ result: existingUser, token})
    } catch (error) {
        res.status(500).json({message:'Something went wrong.'});
    }


}



export const checkIfUserExists= async (req,res)=>{
    //sign up logic goes here
    const {email}= req.body;

    try {
        const existingUser= await User.findOne({email});
        if(existingUser && existingUser.isVerified==true){
            return res.status(403).json({message:USER_ALREADY_EXISTS});
        }
        return res.status(200).json({message:USER_VALID_FOR_SIGNUP});
    }
    catch (error) {
        res.status(500).json({message:'Something went wrong.'});
    }
}

const sendOTPMail= async(otp,emailid)=>{
    try {
        const CLIENT_ID = process.env.CLIENT_ID_FOR_EMAIL;
        const CLIENT_SECRET = process.env.CLIENT_SECRET_FOR_EMAIL;
        const REDIRECT_URI = process.env.REDIRECT_URI;
        const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
        const FROM_EMAIL = 'sensingbharat@gmail.com';
        const TO_EMAIL = emailid;
        const SUBJECT = 'OTP for Sensing Bharat';
        const TEXT = `Your OTP is ${otp}`;
        const oAuth2Client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI
          );
          
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: FROM_EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        

        const mailOptions = {
            from:FROM_EMAIL,
            to:TO_EMAIL,
            subject:SUBJECT,
            text: TEXT,
        };

        const result = await transport.sendMail(mailOptions);
        
    } catch (error) {
        console.log(error);
        
    }
}

export const verifyCredentials= async(req,res)=>{
    const {email,password,name}= req.body;
    const emailid=email;
    const username=name;
    let otp=0;
    let num=0;
    for(let i=0;i<6;i++){
        num=Math.floor(Math.random()*10);
        if(i==0 && num==0)
            num=num+1;
        otp=otp*10+num;
    }
    // console.log(otp);

    


    try {
        const existingUser=await User.findOne({email});
        
        const hashedPassword= await bcrypt.hash(password,12);
        if(existingUser){
            const result= await User.findOneAndUpdate({email},{email,password: hashedPassword,name,isVerified:false,otp});
        }
        else{
            const result= await User.create({email:emailid,password: hashedPassword,name:username,isVerified:false,otp});
        }
        await sendOTPMail(otp,emailid);
        
        res.status(200).json({message:"OTP sent successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Something went wrong.'});
    }

}

export const signupWithOtpCheck=async(req,res)=>{
    const {email,otp}=req.body;
    try {
        const existingUser= await User.findOne({email});

        const isOTPCorrect= otp==existingUser.otp?true:false;
        if(!isOTPCorrect)
            return res.status(401).json({message:INVALID_OTP});
        const token=jwt.sign({email: existingUser.email, id: existingUser._id}, 'test',{expiresIn:"1h"});//move test to env
        res.status(200).json({ result: existingUser, token})      
    } catch (error) {
        
    }
}
export const validateOtpForSignup=async(req,res)=>{
    const {email,otp}=req.body;
    try {
        const existingUser= await User.findOne({email});
        if(otp!=existingUser.otp){
            return res.status(401).json({message:INVALID_OTP});
        }
        return res.status(200).json({result: existingUser.email});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Something went wrong.'});
    }
}

export const resendOTP=async(req,res)=>{
    const {email}=req.body;
    try {
        const emailid=email;
        const existingUser=await User.findOne({email});
        const otp=existingUser.otp;
        
        await sendOTPMail(otp,emailid);
        // console.log(otp);
        res.status(200).json({message:"OTP sent successfully"});
    } catch (error) {
        console.log(error);
        
    }
}

export const signup= async (req,res)=>{
    //sign up logic goes here
    const {email,password,name}= req.body;
    // console.log(email);

    try {
        const existingUser= await User.findOne({email});

        if(existingUser && existingUser.isVerified==true)
            return res.status(401).json({message:USER_ALREADY_EXISTS});


        const hashedPassword= await bcrypt.hash(password,12);
        // const temp= await User.findOneAndDelete({email});
        const result= await User.findOneAndReplace({email},{email,password: hashedPassword,name,isVerified:true});
        const token= jwt.sign({email: result.email,id: result._id},'test',{expiresIn:"1h"});
        res.status(200).json({ result, token});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Something went wrong.'});
    }


}