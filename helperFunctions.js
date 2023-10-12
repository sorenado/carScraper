const nodemailer = require("nodemailer"); //Sending Email Conformations and car updates

async function sendConfirmation(userEmail) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ronshaked07@gmail.com",
      pass: "sknf irxh yhaa uhjq",
    },
  });

  const details = {
    from: "ronshaked07@gmail.com",
    to: userEmail,
    subject: "Confirmation Email",
    text: `Here is your confirmation code: ${confirmationCode}`,
  };

  transporter.sendMail(details, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email Sent:", info.response);
    }
  });

  return confirmationCode;
}

function generateConfirmationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const confirmationCode = generateConfirmationCode();

async function hashStringToBase64(input) {
  // Convert the input string to an ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  // Use the SubtleCrypto API to create a hash
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert the hash result to a Base64 string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBase64 = btoa(String.fromCharCode(...hashArray));

  return hashBase64;
}

module.exports = { sendConfirmation, hashStringToBase64 };
