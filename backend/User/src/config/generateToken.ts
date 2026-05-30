import jwt from 'jsonwebtoken'

const jwtSecret= process.env.JWT_SECRET as string

export const generateToken = (user: any, deviceId:any) => {
  const accessToken= jwt.sign(
    {
      id: user.id,
      college_id:user.college_id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "15d"}
  );

  const refreshToken= jwt.sign(
    {
      id: user.id,
      deviceId,
    },
    process.env.JWT_SECRET as string,
    {expiresIn: "15d"}
  );
  return {accessToken, refreshToken}
};