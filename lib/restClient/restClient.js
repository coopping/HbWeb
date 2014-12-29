var restify = require('restify');


var restClient = function() {
    var client;
    return {
        config: function(url) {
            client = restify.createJsonClient({
                url: url
            });
        },
        //OPR供应商信息
        providerInfo:function(reqObj,cb){
            client.post('/webService/opr/tpi/api/providerInfo',reqObj,function(err,req,res,obj){
                cb(err,obj);
            });
        },        
        //OPR保单信息
        contractInfo:function(reqObj,cb){
            client.post('/webService/opr/tpi/api/contractInfo',reqObj,function(err,req,res,obj){
                cb(err,obj);
            });
        },     
        //OPR代理人信息   
        agentInfo:function(reqObj,cb){
            client.post('/webService/opr/tpi/api/agentInfo',reqObj,function(err,req,res,obj){                
                cb(err,obj);
            });
        },
        //OPR产品信息
        saleProductInfo:function(reqObj,cb){
            client.post('/webService/opr/tpi/api/saleProductInfo',reqObj,function(err,req,res,obj){
                cb(err,obj);
            });
        }
        
    };
};


module.exports = restClient();