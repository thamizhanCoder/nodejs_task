const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const forgotRoute = require('./routers/forgotRoute');
const customerRoute = require('./routers/customerRoute');
const nodemailer = require('nodemailer');

const AWS = require('aws-sdk');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
app.use(bodyParser.json());
dotenv.config();

const PORT = process.env.PORT || 3000;
const DBURL = process.env.DBURL;

// connection

    mongoose.connect(DBURL).then(()=>{
        console.log("DB Connected Successfully");
        app.listen(PORT, ()=>{
            console.log("Server is running on port :"+ PORT);
        })
    })
    .catch(error => console.log(error));


    // start the cloudinary code
const upload = multer();
console.log(process.env.AWS_REGION, ";kjilhkjlhkjhjkh")
// Configure AWS SDK
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        console.log(file, "file ***************")
        if (!file) {
            return res.status(400).json({
                status: false,
                message: 'No file uploaded'
            });
        }

        const extension = path.extname(file.originalname) || ".png";
        const random = uuidv4();
        const filename = `file-${Date.now()}-${random}${extension}`;
        const mimeType = file.mimetype;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filename,
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: mimeType,
            ContentDisposition: 'inline'
        };

        const data = await s3.upload(params).promise();

        return res.status(200).json({
            status: true,
            message: 'File uploaded successfully',
            data: filename,
            show_url: data.Location,
            keyword: 'success'
        });
    } catch (e) {
        return res.status(500).json({
            status: false,
            message: 'Error for file upload',
            data: e.message
        });
    }
});
//end the cloudinary code


// start the sending bulk emails
app.post('/send-emails', async (req, res) => {
    let emailsAry = ['nkamesh1996@gmail.com', 'kamesh@technogenesis.in', 'tgssbackend@gmail.com'];
    const { subject, text } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: 'kamesh@technogenesis.in',
                pass: ''
            }
        });

        const promises = emailsAry.map(async (email) => {
            await transporter.sendMail({
                from: 'kamesh@technogenesis.in',
                to: email,
                subject: subject,
                text: text
            });
        });

        await Promise.all(promises);

        res.json({ success: true, message: 'Emails sent successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
//end the sending bulk emails

app.use("/api/",forgotRoute);
app.use('/api/',customerRoute);