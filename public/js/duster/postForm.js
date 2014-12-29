(function() {
	dust.register("postForm", body_0);

	function body_0(chk, ctx) {
		return chk.write("<form  method=\"post\" id=\"postForm\"  role=\"form\"><input type=\"hidden\" name=\"_csrf\" value=\"").reference(ctx.get("_csrf"), ctx, "h").write("\" /><div class=\"form-group\"><label for=\"postTitle\" class=\"control-label\">标题<span class=\"required-indicator\">*</span></label><input type=\"text\" name=\"post[title]\" class=\"form-control\" id=\"postTitle\" value=\"").reference(ctx.getPath(false, ["post", "title"]), ctx, "h").write("\" required></div><div class=\"form-group\"><label for=\"postUrl\" class=\"control-label\">URL<span class=\"required-indicator\">*</span></label><input type=\"text\" name=\"post[url]\" class=\"form-control\" id=\"postUrl\" value=\"").reference(ctx.getPath(false, ["post", "url"]), ctx, "h").write("\" required></div><div class=\"form-group\"><label for=\"postBody\" class=\"control-label\">摘要<span class=\"required-indicator\">*</span></label><textarea class=\"html-textarea\" name=\"post[body]\"  id=\"postBody\" rows=\"15\" required>").reference(ctx.getPath(false, ["post", "body"]), ctx, "h", ["s"]).write("</textarea></div><div class=\"form-group\"><label for=\"postState\" class=\"control-label\">状态<span class=\"required-indicator\">*</span></label>").helper("baseCode", ctx, {}, {
			"base": "postState",
			"name": "post[state]",
			"id": "postState",
			"selectValue": body_1,
			"required": "true"
		}).write("</div><div class=\"form-group\"><div class=\"switch\" tabindex=\"0\"><input name=\"post[isTop]\" type=\"checkbox\" value=\"true\" /></div></div></form>");
	}

	function body_1(chk, ctx) {
		return chk.reference(ctx.getPath(false, ["post", "state"]), ctx, "h");
	}
	return body_0;
})();