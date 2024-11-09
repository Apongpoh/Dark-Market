import jwt from 'jsonwebtoken'; // For sign in check
import { User } from '../../models/user';


/**
 *
 * @param req The HTTP Authorization request header can be used to provide credentials that authenticate a user agent with a server, allowing access to a protected resource.
 * @param res The header responds with a 401 Unauthorized or 200 for Authorized
 * @param id The user id
 * @returns a json object
 */
export const requireSigninAndAuth = async (req: any, res: any, id: any) => {

    const tokenObj = req.headers.authorization;

    if (!tokenObj) {
        return res.json({ msg: "Invalid or expired signature. Redirecting to sign in page..." });
    }

    try {
        const token = tokenObj.split(" ")[1]; // Bearer token

        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;

        if (req.user._id !== id) {
            return res.json({ msg: "Action not authorized" });
        }

    } catch (err) {
        return res.json({ msg: "Invalid or expired signature. Redirecting to sign in page..." });
    }
}

/**
 *
 * @param req The HTTP Authorization request body can be used to provide credentials that authenticate a user agent with a server, allowing access to a protected resource.
 * @param res The body responds with a 401 Unauthorized or 200 for Authorized
 * @param id The user id
 * @returns a json object
 */
export const isVendor = async (req: any, res: any, id: any) => {
    
    await User.findById(id)
        .exec()
        .then((user: any) => {
            if (user.role === 0) {
                return res.json({ msg: "Action not authorized. Vendor resource only" });
            }
        })
        .catch(() => res.json({ msg: "Invalid user" }));
};

/**
 *
 * @param req The HTTP Authorization request body can be used to provide credentials that authenticate a user agent with a server, allowing access to a protected resource.
 * @param res The body responds with a 401 Unauthorized or 200 for Authorized
 * @param id The user id
 * @returns a json object
 */
export const isAdmin = async (req: any, res: any, id: any) => {
    
    await User.findById(id)
        .exec()
        .then((user: any) => {
            if (user.role !== 2) {
                return res.json({ msg: "Action not authorized. Vendor resource only" });
            }
        })
        .catch(() => res.json({ msg: "Invalid user" }));
};