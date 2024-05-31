const customerModel = require('../models/customerModel');
const dotenv = require('dotenv');
dotenv.config();

const customerCreate = async(req,res)=>{
    // let payload = req.body;
    // console.log("create Customer: ", payload);
    try{
        const {name,email,mobile_no,address,profile_image} = req.body;

        if ( !name || !email || !mobile_no || !address || !profile_image) {
            return res.json({ 
              status:400,
              message:"All fields are mandatory!",
              data:[]
           });
        }
        const customerExists = await customerModel.findOne({email:req.body.email});
        console.log(customerExists,'customerExists');

        if(customerExists)
        {
            console.log("Email already Exists")
            return res.status(400).json({status: 400,message:"Customer already exists"})
        }

      
        const customerData = await customerModel.create({name,email,mobile_no,address,profile_image})
        
        return res.status(200).json({status: 200, message:"Customer created Successfully",data: customerData})
    }
    catch(error)
    {
        console.log(`error is ${error}`)
        return res.status(500).json({ error: "Internal server error" });
    }

};


const customerUpdate = async(req,res)=>{
    try
        {
            const getId = req.params.id;
            // const getUserData = req.body;
            const {name,email,mobile_no,address,profile_image} = req.body;
            const updatedAt = Date.now();
            const updateCustomerDetails = await customerModel.updateOne({_id:getId},{name,email,mobile_no,address,profile_image,updatedAt:updatedAt})
            if(updateCustomerDetails)
            {
                return res.status(200).json({status:200,message:"Customer details updated successfully"})
            }
        }
        catch(error)
        {
            console.log(error)
            return status(500).json({status:500,message:error.toString()})
        }
}

const customerGetAll = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1; // Default page 1
        const limit = parseInt(req.query.limit) || 10; // Default limit 10

        // Search parameters
        const searchQuery = req.query.searchVal;

        // query conditions
        const conditions = {};
        if (searchQuery) {
            conditions.$or = [
                { name: { $regex: new RegExp(searchQuery, 'i') } },
                { email: { $regex: new RegExp(searchQuery, 'i') } },
                { mobile_no: searchQuery }
            ];
        }

        const allCustomerInfo = await customerModel.find(conditions)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalCount = await customerModel.countDocuments(conditions);

        // Update profile_image URLs
        allCustomerInfo.forEach(item => {
            if (item.profile_image) {
                item.profile_image = process.env.IMAGE_PATH_URL + item.profile_image; 
            }
        });

        if(allCustomerInfo.length > 0){
            return res.json({
            status: 200,
            message: "Customer listed successfully",
            data: allCustomerInfo,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                itemsPerPage: limit
            }
        });
    } else {
        return res.status(400).json({status:400,message:"No data found",data:[]})

    }
    } catch (error) {
        return res.status(501).json({
            code: 501,
            message: error.message,
            error: true,
        });
    }
}


const customerView = async(req,res)=>{
    try
    {
        const getId = req.params.id;
        const customerData = await customerModel.findOne({_id:getId})
        if(customerData)
        {
            return res.status(200).json({status:200,message:"Customer details viewed successfully",data:customerData})
        } else {
            return res.status(400).json({status:400,message:"Customer not found",data:[]})
        }
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).json({
            code: 500,
            message: error.message,
            error: true,
          });
    }
}

const customerDelete = async(req,res)=>{
    try
    {
        const getId = req.params.id;
        const deleteCustomer = await customerModel.deleteOne({_id:getId})
        if(deleteCustomer)
        {
            return res.status(200).json({status:200,message:"Customer deleted successfully"})
        } else {
            return res.status(400).json({status:400,message:"Customer not found",data:[]})
        }
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).json({
            code: 500,
            message: error.message,
            error: true,
          });
    }
}

module.exports = {customerCreate, customerGetAll, customerUpdate, customerView, customerDelete}