(function(){dust.register("_occurCommentBodyTr",body_0);function body_0(chk,ctx){return chk.write("<tr noteType=\"").reference(ctx.get(["noteType"], false),ctx,"h").write("\"><td>").reference(ctx.get(["commentTime"], false),ctx,"h").write("</td><td>").reference(ctx.get(["commentUser"], false),ctx,"h").write("</td><td>").reference(ctx.get(["claimCodeName"], false),ctx,"h").write("</td><td>").reference(ctx.get(["noteTypeName"], false),ctx,"h").write("</td><td>").reference(ctx.get(["noteText"], false),ctx,"h").write("</td><td><button type=\"button\" name=\"editCommentCtrlButton\" onclick=\"editComment(this);\">编辑</button>&nbsp;&nbsp;<button type=\"button\" name=\"deleteCommentCtrlButton\" onclick=\"deleteComment(this);\">删除</button></td></tr>");}return body_0;})();