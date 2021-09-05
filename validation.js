const joi=require('@hapi/joi');
const { organization } = require('./model/User');
//Register Validation
const registerValidation=(data)=>{
    const schema=joi.object({
        userId:joi.string(),
        name:joi.string().required(),
        email:joi.string().required().email(),
        password:joi.string().required(),
        modelId:joi.string(),
        organizationIds:joi.array()
    });
    return schema.validate(data);
};
//login validation
const loginValidation=(data)=>{
    const schema=joi.object({
        email:joi.string().min(6).required().email(),
        password:joi.string().min(6).required()
    });
    return schema.validate(data);
};

module.exports.registerValidation=registerValidation;
module.exports.loginValidation=loginValidation;