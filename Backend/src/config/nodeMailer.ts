import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

export const sendOtpEmail = async (email: string, otp: string, isResend: boolean = false) => {
    const subject = isResend ? 'Resend OTP Verification' : 'OTP Verification';
    const message = isResend
        ? `<p style="color: #555; font-size: 1.1em; text-align: center;">We noticed that you requested another OTP. Use the following OTP to complete your sign-up procedures.</p>`
        : `<p style="color: #555; font-size: 1.1em; text-align: center;">Thank you for choosing MedCare. Use the following OTP to complete your sign-up procedures.</p>`;

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject,
        text: `Your OTP code is ${otp}`,
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #333; text-align: center;">Verify Your Email Address</h1>
            ${message}
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
        await transporter.sendMail(mailOptions);
        console.log('Mail sent');
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error('Email not sent');
    }
};

export const sendVerificationEmail = async (email: string) => {
    const subject = 'Doctor Registration Verified';
    const message = `
        <p style="color: #555; font-size: 1.1em; text-align: center;">
            Congratulations! Your registration has been successfully verified.
        </p>
        <p style="color: #555; text-align: center; font-size: 0.9em;">
            You can now start using the MedCare platform. Thank you for your patience.
        </p>
        <p style="color: #555; text-align: center; font-size: 0.9em;">
            Regards,<br />MedCare Team
        </p>
    `;

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject,
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #333; text-align: center;">Registration Verified</h1>
            ${message}
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #aaa; text-align: center; font-size: 0.8em;">© 2024 MedCare. All rights reserved.</p>
        </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Verification email not sent');
    }
};

export const sendRejectionEmail = async (email: string) => {
    const subject = 'Doctor Registration Rejected';
    const message = `
        <p style="color: #555; font-size: 1.1em; text-align: center;">
            We regret to inform you that your registration has been rejected.
        </p>
        <p style="color: #555; text-align: center; font-size: 0.9em;">
            If you have any questions or need further clarification, please contact our support team.
        </p>
        <p style="color: #555; text-align: center; font-size: 0.9em;">
            Regards,<br />MedCare Team
        </p>
    `;

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject,
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #333; text-align: center;">Registration Rejected</h1>
            ${message}
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #aaa; text-align: center; font-size: 0.8em;">© 2024 MedCare. All rights reserved.</p>
        </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Rejection email sent');
    } catch (error) {
        console.error('Error sending rejection email:', error);
        throw new Error('Rejection email not sent');
    }
};
