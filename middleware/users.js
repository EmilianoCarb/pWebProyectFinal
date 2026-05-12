import jwt from "jsonwebtoken";

const userMiddleware = {
    validateRegister: (req, res, next) => 
    {
        const { email, password, password_repeat } = req.body;
        if(!email || !email.includes('@'))
        {
            return res.status(400).send({
                message: 'Por favor ingresa un correo electronico valido',
            });
        }
        if(!password || password.length < 6) 
        {
            return res.status(400).send({
                message: 'Por favor ingresa una contraseña de minimo 6 caracteres',
            });
        }
        if(!password_repeat || password != password_repeat)
        {
            return res.status(400).send({
                message: 'Ambas contraseñas deben coincidir',
            });
        }
        next();
    },
    isLoggedIn: (req, res, next) => 
    {
        const { authorization } = req.headers;
        if(!authorization) 
        {
            return res.status(401).send({
                message: 'Tu sesion no es valida',
            });
        }
    try {

      if(!authorization.startsWith('Bearer '))
      {
            return res.status(401).send({
                message: 'Formato de token incorrecto' 
            });
      }
      const token = authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userData = decoded;
      next();
    } catch (err) {
        if (err.name === 'TokenExpiredError'){ 
             return res.status(400).send({
               message: 'Tu sesion no es valida',
             });    
        }
        return res.status(401).send({ message: 'Token inválido o corrupto' });
    }   
},
    isAdmin: (req, res, next) => {
    if(req.userData && req.userData.role === 'admin')
    {
        next();
    } else {
        return res.status(403).send({
            message: "Acceso denegado. Se requieren permisos de administrador",
        });
    }
    }
};

export default userMiddleware;