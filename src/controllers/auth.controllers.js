import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";


export const register = async (req,res)=>{

    const {email,password,name} = req.body;

    try {
    const existingUser = await prisma.user.findUnique({
        where:{
            email:email
        }
    })

    if(existingUser){
        return res.status(400).json({message:"User already exists"})
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });


    const token = jwt.sign({userId:user.id},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })


    res.status(201).json({message:"User created successfully", token})
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
      }

}

export const login = async (req,res)=>{


    const {email,password} = req.body;
    try{
        const user = await prisma.user.findUnique({
            where:{
                email:email
            }
        })

        if(!user){
            return res.status(400).json({message:"Invalid credentials"})
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }

        const token = jwt.sign({userId:user.id},process.env.JWT_SECRET,{
            expiresIn:"7d"
        })      

        res.status(200).json({message:"Login successful", token})


    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
      }
}