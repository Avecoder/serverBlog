
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import UserModel from '../models/User.js'


export const register = async (req, res) => {
  try {

    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarURL: req.body.avatarURL,
      passwordHash: hash
    })

    const user = await doc.save()

    const token = jwt.sign({
        _id: user._id
      },
      'mdma',
      {
        expiresIn: '30d'
      }
    )

    const {passwordHash, ...userData} = user._doc

    return res.status(200).json({...userData, token})
  } catch(err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось зарегистрироваться'
    })
  }
}


export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({email: req.body.email})

    if(!user) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      })
    }



    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

    if(!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль'
      })
    }


    const token = jwt.sign({
        _id: user._id
      },
      'mdma',
      {
        expiresIn: '30d'
      }
    )

    return res.status(200).json({
      ...user._doc,
      token
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось авторизоваться'
    })
  }
}


export const getMe = async (req, res) => {
  try {

    const user = await UserModel.findById(req.userId)

    if(!user) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      })
    }

    const {passwordHash, ...userData} = user._doc

    return res.status(200).json({...userData})

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось получить информацию'
    })
  }
}
