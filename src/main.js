//
// EpisoPassの入口
//

$ = require("./jquery.js")
editor = require("./editor.js")
episodas = require("./episodas.js")
crypt = require("./crypt.js")
dasmaker = require("./dasmaker.js")
episodb = require("./episodb.js")
lib = require("./lib.js")
dastemplate = require("./dastemplate.js")

data = { // EpisoPass問題で利用されるデータ
    "name": "EpisoPass",
    "seed": "EpisoPass_123456",
    "qas": [] // 問題ごとに回答を変えられるようにしてた時代のなごり
}
db = require("./sampledb.json") // サンプルデータなど

// 引数解析
var args = {}
questions = db.サンプル問題リスト
answers = db.サンプル回答リスト
nquestions = 10
//var dataurl = null
document.location.search.substring(1).split('&').forEach((s) => {
    let [name, value] = s.split('=');
    args[name] = decodeURIComponent(value);
})

main = async function(){
    if(args['n']){
	nquestions = Number(args['n'])
    }
	
    if(args['data']){ // WebからJSONデータを取得
	// alert('WebからJSON取得')
	await fetch(args['data'])
	    .then((response) => response.json())
	    .then((data) => {
		questions = data.questions
		answers = data.answers
	    })
    }
    else if(args['questions']){
	// alert('引数からデータ取得')
	questions = decodeURIComponent(args['questions']).split(/;/)
	answers = decodeURIComponent(args['answers']).split(/;/)
    }
    else {
	// localStorageに問題データベースがあれば取得 (前回のデータが使われる)
	let localdbstr = localStorage.getItem('EpisoDB')
	if(localdbstr){
	    // alert('localstorageからデータ取得')
	    let localdb = JSON.parse(localdbstr)
	    questions = localdb.questions
	    answers = localdb.answers
	}
	else {
	    // alert('デフォルト問題を利用')
	}
    }

    // ボタンの挙動設定
    $("#descbutton").click(() => {
	lib.lib.show('#description')
	$('#descbuttondiv').css('background','#999')
	$('#episodbbuttondiv').css('background','#555')
	$('#editbuttondiv').css('background','#555')
	$('#dasbuttondiv').css('background','#555')
    })
    $("#episodbbutton").click(() => episodb.episodb())
    $("#editbutton").click(() => editor.editor())
    $("#dasbutton").off() // 何度も登録されて困った
    $("#dasbutton").click(() => dasmaker.dasmaker(data,editor.answer()))
    
    episodb.EpisoPassデータ作成()
    
    let qas = []
    let maxlen = questions.length
    if(maxlen > nquestions) maxlen = nquestions
    for(let i=0;i<maxlen;i++){
	let obj = {}
	obj['question'] = questions[i]
	obj['answers'] = answers
	qas.push(obj)
    }
    data['qas'] = qas
    
    if(args['questions']){
	editor.editor(data) // 回答画面へ
    }
    else if(args['data']){
	episodb.episodb() // データベース編集画面へ
    }
    else {
	lib.lib.show('#description')
	$('#descbuttondiv').css('background','#999')
	$('#episodbbuttondiv').css('background','#555')
	$('#editbuttondiv').css('background','#555')
	$('#dasbuttondiv').css('background','#555')
	$('#dasbutton').css('display','none')
    }
}

main()
