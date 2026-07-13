


// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const sendGreetingEmail = async (toEmail, userName = "") => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,  
//       pass: process.env.EMAIL_PASS,  
//     },
//   });

//   const mailOptions = {
//   from: `"Avdhut" <${process.env.EMAIL_USER}>`,
//   to: toEmail,
//   subject: "Congrajulations✨",
//   html: `
// <div style="background-color:#0b0b0b; color:#ffffff; padding:40px 20px; font-family:Arial, sans-serif;">
//   <table style="max-width:600px; margin:0 auto; border-spacing:0; width:100%;">
    
//     <!-- Header -->
//     <tr>
//       <td style="text-align:center; padding-bottom:25px;">
//         <h1 style="margin:0; font-size:26px; color:#4f9cff;">
//           Welcome to Fediverse 🚀
//         </h1>
//         <p style="margin-top:10px; font-size:14px; color:#bbbbbb;">
//           Connect. Share. Decentralize.
//         </p>
//       </td>
//     </tr>

//     <!-- Body -->
//     <tr>
//       <td style="background-color:#111111; padding:30px; border-radius:12px;">
//         <p style="font-size:16px; line-height:1.6; margin:0 0 15px 0;">
//           Hi ${userName || "there"} 👋,
//         </p>

//         <p style="font-size:15px; line-height:1.6; color:#dddddd; margin:0 0 20px 0;">
//           Thank you for signing up on <strong>Fediverse</strong> ✨  
//           We're excited to have you join a decentralized and open community where your voice truly matters.
//         </p>

//         <p style="font-size:15px; line-height:1.6; color:#dddddd; margin:0 0 25px 0;">
//           Get started by exploring communities, connecting with people, and sharing your thoughts freely 🌍
//         </p>

//         <!-- CTA -->
//         <div style="text-align:center;">
//           <a href="https://your-fediverse-app-link.com"
//              style="display:inline-block; background-color:#4f9cff; color:#ffffff;
//                     padding:12px 28px; border-radius:30px; font-size:15px;
//                     text-decoration:none; font-weight:bold;">
//             Explore Fediverse
//           </a>
//         </div>
//       </td>
//     </tr>

//     <!-- Footer -->
//     <tr>
//       <td style="text-align:center; padding-top:25px;">
//         <p style="font-size:13px; color:#888888; margin:0;">
//           If you have any questions, just reply to this email 💬
//         </p>
//         <p style="font-size:13px; color:#888888; margin-top:8px;">
//           — Team Fediverse 💙
//         </p>
//       </td>
//     </tr>

//   </table>
// </div>
// `
// };


//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Greeting email sent:", info.response);
//     return true;
//   } catch (error) {
//     console.error("Error sending greeting email:", error);
//     return false;
//   }
// };

// module.exports = sendGreetingEmail;

const nodemailer = require("nodemailer");

const sendGreetingEmail = async (toEmail, userName = "") => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "EMAIL_USER or EMAIL_PASS is missing in .env"
    );
  }

  if (!toEmail) {
    throw new Error("Receiver email is required");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  
  await transporter.verify();

  const mailOptions = {
    from: `"Avdhut" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Congratulations ✨",
    html: `
      <div style="background-color:#0b0b0b; color:#ffffff; padding:40px 20px; font-family:Arial, sans-serif;">
        <table style="max-width:600px; margin:0 auto; border-spacing:0; width:100%;">

          <tr>
            <td style="text-align:center; padding-bottom:25px;">
              <h1 style="margin:0; font-size:26px; color:#4f9cff;">
                Welcome to Fediverse 🚀
              </h1>

              <p style="margin-top:10px; font-size:14px; color:#bbbbbb;">
                Connect. Share. Decentralize.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#111111; padding:30px; border-radius:12px;">
              <p style="font-size:16px; line-height:1.6; margin:0 0 15px 0;">
                Hi ${userName || "there"} 👋,
              </p>

              <p style="font-size:15px; line-height:1.6; color:#dddddd; margin:0 0 20px 0;">
                Thank you for signing up on
                <strong>Fediverse</strong> ✨
                We're excited to have you join a decentralized
                and open community where your voice truly matters.
              </p>

              <p style="font-size:15px; line-height:1.6; color:#dddddd; margin:0 0 25px 0;">
                Get started by exploring communities,
                connecting with people, and sharing your thoughts freely 🌍
              </p>

              <div style="text-align:center;">
                <a
                  href="${process.env.FRONTEND_URL || "#"}"
                  style="
                    display:inline-block;
                    background-color:#4f9cff;
                    color:#ffffff;
                    padding:12px 28px;
                    border-radius:30px;
                    font-size:15px;
                    text-decoration:none;
                    font-weight:bold;
                  "
                >
                  Explore Fediverse
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="text-align:center; padding-top:25px;">
              <p style="font-size:13px; color:#888888; margin:0;">
                If you have any questions, just reply to this email 💬
              </p>

              <p style="font-size:13px; color:#888888; margin-top:8px;">
                — Team Fediverse 💙
              </p>
            </td>
          </tr>

        </table>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("✅ Greeting email sent:", info.messageId);

  return info;
};

module.exports = sendGreetingEmail;