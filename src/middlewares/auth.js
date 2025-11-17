import jwt from 'jsonwebtoken';

export const protect = async (req,res,next) => {
    try{
        let token = req.cookies.token;
      
        if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }
      if(!token){
            return res.status(401).json({ message: 'Not authorized, no token'});
        }
        //Decode token
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user=decode; 
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({ message: "Not authorized, token failed"});
    }
}