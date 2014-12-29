"use strict"; 
var extend = require('util')._extend;
var uuid = require('node-uuid');

var quotationProductReq = {
	quotationReqDTO:{
		brand: null,
		coverType: null,
		guaranteeType: null,
		model: null,
		newMonth: null,
		newStartDate: null,
		oldMonth: null,
		oldStartDate: null,
		saleDate: null,
		scheme: null,
		signMileage: null
	},
	requestHeadDTO:{
		seqNo: null
	}
};

var insuredConfirmationReq = {
		"requestHeadDTO":{
			"seqNo": null
		},
		"mainDTO":{
			"brand": null,
			"brandName": null,
			"scheme": null,
			"model": null,
			"displacement": null,
			"oldStartDate": null,
			"oldMonth": null,
			"saleDate": null,
			"newStartDate": null,
			"frameno": null
		},
		"productDTO":{
			"guaranteeType": null,
			"coverType": null,
			"newMonth": null,
			"uwPremium": null
		},
		"carDTO":{
			"licenseno": null,
			"actualvalue": null,
			"invoice":	null,
			"engineno": null,
			"salesmanName": null,
			"salesmanTelephone": null
		},
		"relatedPartyList":[]
	};

var relatedPartyDTO = {
	"proposalNo": null,
	"serialNo": null,
	"insuredType": null,
	"insuredName": null,
	"insuredAddress": null,
	"insuredFlag": null,
	"identifyType": null,
	"identifyNumber": null,
	"sex": null,
	"birthDate": null,
	"mobilePhone": null,
	"email": null
};

var endorApplyReq = {
		   adjustmentFeeDTO:{
				accountNo:null,
			    bankBranchName:null,
			    bankPayType:null,
			    cardType:null,
			    payeeBankAccountName:null,
			    payeeBankCityCode:null,
			    payeeBankCode:null,
			    payeeBankName:null,
			    payeeMobile:null,
			    payeeRelateCode:null
			  },
			  carDTO:{
			  	actualvalue:null,
			    engineno:null,
			    invoice:null,
				licenseno:null,
				salesmanName:null,
				salesmanTelephone:null
			  },
			  mainDTO:{
			  	brand:null,
			    brandName:null,
			    displacement:null,
			    endorReason:null,
			    endorValidDate:null,
			    frameno:null,
				model:null,
			    newStartDate:null,
				oldMonth:null,
				oldStartDate:null,
			    policyNo:null,
			    saleDate:null,
			    scheme:null
			  },
			  productDTO:{
				coverType:null,
			    guaranteeType:null,
			    newMonth:null,
				uwPremium:null
			  },
			  requestHeadDTO:{
				seqNo:null
			  }
			};

var isPayReq = {
	isPayReqDTO:{
			policyNo: null
	},
	requestHeadDTO:{
		seqNo: null
	}
};

var surrenderEndorReq = {
		adjustmentFeeDTO:{
			accountNo:null,
			bankBranchName:null,
			bankPayType:null,
			cardType:null,
			payeeBankAccountName:null,
			payeeBankCityCode:null,
			payeeBankCode:null,
			payeeBankName:null,
			payeeMobile:null,
			payeeRelateCode:null
		},
	     mainDTO:{
	    	 policyNo:null,
	    	 endorValidDate:null,
	    	 endorReason:null,
	    	 endorRemark:null,
	    	 surrenderAmount:null,
	    	 surrenderType:null
	     },
	     requestHeadDTO:{
	    	 seqNo:null
	     }
	};

var baseDataQueryReq = {
		baseDataQueryReqDTO:{
			bankCode:null,
			bankName:null,
			banklocationsCode:null,
			banklocationsName:null,
			page:null,
			queryType:null,
			record:null
		},
		requestHeadDTO:{
			seqNo:null
		}
	};

var writeCaseInfoReq = {
		compensationNo:null,
		damageAddress:null,
		damageCode:null,
		damageStartDate:null,
		delayUserDto:{
			userCode:null,
			userName:null
		},
		lists: null,
		policyNo:null,
		reportDate:null,
		reportorName:null,
		reportorPhoneNumber:null
	};

var restObjUtil = function() {
return {
		createQuotationProductReq : function() {
			var req = extend({}, quotationProductReq);
			req.requestHeadDTO.seqNo = uuid.v1();
			return req;
		},
		
		createInsuredConfirmationReq : function() {
			var req = extend({}, insuredConfirmationReq);
			req.requestHeadDTO.seqNo = uuid.v1();
			return req;
		},
		
		createRelatedPartyDTO : function() {
			var req = extend({}, relatedPartyDTO);
			return req;
		},
		
		createEndorApplyReq : function() {
			var req = extend({}, endorApplyReq);
			req.requestHeadDTO.seqNo = uuid.v1();
			return req;
		},
		
		createIsPayReq : function() {
			var req = extend({}, isPayReq);
			req.requestHeadDTO.seqNo = uuid.v1();
			return req;
		},
		
		createSurrenderEndorReq : function() {
			var req = extend({}, surrenderEndorReq);
			req.requestHeadDTO.seqNo = uuid.v1();
			return req;
		},
		
		createBaseDataQueryReq : function() {
			var req = extend({}, baseDataQueryReq);
			req.requestHeadDTO.seqNo = uuid.v1();
			return req;
		},
		
		createWriteCaseInfoReq : function() {
			var req = extend({}, writeCaseInfoReq);
			return req;
		}
	}
};


module.exports = restObjUtil();