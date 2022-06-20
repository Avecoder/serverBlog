import jwt from 'jsonwebtoken'


export default (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if(!token) throw new Error('Нет доступа')

    const decoded = jwt.verify(token, 'mdma')

    req.userId = decoded._id

    next()
  } catch (err) {
    return res.status(403).json({
      message: 'Нет доступа'
    })
  }
}
