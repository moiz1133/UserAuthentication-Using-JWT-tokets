const router=require('express').Router();
const verify=require('./verifyToken');
const {organization}=require('../model/User');
const {User}=require('../model/User');
const {model}=require('../model/User');
const { decodeBase64 } = require('bcryptjs');
router.get('/',verify,async (req,res)=>{
  const addOrgToUser=function(userId,orgId){
    try{
      return User.findByIdAndUpdate(userId,{$push:{organizationIds:orgId}},
        { new: true, useFindAndModify: false });
    }
    catch(err){
      res.status(400).send(err);
    }
  }
  const addUserToOrg=function(orgId,userId){
    return organization.findByIdAndUpdate(orgId,{$push:{users:userId}},
      { new: true, useFindAndModify: false });
  }
  userId=Object.values(req.user)[0];
  var user=await addOrgToUser(userId,req.body.orgId);
  var org=await addUserToOrg(req.body.orgId,userId);
  res.send("User Added to organization");
});

module.exports=router;