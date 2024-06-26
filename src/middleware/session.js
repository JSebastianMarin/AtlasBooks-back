import { tokenVerify } from "../utils/handleJWT.js";
import { pool } from "../db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send({
        message: "Not_Token",
      });
    }

    const dataToken = await tokenVerify(token);

    if (!dataToken.id) {
      return res.status(401).send({
        message: "Error_Token_Id",
      });
    }

    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      dataToken.id,
    ]);

    //verify if the user exists
    if (user.rows.length === 0) {
      return res.status(401).send({
        message: "User_Not_Found",
      });
    }

    //verify if the user is active
    if (!user.rows[0].statusu) {
      return res.status(401).send({
        message: "User_Not_Active",
      });
    }

    req.user = {
      id: user.rows[0].id,
      name: user.rows[0].nameu,
      email: user.rows[0].email,
      nickname: user.rows[0].nickname,
      country: user.rows[0].country,
      registerDate: user.rows[0].registerdate,
      isAdmin: user.rows[0].isadmin,
      pathProfilePic: user.rows[0].pathprofilepic,
    };

    next();
  } catch (err) {
    return res.status(401).send({
      message: err.message,
    });
  }
};
