#
# EpisoPass利用画面のHTMLからJSONを抜き出す
#
ARGF.each { |line|
  line.chomp!
  if line =~ /^\s*const data = (.*})(;.*)?$/
    puts $1
  end
}

