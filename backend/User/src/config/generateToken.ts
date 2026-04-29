import jwt from 'jsonwebtoken'

const jwtSecret= process.env.JWT_SECRET as string

export const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    jwtSecret,
    { expiresIn: "7d" }
  );
};