#
#  editor.coffee - EpisoPass問題編集画面
# 
#  Toshiyuki Masui @ Pitecan.com
#  Modified       2015/10/31 19:12:53
#  Modified       2018/02/23 17:24:33 for heroku
#  Modified       2019/12/23 サーバを使わないように修正
#

answer = [0,0,0,0,0,0,0,0,0,0]

editor = () =>
  console.log "data-----"
  console.log data

  $('#descbuttondiv').css('background','#555')
  $('#episodbbuttondiv').css('background','#555')
  $('#editbuttondiv').css('background','#999')
  # $('#dasbuttondiv').css('background','#555')
  # $('#dasbutton').css('display','block')

  globaldata = data # グローバル変数「data」にアクセスするための苦しい工夫
  name = data.name
  qas = data.qas
  curq = 0
  cura = 0

  answer = []             # answer[q] = a のとき、q番目の質問の答がa番目である
  #[0...qas[0]['answers'].length].forEach (i) ->
  #  answer[i] = 0
  #console.log answer

  selfunc = (q,a) -> # q番目の質問のa番目の選択肢をクリックしたとき呼ばれる関数
    ->
      answer[q] = a
      [0...qas[q]['answers'].length].forEach (i) ->
        $("#answer#{q}-#{i}").css 'background-color', if i == a then '#555' else '#fff'
        $("#answer#{q}-#{i}").css 'color', if i == a then '#fff' else '#555'
      calcpass true
  
  editfunc = (q,a) -> # q番目の質問のa番目の選択肢を編集したとき呼ばれる関数
    ->
      curq = q
      cura = a
      qas[q]['answers'][a] = $("#answer#{q}-#{a}").val()
      calcpass()
  
  timeout = null
  hover_in_func = (q,a) ->
    ->
      timeout = setTimeout selfunc(q,a), 400
  hover_out_func =  ->
    ->
      clearTimeout timeout
  
  # f4ba35ab6069e8bcf9ef62bf73d12fd1.png のような表示
  answerspan = (q,a) -> # q番目の質問のa番目の選択肢のspan
    aspan = $('<span class="answer">')
    input = $('<input type="text" autocomplete="off" class="answer">')
      .val qas[q]['answers'][a]
      .attr 'id', "answer#{q}-#{a}"
      .css 'background-color', if a == 0 then '#555' else '#fff'
      .css 'color', if a == 0 then '#fff' else '#555'
      .on 'click', selfunc(q,a)
      .on 'keyup', editfunc(q,a)
      # .hover hover_in_func(q,a), hover_out_func()
    aspan.append(input)
  
  showimage = (str,img) ->
    if str.match /\.(png|jpeg|jpg|gif)$/i
      img.attr 'src',str
        .css 'display','block'
    else
      img.css 'display','none'
  
  qeditfunc = (q) -> # q番目の問題を編集したとき呼ばれる関数
    ->
      str = $("#question#{q}").val()
      qas[q]['question'] = str
      img = $("#image#{q}")
      showimage(str,img)
      calcpass()
  
  minusfunc = (q) -> # q番目の問題の「-」ボタンを押したとき呼ばれる関数
    ->
      qas[q]['answers'].pop()
      $("#answer#{q}-#{qas[q]['answers'].length}").remove()
  
  plusfunc = (q) -> # q番目の問題の「+」ボタンを押したとき呼ばれる関数
    ->
      nelements = qas[q]['answers'].length
      qas[q]['answers'].push '新しい回答例'
      $("#delim#{q}").before answerspan(q,nelements)
  
  qadiv = (q) -> # q番目の質問+選択肢のdiv
    answer[q] = 0
    div = $("<div class='qadiv'>")  # !!!!!!!clssが変
      .attr 'id', "qadiv#{q}"
    qdiv = $('<div width="100%" class="qdiv">')
    qstr = qas[q]['question']
    qinput = $('<input type="text" autocomplete="off" class="qinput">')
      .attr 'id', "question#{q}"
      .val qstr
      .on 'keyup', qeditfunc(q)
    qdiv.append qinput
    div.append qdiv
      
    img = $("<img class='qimg'>")
      .attr 'id', "image#{q}"
    div.append img
    showimage qstr, img
      
    ansdiv = $("<div class='ansdiv'>")
    [0...qas[q]['answers'].length].forEach (i) ->
      ansdiv.append answerspan(q,i)
    delim = $('<span>  </span>')
      .attr 'id', "delim#{q}"
    ansdiv.append delim
      
    #minus = $('<input type="button" value=" 回答削除 ">')
    #  .on 'click', minusfunc(q)
    #ansdiv.append minus
    #ansdiv.append $('<span>  </span>')
    #  
    #plus = $('<input type="button" value=" 回答追加 ">')
    #  .on 'click', plusfunc(q)
    #ansdiv.append plus

    div.append ansdiv
      .append $('<br clear="all">')
  
  maindiv = ->
    $("#main").children().remove()  # ブラウザから「別名で保存」すると #main に入れたデータが全部格納されてしまうので、最初に全部消しておく
  
    [0...qas.length].forEach (i) ->
      $("#main").append qadiv(i)
  
    #minus = $('<input type="button" value=" 問題削除 " id="qa_minus" class="qabutton">')
    #  .click (event) -> # 質問の数を減らす「-」ボタンをクリックしたとき呼ばれる関数
    #    qas.pop()
    #    $("#qadiv#{qas.length}").remove()
    #    calcpass()
    #$("#main").append minus
    #  
    #$("#main").append $('<span>  </span>')
    #  
    #plus = $('<input type="button" value=" 問題追加 " class="qabutton">')
    #  .click (event) -> # 質問の数を増やす「-」ボタンをクリックしたとき呼ばれる関数
    #    qas.push
    #      question: "新しい質問"
    #      answers:  ["回答11","回答22","回答33"]
    #    $("#qa_minus").before qadiv(qas.length-1)
    #    calcpass()
    #$("#main").append plus
  
  secretstr = -> # 質問文字列と選択された文字列をすべて接続した文字列
    [0...qas.length].map (i) ->
      qas[i]['question'] + qas[i]['answers'][answer[i]]
    .join ''
  
  calcpass = (copy) -> # シード文字列からパスワード文字列を生成
    newpass = crypt.crypt $('#seed').val(), secretstr()
    $('#pass').val newpass
  
    #if copy
    #  $('#pass').select()
    #  document.execCommand 'copy' # コピーバッファにコピー
    #  $('#pass').blur()
    #  $("#answer#{curq}-#{cura}").select()
  
  calcseed = -> # パスワード文字列からシード文字列を生成
    newseed = crypt.crypt $('#pass').val(), secretstr()
    $('#seed').val newseed
    data['seed'] = newseed
  
  sendfile = (files) ->
    file = files[0]
    fileReader = new FileReader()
    fileReader.onload = (event) ->
      # ここで「data」がどうしてもローカルになってしまうので
      # 「globaldata」というのを使う (苦しい!)
      s = event.target.result # 読んだファイルの内容
      if(s[0] == "{")
        data = JSON.parse s
      else
        lines = s.split /\n/
        lines.forEach (line) ->
          m = line.match /^\s*const data = (.*)$/
          if m
            json = m[1].replace(/;.*$/,'')
            data = JSON.parse json
      qas = data['qas']
      seed = data['seed']

      globaldata['qas'] = data['qas']
      globaldata['seed'] = data['seed']

      questions = []
      [0...qas.length].forEach (i) =>
        questions.push qas[i]['question']
      answers = qas[0]['answers']
      
      $('#seed').val seed
      $("#main").children().remove()
      maindiv()
      calcpass()
    fileReader.readAsText file
    false
  
  init = ()  ->
    lib.lib.show('#editor')
    lib.lib.make_html(data);

    #
    # seedかパスワードを編集したら相手を変更
    #
    $('#seed').keyup (e) ->
      data['seed'] = $('#seed').val()
      calcpass()
    $('#pass').keyup (e) ->
      calcseed()

    $('#seed').val data.seed

    # Drag&Drop対応
    $('body')
      .bind "dragover", (e) ->
        false
      .bind "dragend", (e) ->
        false
      .bind "drop", (e) ->
        e.preventDefault() # デフォルトは「ファイルを開く」
        files = e.originalEvent.dataTransfer.files
        sendfile files
        files
  
    #
    # backボタンで戻ったときなど再表示する
    #
    #$(window).on 'pageshow', ->
    #  maindiv()
      
    maindiv()
    calcpass()

  init()

ans = () => answer
  
exports.editor = editor
exports.answer = ans
