import jwt from 'jsonwebtoken';

export const protectRoutes = async (req,res,next) => {
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded; 
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({ message: "Not authorized, token failed"});
    }
}