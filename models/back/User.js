'use strict';


var mongoose = require('mongoose');

var updatedTimestamp = require('mongoose-updated_at');
var uniqueValidator = require('mongoose-unique-validator');
var ObjectId = mongoose.Schema.Types.ObjectId;

/**
*用户信息
*/
var userSchema = new mongoose.Schema({
	realName:{
		type:String//真实姓名
	},
	loginName:{
		type:String, //登录名
		uniqure:true,
		required:true
	},
	password:{
		type:String //密码
	},	
	address:{
		type:String//地址
	},
	email:{
		type:String //邮箱
	},
	mobile:{
		type:String  //联系电话
	},
	qq:{
		type:String //QQ号
	},
	headSculpture:{
		type:String,//头像图片，服务器相对路径
		default:'' //初始设置默认头像
	},
	isValid:{
		type:String,//是否有效 离职或删除后变无效
		default:'1'
	},
	createTime:{
		type:Date,//创建时间
		default:Date.now
	},
	createBy:{
		type:String //创建用户ID
	},
	updateTime:{
		type:Date,//更新时间
		default:Date.now
	},
	updateBy:{
		type:String //更新用户ID
	}
});

//添加create,update字段
userSchema.plugin(updatedTimestamp);

userSchema.plugin(uniqueValidator,{
	message:'出错啦,{PATH}不能同已有值重复'
});

/**
*Helper function that hooks into the 'save' method,and replaces plaintext passwords with a hashed version.
*/
userSchema.pre('save',function(next){
	var user = this;

	//If the password has not been modified in this save operation,leave it alone(So we don't double hash it)
	if(!user.isModified('password')){
		next();
		return;
	}

	//Continue with the save operation
	next();

});

//checking if password is valid
userSchema.methods.validPassword = function(plainText){
	return bcrypt.compareSync(plainText,this.password);
};

userSchema.methods.textPassword = function(plainText){
	return bcrypt.compareSync(plainText,this.password);
};

module.exprots = mongoose.model('User',userSchema);