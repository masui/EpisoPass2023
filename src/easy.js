easy = function(){
    function shuffle(array, n){
	for(var i=0; i<n; i++){
            var r = i + 1 + Math.floor(Math.random() * (array.length - i - 1));
            var tmp = array[i];
            array[i] = array[r];
            array[r] = tmp;
	}
    }
    function init(){
	lib.lib.show('#easy')

	$('body').on('click',() => {
            $('#easyanswers').css('height','80px');
            $('#easyquestions').css('height','80px');
	});
	$('#easyanswers').on('click',() => {
            $('#easyanswers').css('height','300px');
            $('#easyquestions').css('height','80px');
	    return false;
	});
	$('#easyquestions').on('click',() => {
            $('#easyquestions').css('height','300px');
	});
	$('#easyquestions').on('click',() => {
            $('#easyquestions').css('height','300px');
            $('#easyanswers').css('height','80px');
	    return false;
	});
	//$('#addnames').click(function(){
        //    shuffle(names,30);
        //    $('#answers').val(names.slice(0,30).join("\n"));
	//});
	//$('#addquestions').click(function(){
        //    shuffle(questions,10);
        //    $('#questions').val(questions.slice(0,10).join("\n"));
	//});
	$('#startedit').click(function(){
            data = {};
            data['seed'] = seed;
            answers = $.grep($('#easyanswers').val().split(/\n+/), function(s,i){
		return s != "";
            });
            if(answers.length == 0){
		alert("名前リストを入力して下さい");
		return;
            }
            qs = $.grep($('#easyquestions').val().split(/\n+/), function(s,i){
		return s != "";
            });
            if(qs.length == 0){
		alert("質問リストを入力して下さい");
		return;
            }
	    
            qas = [];
            for(var i=0;i<qs.length;i++){
		qa = {};
		qa['question'] = qs[i];
		qa['answers'] = answers;
		qas.push(qa);
            }
            data['qas'] = qas;
	    data['name'] = 'easy'
	    data['seed'] = "SampleSeed12345"
	    
	    editor.editor(data);
	    // lib.lib.show('#editor');
	});

	var pair = location.search.substring(1).split('&');
	for(var i=0; pair[i]; i++){
	    var kv = pair[i].split('=');
	    if(kv[0] == 'questions'){
		$('#easyquestions').val(decodeURIComponent(kv[1]).split(/;/).join("\n"));
	    }
	    if(kv[0] == 'answers'){
		$('#easyanswers').val(decodeURIComponent(kv[1]).split(/;/).join("\n"));
	    }
	}
    }

    init();
}

exports.easy = easy;
