const jwt=require('jsonwebtoken');

module.exports=function auth(req,res,next){
    const token=req.header('auth-token');
    if(!token) return res.status(401).send({status:'BAD'});
    try{
        const verified=jwt.verify(token,'my_secret_key');
        req.user=verified;
        next();
    }catch(err){
        res.status(400).send({status:'BAD'});
    }
}