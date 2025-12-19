const jwt = require("jsonwebtoken");
const { pool } = require("../../../database/dbPool");

const checkUserId = async (email) => {
  const query = `
    SELECT
        *
    FROM
        user
    WHERE
        email = ? AND
        is_user_active = 1;
`;

  const values = [email];

  try {
    const [result] = await pool.query(query, values);
    if (result.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    return error;
  }
};

const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(400).send("Access denied");
  let authToken = token.split(" ");

  if (authToken[1] === "undefined" || authToken[1] === "null") {
    return res.status(400).send("Invalid token");
  }

  jwt.verify(
    authToken[1],
    process.env.SECRET_ACCESS_TOKEN,
    async (err, user) => {
      if (err) {
        console.error("JWT Verification Error:", err);
        return res.status(400).send("Invalid token");
      }
      const { id, email } = user;
      try {
        const isUserExist = await checkUserId(email);
        if (isUserExist === true) {
          req.auth = {
            id,
            email,
          };
          next();
        } else {
          return res.status(400).send("Invalid user");
        }
      } catch (error) {
        return res.status(400).send("Invalid user");
      }
    }
  );
};

module.exports = {
  authenticateToken,
};
