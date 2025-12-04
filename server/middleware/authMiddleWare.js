import { AuthenticationError } from "../utils/errors";
import jwt from "jsonwebtoken";


export const authMiddleware = async function(req, res, next) {
  try {

    const header = req.get("Authorization");
    if (header == null || header.trim() === "") { // check if entire authorization header is null or undefined
      throw new AuthenticationError("Token is invalid.", {  })
    } else if (!header.startsWith("Bearer ")) { // check if token header starts with Bearer (case sensitive)
      throw new AuthenticationError("Token is invalid.", {  })
    }
  
    const headerArr = header.trim().split(" ");
  
    if (headerArr.length !== 2) {
      throw new AuthenticationError("Token is invalid.")
    }
  
    const token = headerArr[1];
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    req.user = { id: decoded.userId }

    next()
  } catch (error) {
    next(error);
  }
}