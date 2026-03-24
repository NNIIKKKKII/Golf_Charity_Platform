import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000
})

export const sendEmail = ({ to, subject, html }) => {
    transporter.sendMail({
        from: `"GolfCharity" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    }, (err, info) => {
        if (err) {
            console.error('Email error:', err.message)
        } else {
            console.log('Email sent:', info.response)
        }
    })
}