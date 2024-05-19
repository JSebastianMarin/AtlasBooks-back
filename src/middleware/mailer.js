import { transporter } from "../utils/mailer.js";
import jwt from "jsonwebtoken";

export const sendMail = async (req, res, email) => {
  try {
    const tokenmail = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    const verficationLink = `http://localhost:5173/verify-email?email=${tokenmail}`;

    await transporter.sendMail({
      from: `"New Email" <${process.env.MAILER_USER}>`,
      to: email,
      subject: "New Email",
      html: `<b>Porfavor presiona en el siguiente link, o copialo en tu navegador para completar la verificación:</b>
             <a href=${verficationLink}>${verficationLink}</a>`,
    });
  } catch (err) {
    return res.status(401).json({
      message: err.message,
      data: err,
    });
  }
};