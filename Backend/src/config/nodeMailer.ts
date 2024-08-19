import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

export const sendOtpEmail = async (email: string, otp: string) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP code is ${otp}`,
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

            <h1 style="color: #333; text-align: center;">Verify Your Email Address</h1>
            <p style="color: #555; font-size: 1.1em; text-align: center;">Thank you for choosing MedCare. Use the following OTP to complete your sign-up procedures.</p>
            <div style="background-color: #55C3A6; color: #fff; text-align: center; padding: 20px; border-radius: 8px; font-size: 2em; font-weight: bold; margin: 20px auto; width: fit-content;">
                ${otp}
            </div>
            <p style="color: #555; text-align: center; font-size: 0.9em;">If you did not request this, please ignore this email.</p>
            <p style="color: #555; text-align: center; font-size: 0.9em;">Regards,<br />MedCare Team</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #aaa; text-align: center; font-size: 0.8em;">© 2024 MedCare. All rights reserved.</p>
        </div>
    `,
};

    try {
        await transporter.sendMail(mailOptions)
        console.log('mailsend');
    } catch(error) {
        console.error('error sending otp', error);
        throw new Error('email not send')
    }
}