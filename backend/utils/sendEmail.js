const nodemailer = require('nodemailer')

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,       
      pass: process.env.EMAIL_APP_PASS   
    }
  })

  const mailOptions = {
    from: `"Feedback App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html
  }

  const response = await transporter.sendMail(mailOptions)
  console.log(response)
}

module.exports = sendEmail
