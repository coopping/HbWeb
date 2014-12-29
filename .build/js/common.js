//for Event animate
//$(document).ready(function(e) {
////	var page = 1;
////	var i =2;
////	$(".e_next").click(function(){
////		var $parent = $(this).parents("div.m_box_body");
////		var $e_show = $parent.find("div.e_content_list");
////		var $e_content = $parent.find("div.e_content")
////		var e_width = $e_content.width();
////		var len = $e_show.find("li").length;
////		var page_count = Math.ceil(len/i);
////		if(page == page_count){
////			$e_show.animate({left:'0px'},"slow");
////			page=1;
////
////			}else{
////				$e_show.animate({left:'-='+e_width},"slow");
////				page++;
////				}
////
////		})
////	$(".e_prev").click(function(){
////		var $parent = $(this).parents("div.m_box_body");
////		var $e_show = $parent.find("div.e_content_list");
////		var $e_content = $parent.find("div.e_content")
////		var e_width = $e_content.width();
////		var len = $e_show.find("li").length;
////		var page_count = Math.ceil(len/i);
////		if(page == 1){
////			$e_show.animate({left:'-='+e_width*(page_count-1)},"slow");
////			page=page_count;
////
////			}else{
////				$e_show.animate({left:'+='+e_width},"slow");
////				page--;
////				}
////
////		})
////
////
////});
$(document).ready(function(){
//	$('.tabs li').click(function(){
//		$(this).addClass('selected')
//		.siblings().removeClass('selected')
//	var index = $('.tabs li').index(this);
//		$('div.tab_div')
//		.eq(index).show()
//		.siblings().hide();
//	});
    var myNav = $(".navbar-nav a"),i;
    for(i=0;i<myNav.length;i++){
        var links = myNav.eq(i).attr("href"),myURL = document.URL;
        if(myURL.indexOf(links) != -1) {
            myNav.eq(i).parent().addClass('active').siblings().removeClass('active');
        }
    }
    var memberNav = $(".member-menu a"),i;
    for(i=0;i<memberNav.length;i++){
        var links = memberNav.eq(i).attr("href"),memberURL = document.URL;
        if(memberURL.indexOf(links) != -1) {
            memberNav.eq(i).addClass('selected').siblings().removeClass('selected');
        }
    }
})
window.onload=function() {
    var chks = $("input");
    for (var i = 0, l = chks.length; i < l; i++) {
        chks[i].checked = false;
    }
}

