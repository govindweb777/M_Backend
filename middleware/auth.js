const jwt=require("jsonwebtoken");
require("dotenv").config();

const user = require("../models/user.models");

//auth
const auth= async(req,res,next)=>{ 
    try {
        let token = req.params.token || req.query.token || req.body.token || req.cookies.token || req.header.token || req.header("Authorization");
        //const token = req.cookies.token || req.header.token || req.header("Authorization");
        
        //if token missing then return error 
        if(!token){
            return res.status(400).json({
                success:false,
                message:"token is missing"
            })
        }
        

        //decoding token
        try {
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            0
            req.user=decode
            
        } catch (error) {
            //verification issues
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
            
        }
        next();
        
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"something went wrong while validating the token",
            message:error.message
        })
        
    }

}



const isAdmin= async(req,res,next)=>{
    try {
        if(req.user.accountType !=="Admin" && req.user.accountType !=="SuperAdmin"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for admin only"
            })
        }
        next();
        
    } catch (error) {
        console.log("error in adminchecking middleware")
        return res.status(403).json({
            success:false,
            message:"User role can't be verified ,plpease try again"
        })
        
    }
}


const isSuperAdmin = async(req,res,next)=>{
    try {
        if(req.user.accountType!=="SuperAdmin"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for superAdmin",
            })
        }
        next();
        
    } catch (error) {
        console.log("error in verification of superAdmin role");
        return res.status(403).json({
            success:false,
            message:"user role can't be verified please try again"
        })

        
    }
}

const isAccount = async(req,res,next)=>{
    try {
        
        if(req.user.accountType!=="Accounts"){
            return res.status(400).json({
                success:false,
                message:"This is protected route for Account"
            })
    
        }
        next();
        
    } catch (error) {
        console.log("problem in Accounts role middleware ")
        return res.status(401).json({
            success:false,
            error:error.message,
            message:"user role can't be verified"
        })
        
    }

}

const isGraphics = async(req,res,next)=>{

    try {
        
        if(req.user.accountType!=="Graphics"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for graphics only"
            })
        }
        next();
        
    } catch (error) {
        console.log("error in graphics protected route")
        return res.status(402).json({
            success:false,
            error:error.message,
            message:"user role can't be verified"
        })
        
    }
}

const isCutout = async(req,res,next)=>{

    try {
        
        if(req.user.accountType!=="Cutout"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for Cutout only"
            })
        }
        next();
        
    } catch (error) {
        console.log("error in Cutout protected route")
        return res.status(402).json({
            success:false,
            error:error.message,
            message:"user role can't be verified"
        })
        
    }
}


const isViewer = async(req,res,next)=>{

    try {
        
        if(req.user.accountType!=="Viewer"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for Viewer only"
            })
        }
        next();
        
    } catch (error) {
        console.log("error in Viewer protected route")
        return res.status(402).json({
            success:false,
            error:error.message,
            message:"user role can't be verified"
        })
        
    }
}



const isGraphicsCutout = async(req,res,next)=>{

    try {
        
        if(req.user.accountType!=="Graphics" && req.user.accountType!=="Cutout"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for Graphics and Cutout only"
            })
        }
        next();
        
    } catch (error) {
        console.log("error in Graphics and Cutout protected route")
        return res.status(402).json({
            success:false,
            error:error.message,
            message:"user role can't be verified"
        })
        
    }
}

const isCutoutAndAdmin = async(req,res,next)=>{

    try {
        
        if(req.user.accountType!=="Cutout" && req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for Cutout and Admin only"
            })
        }
        next();
        
    } catch (error) {
        console.log("error in Cutout and Admin protected route")
        return res.status(402).json({
            success:false,
            error:error.message,
            message:"user role can't be verified"
        })
        
    }
}



module.exports={auth,isAdmin,isSuperAdmin,isAccount,isGraphics, isCutout, isViewer, isGraphicsCutout, isCutoutAndAdmin};