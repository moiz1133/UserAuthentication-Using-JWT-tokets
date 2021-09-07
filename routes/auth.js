const router=require('express').Router();
const {User}=require('../model/User');
const {organization}=require('../model/User');
const bcrypt=require('bcryptjs');
const {model}=require('../model/User');
var jwt=require('jsonwebtoken');
const cors=require('cors');
router.use(cors())
const {registerValidation,loginValidation}=require('../validation');
//---------------------------------------------------------------------------------------------------------------------
//userRegisteration
router.post('/userRegisteration',async(req,res)=>{
    //when the user is created for the first time
    const createUser=function(userInfo){
        try{
            return user.save(userInfo).then(docUser=>{
                return docUser;
            })
    
        }catch(err){
            res.status(400).send({error:"BAD"});
        }      
    }
    const emailExists =await User.findOne({email:req.body.email});
    if(emailExists) return res.status(400).send({error:"BAD"});

    //hashing the password
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(req.body.password,salt);
    //create a new user
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
    });
    //saving into database
    var userRegistered= await createUser({user});
    res.send({status:"OK"})
});
//-------------------------------------------------------------------------------------------------------------------------
//organizationRegistration
router.post('/orgRegisteration',async(req,res)=>{
    //when the Organization is created for the first time
    const createOrg=function(orgInfo){
        try{
            return org.save(orgInfo).then(docOrg=>{
                return docOrg;
            })
    
        }catch(err){
            res.status(400).send({error:"BAD"});
        }      
    }
    //create a new Organization
    const org=new organization({
        name:req.body.name,
    });
    //saving into database
    var orgRegistered= await createOrg({org});
    res.send({data:orgRegistered._id})
});
//------------------------------------------------------------------------------------------------------------------
//userData
router.get('/',async(req,res)=>{
    User.find({}, function(err, Users){
        res.send({data:Users})
     })
})
//OrganizationData
router.get('/organization',async(req,res)=>{
    organization.find({}, function(err, org){
        res.send({data:org})
     })
})
//-------------------------------------------------------------------------------------------------------------------
router.delete('/:id',async (req,res,next)=>{
    User.find({},async function(err,USER){
        userfound=USER.find(function(user,index){
          if(user._id==ID){
            return true;
          }
        })
      })
    async function removeModel(mid,uid){
        model.findByIdAndUpdate(mid, 
            { $pullAll: { userId: [uid] } }, 
            { new: true }, 
            function(err, data) {} 
        );
    }
    async function deleteUseFromModel(userfound){
        removeModel(userfound.modelId[0],ID)
    }
    async function removeUser(oid,uid){
        organization.findByIdAndUpdate(oid, 
            { $pullAll: { users: [uid] } }, 
            { new: true }, 
            function(err, data) {} 
        );
    }
    async function deleteUserFromOrganization(userfound){
        for(i=0;i<userfound.organizationIds.length;i++){
            removeUser(userfound.organizationIds[i],ID)
        }
    }
    ID=req.body.userId
    const UserExists=await User.findOne({_id:ID});
    if(UserExists){
        User.findOneAndDelete({
            _id:req.body.userId
        }).then(function(user){
            deleteUserFromOrganization(userfound);
            deleteUseFromModel(userfound);
            res.send({status:"OK"});
        })

    }else{
        res.send({error:"BAD"})
    } 
    
});
//LOGIN
router.post('/login',async(req,res)=>{
    //LETS VALIDATE THE DATA BEFORE ENTERING A USER
    const {error}=loginValidation(req.body);
    if(error) return res.status(400).send({error:"BAD"});
    //checking if email exists
    const user =await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send({error:"BAD"});
    //PASSWORD IS CORRECT
    const validPass=await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send({error:"BAD"});
    //create and assign token
    const token=jwt.sign({_id:user._id},'my_secret_key',{expiresIn:'24h'});
    res.header('auth-token',token).send({data:token});
});
module.exports=router;