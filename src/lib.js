//
// ライブラリのJS
// lib = require("./lib.js")
// lib.lib.make_html() が使える
//

lib = {
    make_html: function(data){
	// https://qiita.com/daiiz/items/9b9eddb5de9246b017bc daiizOA
	// これでHTML取得リンクができる
	var a = $('#htmlbutton');
	a.attr('download','RunEpisoPass.html');

	lines = dastemplate.dastemplate.split(/\n/);
	for(let i=0;i<lines.length;i++){
	    if(lines[i].match(/REPLACE_THIS_LINE$/)){
		lines[i] = `const data = ${JSON.stringify(data)}`;
	    }
	}
	html = lines.join("\n")
	
	var blob = new Blob([ html ], { type: "text/html" });
	//var url = window.webkitURL.createObjectURL(blob);
	var url = URL.createObjectURL(blob);
	a.attr('href',url)
    },
    
    show: function(id){
	$('#contents').children().css('display','none')
	$(id).css('display','block')
    }
}

exports.lib = lib
