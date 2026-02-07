const express = require('express');
const nodemailer = require('nodemailer');
const admin = require("firebase-admin");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// ১. ফায়ারবেস সেটআপ (আপনার দেওয়া তথ্য অনুযায়ী)
const serviceAccount = {
  "project_id": "bet-baji-vip",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDD5LRY++1pF3Wn\njrJd+seePn4vQIFu7ohZur7TBgn02vwV6bwQJAj0Qnwj6e/3Eorw82wJxyQlkcVl\nLX58TfMg3H9/OZmVhaWLPzcfXM3r4nd7/JcQybA66SanTk93XvT8wiTFUpdc7c0O\nUc/CPL6ZReTnhx1+Y4Himp44EZ37BFJHQDLOshTOOGEdhzDugdlwfJiX9uHq196V\n9U4cftzBW95PVdcPuD/9fHbL++bqjJklRXheBCYz1ZZCtghWDGoisfT31+W5fw7x\nMdSMsf8LSr6UOrmNZSuhs0hsMWMhKql71wtWGBio0vliQ0pvdKUEBFDay/lhyVL0\nR1W/m40FAgMBAAECggEAVgzebiJIYTw1aiPEVYUmb+xquK4AzW6JxcTDM2Z5NC6H\nwsZ4Xqy9pDKaXppSV3m1P+/mGwt35Or6R54q7Ea/kMVbWlM+lJBvLlJYD/ZP3JkQ\PI4x++Vk/RPS73Z2cOzs+CT+SxGjPOaXB33Hoj7VyPWLfmr7eTwT36tk6iNO/uba\n14bKBd8MVF6m1bG25PRIzGTOIZs7/HXnnjlDr+KZRXeSbNv5pWhmXQyH1gqQ3tKI\nlc6ENRRF+GSZw1uua+ZwmVlVc2b3d336sWlN23DnTQ/fL2SgBEGCs056S2uYgz8Z\nWC1GTCZ39qPEeKgQPTUxHY9U+6PC6Dqr9bi9BsjeRwKBgQD3ZM+y1C3C7EauFXjG\nmqcdDVSRLV49isOjLupXseZdNjqSfQqdYUftMdCrI/tI/oEvU76W5QmuB4ZUuAyn\nLLKtqB0G448W13HJ8iCsQ/6y3k5Mdvyts/29dHANUpIa6rMsPfDFxgQfVu+Q8Nle\n9vhJY1ZuIkxXG7h35F4G0TuqAwKBgQDKtUBYz3anozePnBxM00yefmpLksKZqaJB\nxvm61M3wvTxkdEHW3Fq+VjY3XYQI2skDqwEBREJ+SQAbg3RudHrDRSSrTum6FX69\ZqVsTfU7nALZvo6vCRN+ui31kQosm4qrXm5yQuXuqm/qm1Y7naS45xTGdNILTWkJ\nMVBla4BCVwKBgCMyaIpcvZX536Rs0Z4P6q6rctikx7+humvBBP4tBUVFrdehip0R\ndhY8/B8dI2cjLmX5WChHtbTYxTfQZ5xxM4qZXGfagEUTqdC9bgCUO+xezGz8kL51\n2SfXJQoAMWE6+vrUZSj+HyAGUlcgrQxhvrlSNL2+i3XL7l++BGoOwDZAoGBALbL\nihJMS8jSQ7lKYq7Y4MAQaZRq7Pea5EoCv5K+clQEoiBIQlMadO4tWkjFGNrPSPP4\n0jgtMPUmqWUmPumYOlg60t10lQqMdbUgik5HYrz1bBClaY/oVF80T1uiBpXBUeRF\njL2XHDgEFFZw6+totnFTWQW5tOwiS3TRtpkuvwOTAoGBAOMbWLaTtyUuYHQZDDcR\noNq5WIvLQaKWWr35sUhunDL9x8+cVvcRzYWYKscKaUyGkYN23vo8GYTx8CUdtEIk\ntY0x10+UXDlzfHroF31X+1h/fR16IHInCd61UODCTgBBARFhBiuHADBNKjUZ9zXs\nABXI5MtjI9H9a1CaSCoHn1jq\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@bet-baji-vip.iam.gserviceaccount.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// ২. পাসওয়ার্ড ভুলে গেলে ওটিপি পাঠানোর এপিআই
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'earnpro06@gmail.com',
            pass: 'pknkpxyzrmtgxhua'
        }
    });

    let mailOptions = {
        from: '"BET-BAJI VIP" <earnpro06@gmail.com>',
        to: email,
        subject: 'পাসওয়ার্ড রিসেট ভেরিফিকেশন কোড',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #2d89ef;">BET-BAJI Password Recovery</h2>
                <p>আপনার অ্যাকাউন্ট রিসেট করার জন্য নিচের কোডটি ব্যবহার করুন:</p>
                <h1 style="background: #fdfdfd; padding: 10px; border: 1px dashed #ccc; text-align: center; letter-spacing: 5px;">${resetCode}</h1>
                <p>এই কোডটি ১০ মিনিটের জন্য কার্যকর থাকবে।</p>
                <p>ধন্যবাদ!</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        await db.collection("password_resets").doc(email).set({
            code: resetCode,
            status: "pending",
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(200).json({ success: true, message: "ইমেইল পাঠানো হয়েছে!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "ইমেইল পাঠাতে সমস্যা হয়েছে।" });
    }
});

// ৩. ওটিপি ভেরিফাই করার এপিআই
app.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;
    try {
        const doc = await db.collection("password_resets").doc(email).get();
        if (!doc.exists) {
            return res.status(400).json({ success: false, message: "কোনো রিকোয়েস্ট পাওয়া যায়নি!" });
        }
        if (doc.data().code === code) {
            res.status(200).json({ success: true, message: "কোড সঠিক!" });
        } else {
            res.status(400).json({ success: false, message: "ভুল কোড!" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "সার্ভার সমস্যা!" });
    }
});

// ৪. নতুন পাসওয়ার্ড আপডেট করার এপিআই
app.post('/update-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        // এখানে আপনার ইউজার কালেকশনের নাম 'users' ধরে নিয়ে পাসওয়ার্ড আপডেট করা হচ্ছে
        const userQuery = await db.collection("users").where("email", "==", email).get();
        
        if (userQuery.empty) {
            return res.status(404).json({ success: false, message: "ইউজার পাওয়া যায়নি!" });
        }

        const userDocId = userQuery.docs[0].id;
        await db.collection("users").doc(userDocId).update({
            password: newPassword // নিরাপত্তা স্বার্থে পরে এখানে হ্যাশিং যোগ করতে পারেন
        });

        // পাসওয়ার্ড আপডেট হলে রিসেট রিকোয়েস্টটি ডিলিট করে দেওয়া ভালো
        await db.collection("password_resets").doc(email).delete();

        res.status(200).json({ success: true, message: "পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে।" });
    }
});

// ৫. সার্ভার পোর্ট সেটআপ
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`সার্ভার চলছে পোর্ট: ${PORT}`);
});