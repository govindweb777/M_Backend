const userModel = require("../models/user.models.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            accountType
        } = req.body

        if (!firstName || !lastName || !email || !password || !accountType) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exist",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        //create entry into db
        const user = await userModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType
        })

        return res.status(200).json({
            success: true,
            message: "user is created successfully",
        })

    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: "user cannot be registered, please try again",
            error: error.message
        })
    }
}



const nodemailer = require("nodemailer");


// Nodemailer transporter setup
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });


const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 587,
    secure: false, // use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});



const sendEmail = async (email, password, name) => {
    try {
        // HTML email template
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome Email</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f5f5f5;
                    color: #333333;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
                }
                .email-header {
                    background-color: #f8f9fa;
                    padding: 25px 0;
                    text-align: center;
                    border-bottom: 1px solid #eeeeee;
                }
                .logo-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .logo {
                    height: 80px;
                    width: 150px;
                    margin: 0 auto;
                }
                .email-body {
                    padding: 30px;
                    line-height: 1.6;
                }
                .email-footer {
                    background-color: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                    font-size: 14px;
                    color: #666666;
                    border-top: 1px solid #eeeeee;
                }
                .credentials {
                    background-color: #f9f9f9;
                    padding: 15px;
                    border-radius: 6px;
                    margin: 20px 0;
                    border-left: 4px solid #4a90e2;
                }
                .button {
                    display: inline-block;
                    background-color: #4a90e2;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: bold;
                    margin-top: 15px;
                }
                h1 {
                    color: #4a90e2;
                    margin-top: 0;
                }
                .highlight {
                    font-weight: bold;
                    color: #4a90e2;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <div class="logo-container">
                        <img src="cid:companyLogo" alt="Company Logo" class="logo" />
                    </div>
                </div>
                
                <div class="email-body">
                    <h1>Welcome Team!</h1>
                    
                    <p>Dear ${name},</p>
                    
                    <p>We are pleased to inform you that your account has been successfully created. You're now part of our Blue Star Communication!</p>
                    
                    <div class="credentials">
                        <p><span class="highlight">Login Credentials:</span></p>
                        <p>Email: ${email}</p>
                        <p>Password: ${password}</p>
                    </div>
                    
                    <p>For security reasons, we strongly recommend changing your password upon your first login.</p>
                    
                    <a href="#" class="button">Login to Your Account</a>
                    
                    <p style="margin-top: 25px;">If you have any questions or need further assistance, please feel free to reach out to our support team.</p>
                    
                    <p>Best regards,<br>
                    The Admin Team</p>
                </div>
                
                <div class="email-footer">
                    <p>© 2025 Your Company. All rights reserved.</p>
                    <p>This is an automated message, please do not reply directly to this email.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Plain text alternative for email clients that don't support HTML
        const textContent = `
        Dear ${name},

        We are pleased to inform you that your account has been successfully created.

        Login Credentials:
        - Email: ${email}
        - Password: ${password}

        For security reasons, we recommend changing your password upon your first login.

        If you have any questions or need further assistance, please feel free to reach out.

        Best regards,
        Admin
        `;

        // Get path to logo file
        const path = require('path');
        const logoPath = path.resolve(__dirname, '../../M_frontend/public/logo.png');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome Team: Your Account has been Created",
            text: textContent,
            html: htmlContent,
            attachments: [
                {
                    filename: 'logo.png',
                    path: logoPath,
                    cid: 'companyLogo' 
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};


exports.createAccount = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            accountType
        } = req.body

        if (!firstName || !lastName || !email || !password || !accountType) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (req.user.accountType !== "SuperAdmin") {
            return res.status(403).json({
                success: false,
                message: "Only SuperAdmin can create new accounts"
            });
        }
        

        // Allowed account types
        const allowedAccountTypes = ["Admin", "Graphics", "Accounts", "Cutout","Display"];
        if (!allowedAccountTypes.includes(accountType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account type"
            });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exist",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        //create entry into db
        const user = await userModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType
        })

        await sendEmail(email, password, firstName,);

        return res.status(200).json({
            success: true,
            message: "user is created successfully",
        })

    } catch (error) {
        console.log("problem in user signup");
        return res.status(500).json({
            success: false,
            message: "user cannot be registered, please try again",
            error: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        //data validation
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "all fields are required"
            })
        }

        //user check
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user is not registered, please signup first"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is inactive. Please contact admin."
            });
        }

        //generate jwt token 
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                accountType: user.accountType,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;

            //create cookies and send response
            const options = {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged In successfully"
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failure, please try again",
            error: error.message
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const userInfo = req.user;
        
        const email = req.user.email;
        const accountType = req.user.accountType;
        const firstName = req.user.firstName;
        const lastName = req.user.lastName;

        return res.status(200).json({
            success: true,
            message: "user detail has been fetched successfully",
            firstName,
            lastName,
            email,
            accountType,
        })

    } catch (error) {
        console.log("get user mein problem h", error);
        return res.status(400).json({
            success: false,
            message: "problem in fetching detail of user",
            error: error.message
        })
    }
}


exports.getAllUsers = async (req, res) => {
    try {
        // Check if the user is authorized (SuperAdmin or Admin)
        if (req.user.accountType !== "SuperAdmin" && req.user.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to access this resource"
            });
        }

        // Fetch all users from database
        // Exclude password field from the response
        const users = await userModel.find({}, { password: 0 });

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching users",
            error: error.message
        });
    }
};

exports. getAllAdmin= async()=> {
    try {
        // Fetch all users from database
        // Exclude password field from the response
        const users = await userModel.find({ 
            accountType: { $in: ["Admin", "SuperAdmin","Viewer"] } 
        });
        
       
        return users;

    } catch (error) {
        console.error("Error fetching users:", error);
    }
}





exports.deleteUser = async (req, res) => {
    try {
        // Check if the logged-in user is a SuperAdmin
        if (req.user.accountType !== "SuperAdmin") {
            return res.status(403).json({
                success: false,
                message: "Only SuperAdmin can delete user accounts"
            });
        }

        // Get user ID to delete from request parameters
        const { userId } = req.params;

        // Validate if userId is provided
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Find the user to be deleted
        const userToDelete = await userModel.findById(userId);

        // Check if user exists
        if (!userToDelete) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent deletion of SuperAdmin accounts
        if (userToDelete.accountType === "SuperAdmin") {
            return res.status(403).json({
                success: false,
                message: "SuperAdmin accounts cannot be deleted"
            });
        }

        // Delete the user
        await userModel.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({
            success: false,
            message: "Error while deleting user",
            error: error.message
        });
    }
};




exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName, accountType ,  isActive} = req.body;

        // Validate input data
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        if (!firstName || !lastName || !accountType) {
            return res.status(400).json({
                success: false,
                message: "First name, last name, and account type are required"
            });
        }

        // Check if the user has permission (only SuperAdmin or Admin can update users)
        if (req.user.accountType !== "SuperAdmin" && req.user.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update user details"
            });
        }

        // Find the user to update
        const userToUpdate = await userModel.findById(userId);
        
        // Check if user exists
        if (!userToUpdate) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Additional validations and security checks
        
        // Check if trying to update a SuperAdmin (only SuperAdmin can update SuperAdmin)
        if (userToUpdate.accountType === "SuperAdmin" && req.user.accountType !== "SuperAdmin") {
            return res.status(403).json({
                success: false,
                message: "Only SuperAdmin can update SuperAdmin accounts"
            });
        }

        // Prevent changing SuperAdmin to another role
        if (userToUpdate.accountType === "SuperAdmin" && accountType !== "SuperAdmin") {
            return res.status(403).json({
                success: false,
                message: "SuperAdmin role cannot be changed"
            });
        }

        // Prevent regular Admin from changing another Admin's data
        if (userToUpdate.accountType === "Admin" && req.user.accountType === "Admin" && 
            userToUpdate._id.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Admins can only update their own profile"
            });
        }

        // Validate account type
        const allowedAccountTypes = ["SuperAdmin", "Admin", "Graphics", "Accounts", "Cutout", "Display"];
        if (!allowedAccountTypes.includes(accountType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account type"
            });
        }

        // Update the user
        userToUpdate.firstName = firstName;
        userToUpdate.lastName = lastName;
        
        // Only update account type if not changing a SuperAdmin
        if (!(userToUpdate.accountType === "SuperAdmin" && accountType !== "SuperAdmin")) {
            userToUpdate.accountType = accountType;
        }

        if (typeof isActive === "boolean") {
            userToUpdate.isActive = isActive;
        }
        
        await userToUpdate.save();

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {
                _id: userToUpdate._id,
                firstName: userToUpdate.firstName,
                lastName: userToUpdate.lastName,
                email: userToUpdate.email,
                accountType: userToUpdate.accountType,
                isActive: userToUpdate.isActive
            }
        });

    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({
            success: false,
            message: "Error while updating user",
            error: error.message
        });
    }
};

// Update your existing change-password function to work with admin updates

exports.changePassword = async (req, res) => {
    try {
        // Check if admin is updating a user's password or a user is changing their own
        const isAdminUpdate = req.body.userId && (req.user.accountType === "SuperAdmin" || req.user.accountType === "Admin");
        
        // If admin is updating someone else's password
        if (isAdminUpdate) {
            const { userId, newPassword } = req.body;
            
            // Validate inputs
            if (!userId || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: "User ID and new password are required",
                });
            }
            
            // Find the user to update
            const userToUpdate = await userModel.findById(userId);
            if (!userToUpdate) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            
            // Security checks
            // Check if trying to update a SuperAdmin (only SuperAdmin can update SuperAdmin)
            if (userToUpdate.accountType === "SuperAdmin" && req.user.accountType !== "SuperAdmin") {
                return res.status(403).json({
                    success: false,
                    message: "Only SuperAdmin can update SuperAdmin accounts"
                });
            }
            
            // Hash new password and update
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            userToUpdate.password = hashedNewPassword;
            await userToUpdate.save();
            
            return res.status(200).json({
                success: true,
                message: "Password updated successfully",
            });
        } 
        // If user is changing their own password (existing functionality)
        else {
            const { oldPassword, newPassword } = req.body;
            const userId = req.user.id;

            // Check if both old and new passwords are provided
            if (!oldPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Both old and new passwords are required.",
                });
            }

            // Fetch the user from the database
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
            }

            // Compare old password
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Old password is incorrect.",
                });
            }

            // Hash new password and update
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Password updated successfully.",
            });
        }
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again.",
            error: error.message,
        });
    }
};