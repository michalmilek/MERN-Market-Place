"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header is missing",
            });
        }
        if (typeof authHeader === "string") {
            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Token is missing",
                });
            }
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.jwt_secret);
            if (!decodedToken) {
                return res.status(401).json({
                    success: false,
                    message: "Token is invalid",
                });
            }
            req.body.userId = decodedToken.userId;
            /* const token = req.header("Authorization") ? req.header("Authorization").split(" ")[1] : undefined;
            if(token) {
    
                const decryptedToken = jwt.verify(
                    token,
                    process.env.jwt_secret as string
                    ) as { userId: string };
                    req.body.userId = decryptedToken.userId
                }
                else {
                    res
                      .status(401)
                      .send({
                        success: false,
                        message: "Authorization header is missing",
                      });
                } */
            next();
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
//# sourceMappingURL=authMiddleware.js.map