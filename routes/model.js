const router=require('express').Router();
const verify=require('./verifyToken');
const {organization}=require('../model/User');
const {User}=require('../model/User');
const {model}=require('../model/User');
const { decodeBase64 } = require('bcryptjs');
//create model
router.get('/modelCreate',verify,async (req,res)=>{
  //function to store into database
    var mod={};
    var finalUsers=[];
    const storeMod=function(modelInfo){
        try{
            return mod.save(modelInfo).then(docMod=>{
                return docMod;
            })
        }catch(err){
            res.status(400).send(err);
        }      
    }
  //function to add model into database
  const addModel=async function(data){
    mod=new model({
      data:data 
    });
    var modRegistered= await storeMod({mod});
    return modRegistered;
  }
  //function to add modelID to users table
  const addModToUser=function(userId,modId){
    try{
      return User.findByIdAndUpdate(userId,{$push:{modelId:modId}},
        { new: true, useFindAndModify: false });
    }

    catch(err){
      res.status(400).send(err);
    }
  }
  //function to add userID to model table
  const addUserToMod=function(modId,userId){
    return model.findByIdAndUpdate(modId,{$push:{userId:userId}},
      { new: true, useFindAndModify: false });
  }
  //function to add models to organizations to which users belong to
  const addModToOrg=function(orgId,modelId){
    return organization.findByIdAndUpdate(orgId,{$push:{modelId:modelId}},
      { new: true, useFindAndModify: false });
  }
  userId=Object.values(req.user)[0];
  var MODEL=await addModel(req.body.data);
  var userModel=await addModToUser(userId,MODEL._id);
  var modelUser=await addUserToMod(MODEL._id,userId);
  var found,Ofound=[];
  User.find({}, function(err, Users){
     found=Users.find(function(user,index){
      if(user._id==userId){
        return true;
      }
    });
  })
  organization.find({},async function(err,Org){
    for(i=0;i<found.organizationIds.length;i++){
      id=found.organizationIds[i].toString();
      if(Org.find(item=>item._id==id)){
        var m=await addModToOrg(found.organizationIds[i],MODEL._id)
      }     
    }      
  })
res.send("Model Created")
});
//---------------------------------------------------------------------------------------------------------------------
//organizationRegistration
router.get('/',verify,async (req,res)=>{
  var found,Ofound=[]
  var AllModels = new Array();
  userId=Object.values(req.user)[0];
  User.find({}, function(err, Users){
      found=Users.find(function(user,index){
       if(user._id==userId){
         return true;
       }
     });
   })
   organization.find({},async function(err,Org){
    Ofound=Org.find(function(org,index){
      if(org._id==found.organizationIds[0].toString()){
        return true;
      }
    })
  })
  model.find({},async function(err,Mod){
    l=Ofound.modelId.length
    for(i=0;i<l;i++){
      Mfound=Mod.find(function(mod,index){
        if(mod._id==Ofound.modelId[i].toString()){
          return true;
        }
  
      })
      AllModels.push(Mfound)
    }
    res.send(AllModels)
      
  })      
});
//Delete User
//------------------------------------------------------------------------------------------------------------------
router.delete('/:id',(req,res,next)=>{
  ID=req.body.modelId
  model.find({},async function(err,MODEL){
      modelfound=MODEL.find(function(model,index){
        if(model._id==ID){
          return true;
        }
      })
    })
  async function removeModel(uid,mid){
      User.findByIdAndUpdate(uid, 
          { $pullAll: { modelId: [mid] } }, 
          { new: true }, 
          function(err, data) {} 
      );
  }
  async function deleteModelFromUser(modelfound){
      removeModel(modelfound.userId[0],ID)
  }    
  model.findOneAndDelete({
      _id:ID
  }).then(function(model){
      deleteModelFromUser(modelfound);
      res.send("Model Deleted");
  })
});
//-----------------------------------------------------------------------------------------------------------------
//Update Model
router.put('/:id',(req,res,next)=>{
  ID=req.body.modelId
  model.findOneAndUpdate({_id:ID},{data:req.body.data}).then(function(model){res.send("Model Updated");})
});
//-----------------------------------------------------------------------------------------------------------------
module.exports=router;