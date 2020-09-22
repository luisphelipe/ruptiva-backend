const jwt = require('jsonwebtoken')

export default (req, res, next) => {
  // authorization: Bearer {token}
  let token = req.headers['authorization']

  if (!token)
    return res.status(401).json({ message: 'Missing authentication token.' })

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.PRIVATE_KEY)
    req.user = decoded
    next()
  } catch (ex) {
    return res.status(400).json({ message: 'Invalid token.' })
  }
}
