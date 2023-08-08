require 'base64'
require 'erb'
require 'json'

erbsrc = File.read("./src/episodas.html.erb")

json = File.read("./src/sampledata.json")
data = JSON.parse(json)

# episodas.html.erb を展開
template = ERB.new erbsrc
text = template.result

puts "const encoded = `"
puts Base64.encode64(text)

print <<EOF
`;

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
let dastemplate = b64DecodeUnicode(encoded);

exports.dastemplate = dastemplate;

EOF
