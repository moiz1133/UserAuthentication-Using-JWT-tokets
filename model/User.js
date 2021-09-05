const mongoose = require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        max:255 

    },
    email:{
        type:String,
        required:true,
        max:255,
    },
    password:{
        type:String,
        required:true,
        max:255,
    },
    date:{
        type:Date,
        default:Date.now
    },
    modelId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"modelSchema"
    }],
    organizationIds:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"organizationSchema"
    }]
});
const organizationSchema=new mongoose.Schema({
    name:String,
    modelId:[{
        type:mongoose.Schema.Types.ObjectId
    }],
    users:[{type:mongoose.Schema.Types.ObjectId,ref:"userSchema"}]

});
const authSchema=new mongoose.Schema({
    userId:Number,
    authtoken:String,

});
const modelSchema=new mongoose.Schema({
    data:{
        "$schema": "http://json-schema.org/draft-07/schema#",
            "title": "Generated schema for Root",
            "type": "object",
            "properties": {
              "initial": {
                "type": "object",
                "properties": {
                  "column": {
                    "type": "string"
                  },
                  "row": {
                    "type": "number"
                  },
                  "index": {
                    "type": "number"
                  }
                },
                "required": [
                  "column",
                  "row",
                  "index"
                ]
              },
              "time_series": {
                "type": "object",
                "properties": {
                  "start": {
                    "type": "string"
                  },
                  "end": {
                    "type": "string"
                  },
                  "count": {
                    "type": "number"
                  }
                },
                "required": [
                  "start",
                  "end",
                  "count"
                ]
              },
              "workbook": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string"
                    },
                    "index": {
                      "type": "number"
                    },
                    "driver": {
                      "type": "string"
                    },
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "number"
                      }
                    },
                    "dirty": {
                      "type": "boolean"
                    },
                    "formulas": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "range": {
                            "type": "object",
                            "properties": {
                              "start": {
                                "type": "number"
                              },
                              "end": {
                                "type": "number"
                              }
                            },
                            "required": [
                              "start",
                              "end"
                            ]
                          },
                          "operations": {
                            "type": "object",
                            "properties": {
                              "operation": {
                                "type": "string"
                              },
                              "contents": {
                                "type": "array",
                                "items": {}
                              },
                              "type": {
                                "type": "string"
                              }
                            },
                            "required": [
                              "operation",
                              "contents"
                            ]
                          }
                        },
                        "required": [
                          "range",
                          "operations"
                        ]
                      }
                    },
                    "dependencies": {
                      "type": "array",
                      "items": {
                        "type": "number"
                      }
                    }
                  },
                  "required": [
                    "type",
                    "index",
                    "driver",
                    "data"
                  ]
                }
              }
            },
            "required": [
              "initial",
              "time_series",
              "workbook"
            ]
        
            
          
    },
    userId:[{
        type:mongoose.Schema.Types.ObjectId
    }],
    

});
User=mongoose.model('User',userSchema);
organization=mongoose.model('organization',organizationSchema);
auth=mongoose.model('auth',authSchema);
model=mongoose.model('model',modelSchema);
module.exports={User,organization,auth,model}