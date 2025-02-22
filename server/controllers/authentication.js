const { User } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Ajv = require('ajv')
const ajv = new Ajv({ coerceTypes: false })

const loginSchema = {
  type: "object",
  properties: {
    email: {type: "string"},
    password: {type: "string"},
  },
  required: ["email", "password"],
  additionalProperties: false
}

const tokenValidation = async (req, res, next) => {

  User.findOne({
    where:{
      id: req.params.user_id
    }
  }).then((user)=>{
    if (!user) {
        return res.status(204).end()
      }
    res.json(user)
  }).catch((e)=>{
    const error = new Error(e.message);
    error.name = e.name
    return next(error)
  })
}

const login = async (req, res, next) => {
    const validate = ajv.compile(loginSchema)
    const valid = validate(req.body)

    if (!valid) {
      const error = new Error('Invalid Request body')
      error.name = 'ValidationError'
      return next(error)
    }
    try {
      const user = await User.findOne({where:req.param.user_id})
      if (!user) {
        return res.status(204).json({message:"user not found"})
      }
      const passwordValid = await bcrypt.compare(req.body.password, user.password)

      if (!(user.email === req.body.email  && passwordValid)) {
        const error = new Error("Invalid username or password");
        error.name = "ValidationError";
        return next(error)
      }
      const userToken = {
        email: user.email,
        id: user.id,
      }
      const token = jwt.sign(userToken, process.env.JWT, { expiresIn: 60*60 })
      res.json({ token });
    } 
    catch (e) {
      const error = new Error(e.message);
      error.name = e.name;
  
      return next(error)
    }
}

module.exports = {
  login,
}