import jwt from 'jsonwebtoken'

export const generateAccessToken = (
  payload,
  secret = process.env.ACCESS_TOKEN_SECRET,
  options = { expiresIn: '1d' }
) => {
  return jwt.sign(payload, secret, options)
}

export const verifyToken = (
  token,
  secret = process.env.ACCESS_TOKEN_SECRET
) => {
  const res = jwt.verify(token, secret, (err, decoded) => ({
    error: err,
    result: decoded,
  }))

  return res
}
