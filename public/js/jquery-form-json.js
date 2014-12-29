jQuery.fn.extend({
    serializeJson: function () {
        var $form=$(this);
        var array = $form.serializeArray();
        var json={};
        $.each( array, function(i, item){
            var result=item.value;
            if(result){
                result=$.trim(result);
                if(result!=""&&result!="undefined"){
                    json[item.name]=result;
                    var ele=$form.find('select[name="'+item.name+'"]');
                    if(ele.length==1){
                        if(item.name.indexOf('[')>0&&item.name.indexOf(']')>0){
                            json[item.name.substr(0,(item.name).length-1)+"Name]"]=ele.find('option:selected').text();
                        }else{
                            json[item.name+"Name"]=ele.find('option:selected').text();
                        }
                    }
                }
            }
        });
        return json;
    },
    serializeJsonWithoutName: function () {
        var $form=$(this);
        var array = $form.serializeArray();
        var json={};
        $.each( array, function(i, item){
            var result=item.value;
            if(result){
                result=$.trim(result);
                if(result!=""&&result!="undefined"){
                    json[item.name]=result;
                }
            }
        });
        return json;
    }
});