episodb = function(){
    function init(){
	lib.lib.show('#episodb')

	$('#descbuttondiv').css('background','#555')
	$('#episodbbuttondiv').css('background','#999')
	$('#editbuttondiv').css('background','#555')
	$('#dasbuttondiv').css('background','#555')
	$('#dasbutton').css('display','none')

	リスト表示({リスト:answers, フォームid:'answers', クラス:'answerinput', 改行あり:false})
	リスト表示({リスト:questions, フォームid:'questions', クラス:'questioninput', 改行あり:true})
    }
    init()
}

n個目の答を削除する関数 = function(n,属性){
    return function(){
	属性.リスト.splice(n,1)
	リスト表示(属性)
    }
}

function n個目の答を登録する関数(n,属性){
    return function(e){
	属性.リスト[n] = e.target.value
	リスト表示(属性)
    }
}

function 重複と空エントリを削除(リスト){
    let 新リスト = []
    for(var i=0;i<リスト.length;i++){
	let 項目 = リスト[i]
	if(項目 != '' && ! 新リスト.includes(項目)){
	    新リスト.push(項目)
	}
    }
    リスト.length = 0 // 配列を削除
    for(var i=0;i<新リスト.length;i++){
	リスト[i] = 新リスト[i]
    }
}

function リスト表示(属性){
    重複と空エントリを削除(属性.リスト)
    let フォーム = $('#' + 属性.フォームid)
    フォーム.children().remove()

    EpisoPassデータ作成()
    
    var i;
    for(i=0;i<属性.リスト.length;i++){
	let エントリ = $('<span>')
	
	$('<input>')
	    .attr('type','text')
	    .attr('class',属性.クラス)
	    .attr('id',`name${i}`)
	    .val(属性.リスト[i])
	    .appendTo(エントリ)
	    .on('change',n個目の答を登録する関数(i,属性))

	$('<span>')
	    .text('✖')
	    .attr('class','check')
	    .on('click',n個目の答を削除する関数(i,属性))
	    .appendTo(エントリ)
	
	フォーム.append(エントリ)
	
	if(属性.改行あり){
	    フォーム.append($('<br/>'))
	}
    }
    
    let エントリ = $('<span>')
    
    $('<input>')
        .attr('type','text')
        .attr('class',属性.クラス)
        .attr('placeholder','(追加)')
	.focus()
	.appendTo(エントリ)
        .on('change',n個目の答を登録する関数(i,属性))
    
    フォーム.append(エントリ)
}

ランダムに回答を追加 = function(リスト){
    let 未登録のリスト = リスト.filter(item => !answers.includes(item))
    let 未登録のデータの数 = 未登録のリスト.length
    if(未登録のデータの数 == 0) return
    let 新たに登録するデータ = 未登録のリスト[Math.floor(Math.random() * 未登録のデータの数)]
    answers.push(新たに登録するデータ)
    リスト表示({リスト:answers, フォームid:'answers', クラス:'answerinput', 改行あり:false});
}

ランダムに問題を追加 = function(){
    let 未登録のリスト = db.問題例リスト.filter(item => !questions.includes(item))
    let 未登録のデータの数 = 未登録のリスト.length
    if(未登録のデータの数 == 0) return
    let 新たに登録するデータ = 未登録のリスト[Math.floor(Math.random() * 未登録のデータの数)]
    questions.push(新たに登録するデータ)
    リスト表示({リスト:questions, フォームid:'questions', クラス:'questioninput', 改行あり:true});
}

重みづけ都市選択 = function(){ // 人口の多い都市ほど選ばれやすくする
    let 総人口 = 0
    for(var i=0;i<db.都市リスト.length;i++){
	総人口 += db.都市リスト[i][1]
    }
    let 何人目か = Math.floor(Math.random() * 総人口)
    let 人口総和 = 0
    for(var i=0;i<db.都市リスト.length;i++){
	人口総和 += db.都市リスト[i][1]
	if(人口総和 > 何人目か){
	    return db.都市リスト[i][0]
	}
    }
    return '横浜'
}

重みづけランダムに都市を追加 = function(){
    let 都市
    for(var i=0;i<1000;i++){
	都市 = 重みづけ都市選択(db.都市リスト)
	if(!answers.includes(都市)){
	    answers.push(都市)
	    リスト表示({リスト:answers, フォームid:'answers', クラス:'answerinput', 改行あり:false});
	    break;
	}
    }
}

JSONデータ = function(){
    let s = "{\n"
    s += "  \"questions\": [\n"
    for(var i=0;i<questions.length;i++){
	s += "    \"" + questions[i].replace(/"/g,'\\"') + "\""
	if(i < questions.length-1) s += ","
	s += "\n"
    }
    s += "  ],\n  \"answers\": [\n"
    for(var i=0;i<answers.length;i++){
	s += "    \"" + answers[i].replace(/"/g,'\\"') + "\""
	if(i < answers.length-1) s += ","
	s += "\n"
    }
    s += "  ]\n}\n"
    return s
}

JSONデータセーブ = function(){
    let blob = new Blob([ JSONデータ() ], { type: 'text/json' });
    let url = URL.createObjectURL(blob);
    const a = $('<a>')
	  .attr('href',url)
	  .attr('download','episopass.json')
    a[0].click(); // jQueryの場合こういう処理が必要
}

JSONデータロード = function(){
    console.log('getjson()')
    var file = document.querySelector('#fileload');
    file.onchange = function (){
	console.log('onchange')
	var fileList = file.files;
        var reader = new FileReader();
        reader.readAsText(fileList[0]);
        reader.onload = function  () {
	    var data = $.parseJSON(reader.result)
	    questions = data['questions']
	    answers = data['answers']
	    リスト表示({リスト:answers, フォームid:'answers', クラス:'answerinput', 改行あり:false});
	    リスト表示({リスト:questions, フォームid:'questions', クラス:'questioninput', 改行あり:true});
	    
	    // データの再ロードを可能にする
	    // https://qiita.com/_Keitaro_/items/57b1c5dd36b7bed08ad8
	    $('#fileload').val('')
        };
    }
}

function データシャッフル(リスト){
    let len = リスト.length
    for(var i=0;i<len;i++){
	let n = Math.floor(Math.random() * (len-i))
	let tmp = リスト[i]
	リスト[i] = リスト[len-n-1]
	リスト[len-n-1] = tmp
    }
}

EpisoPassデータ作成 = function(){
    // let 問題数 = questions.length
    let 問題数 = questions.length
    let リスト = []
    for(var i=0;i<問題数;i++){
	//リスト[i] = questions[i]
	リスト[i] = questions[i]
    }
    let 最大問題数 = 問題数
    if(最大問題数 > nquestions){
	データシャッフル(リスト)
	最大問題数 = nquestions
    }

    let qas = []
    for(var i=0;i<最大問題数;i++){
	var o = {}
	o["question"] = リスト[i]
	o["answers"] = answers
	qas.push(o)
    }
    data.qas = qas

    // localStorageに問題データベースを格納
    localStorage.setItem('EpisoDB',JSONデータ())
}

module.exports = {
    'JSONデータセーブ': JSONデータセーブ,
    'JSONデータロード': JSONデータロード,
    'EpisoPassデータ作成': EpisoPassデータ作成,
    'episodb': episodb,
    'ランダムに問題を追加': ランダムに問題を追加,
    'データシャッフル': データシャッフル,
    'リスト表示': リスト表示,
    'ランダムに回答を追加': ランダムに回答を追加,
    '重みづけランダムに都市を追加': 重みづけランダムに都市を追加
}
