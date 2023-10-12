const nodemailer = require('nodemailer'); //Sending Email Conformations and car updates

async function sendConfirmation(userEmail) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ronshaked07@gmail.com',
            pass: 'VDB8djw8dmd!hqz3rph'
        }
    });
    
    const details = {
        from: "ronshaked07@gmail.com",
        to: userEmail,
        subject: "Confirmation Email",
        text: `Here is your confirmation code: ${confirmationCode}`,
    }

    transporter.sendMail(details, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email Sent:', info.response);
        }
    });

    return confirmationCode;
}

function generateConfirmationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const confirmationCode = generateConfirmationCode();

module.exports = { sendConfirmation };
