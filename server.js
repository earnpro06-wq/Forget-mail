const express = require('express');
const cors = require('cors'); 
const nodemailer = require('nodemailer');
const admin = require("firebase-admin");
const bodyParser = require('body-parser');

const app = express();

// মিডলওয়্যার সেটআপ
app.use(cors()); 
app.use(bodyParser.json());

// ১. ফায়ারবেস সেটআপ
const serviceAccount = {
  "type": "service_account",
  "project_id": "bet-baji-vip",
  "private_key_id": "4086db5c480b45dd4b61c08a635e162c5230b668",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC9fOcZRdd1slDu\nbNQB/JQR810Aw4JpuRhbQ9woSFrnN4qozCTWa0vQHtU/yNR364jywgS6C1Lywzu8\nBJkPFTYuW0o2vz00rlWaAbeREVu6A42rOe4BycGTEGsMFOAgxZLJXhvi/wWSgf10\nyfWBK42H+PC1q2kh5Sj6/ScdJJf9K6erdAeZy9Ta/HFKMIpT+lZXgJA4NMDqxp8h\ndjEOhwWNpHaW0e9z7NJNUB+0lwoXQ4FgiibLZIec34XsKucqKMOr/tRbtkHWc9Vw\n/aSbTCRRzVp0foad/0fAaX93mHtTy5upD5ovuosqaWMgJAb7Kvfn48QfxcTKDcKP\nZzkjCTy1AgMBAAECggEAAgfJ2Sc6rw/tVpSzc97/Pi7/pt+xcM0TMf0o6YSW9sXN\nVlAzr9l/+zetXMzb2/oZ4lIKZ2zyI1hMtk/NTRBS343KXopPj1Yz5B3TF/qZ40Ug\n+j35ayr8iEUjhIJfwXIkh8Rao6TMbDy42MzGNO9gyZ11BNlUm9CfDwtx5RnMiCGw\nJFysGUKotqNxOIBngYQp7C72viR6wxYeeWi+Ex+RvTPmXhziuP6kR8a7hyheXFpt\n9//XEtCZ1FdgKOmvZQJnEIR0CVhD1mh/vExpXGPqnKsozmh7YiQkGjHaG7IFWQJu\nNHaUgi4lOckdl6GJgyZJU0E5GS/PDeFyWcRgOqf4QQKBgQDqQBhZqzKy02ZiRyNn\neikolwNzWAg+v2WBeD34E1dir/voSWQc8w8lr37vqZfeX6RNm+5NcGeI6Ta0d/LO\n/nfgCb7qdUtVFQKh5N3RYbNgsj5VRd/B4v2nVMisXdCIbqCZ2zV8JayEa40WdjT7\n1QPBdA+TTYsfk7wKNoAyYEHfQQKBgQDPFNjSryo6+8XddGDjFbj1fFxUs/uxzzGF\nXPODH5Z8w1xXQHyOGqlDHH2wCZOIaZhXPuQvJhDmqb32E5Sq1ABVIHdN8xEW+rwn\nUWEceqhY9q0x/wiP07H5+bmvcwwC7IoqZfHSqpRlAUPfwgmaWJ/irwyoPeTj2Cz/\nz5HQ41U0dQKBgQCMobg8tRP12gaAf/bYW7W0AZ13tOUWTq+w37BMa8gtnjucw9rP\nqnhwhoCtf2KGhWLNmQyi/xWZU3GdPNnPvWPYY+FzPsHgLYHsEcu9tWsMZVYYuZ9Q\n9maT+8mR+ayFC+1tEPZ2NuPwh+UnFAZRHhxoGrZzF72rUnU0qG2kULebQQKBgQCe\nZIO0IudaVlnyGaJCD8t5ebXl1AUg7CokqARatz6UD5oB4wFicGInQxOgIrMGFD7B\n/QjsR2GGDS+PmUqNn7rhYgPfS5w2x3JDYKu27Nr3sTaolzolSPdJDQpKeOUnF2ZX\nJ8LgMDlxSJZyACj4NfGVoe88gJsi66b/w/T0oe36QQKBgFO0HPqY1anrh/lTTpmh\ni9KvP8GziJmirHQ46h71oUjmYILnl4yAayRHJmVYt2UdJjsib3fsmwnJS3HhRF7X\nm27nMZ89UHVH7FiV9n17/EK9EvDQRPTGwOQFUsth1LhjOVIhBImXG969XBMNelc1\nEj/lKwur9qJlNklrTqnPvSaB\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@bet-baji-vip.iam.gserviceaccount.com",
  "client_id": "106184706095971470150",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40bet-baji-vip.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// সার্ভার রুট
app.get('/', (req, res) => {
    res.send("BET-BAJI API ইজ রানিং...");
});

// ২. পাসওয়ার্ড ভুলে গেলে ওটিপি পাঠানোর এপিআই
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Nodemailer কনফিগারেশন আপডেট করা হয়েছে (Render এর জন্য)
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Port 465 এর জন্য true
        auth: {
            user: 'earnpro06@gmail.com',
            pass: 'pknkpxyzrmtgxhua' // আপনার জিমেইল অ্যাপ পাসওয়ার্ড
        },
        tls: {
            rejectUnauthorized: false // কানেকশন সমস্যা এড়াতে এটি যোগ করা হয়েছে
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
        console.error("Email Error:", error);
        res.status(500).json({ success: false, message: "ইমেইল পাঠাতে সমস্যা হয়েছে।", error: error.message });
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
        const userQuery = await db.collection("users").where("email", "==", email).get();
        
        if (userQuery.empty) {
            return res.status(404).json({ success: false, message: "ইউজার পাওয়া যায়নি!" });
        }

        const userDocId = userQuery.docs[0].id;
        await db.collection("users").doc(userDocId).update({
            password: newPassword 
        });

        await db.collection("password_resets").doc(email).delete();

        res.status(200).json({ success: true, message: "পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে।" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`সার্ভার চলছে পোর্ট: ${PORT}`);
});
