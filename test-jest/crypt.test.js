//
// crypt.coffeeのテスト
//
const crypt = require('../src/crypt');

randomString = () => { // ' '(0x20)から'~'(0x7e)までのランダム文字列生成
    let s = ""
    for(var i=0;i<1000;i++){
	let chars = 0x7f - 0x20
	let code = 0x20 + Math.floor(Math.random() * chars)
	s += String.fromCharCode(code)
    }
    return s
}

const seedSamples = [
    "abcdefghijklmn",
    "ABCDEFG",
    "1234567",
    "3141592653589790".repeat(100),
    "_________________________________",
    "!@#$%^&*()0123456".repeat(100),
    "abcdefg-_".repeat(100),
    "1qaz@WSX3edc$RFV5tgb^YHN"
]
const secretSamples = [
    "秘密の文字列", // 日本語の秘密文字列
    "Very Long Secret String".repeat(100), // 長い秘密文字列
    ""
]

describe('文字置換アルゴリズムcrypt()のテスト',() => {
    test('同じ長さに変換される', () => {
	secretSamples.forEach((secret) => {
	    seedSamples.forEach((seed) => {
		let crypted = crypt.crypt(seed,secret)
		expect(crypted.length).toBe(seed.length)
	    })
	    for(var i=0;i<100;i++){
		let seed = randomString()
		let crypted = crypt.crypt(seed,secret)
		expect(crypted.length).toBe(seed.length)
	    }
	})
    });
    
    test('もとの文字列に戻る', () => {
	secretSamples.forEach((secret) => {
	    seedSamples.forEach((seed) => {
		let crypted = crypt.crypt(seed,secret)
		let crypted2 = crypt.crypt(crypted,secret)
		expect(crypted2).toBe(seed) // crypt()を2回適用するともとに戻る
	    })
	    for(var i=0;i<100;i++){
		let seed = randomString()
		let crypted = crypt.crypt(seed,secret)
		let crypted2 = crypt.crypt(crypted,secret)
		expect(crypted2).toBe(seed) // crypt()を2回適用するともとに戻る
	    }
	})
    });
    
    test('同じ文字クラスに変換される', () => {
	let seed, crypted
	secretSamples.forEach((secret) => {
	    seed = "lowercasecharacters"
	    crypted = crypt.crypt(seed,secret)
	    expect(crypted).toMatch(/^[a-z]+$/) // 小文字のシードは小文字に変換される
	    seed = "3141592653589000"
	    crypted = crypt.crypt(seed,secret)
	    expect(crypted).toMatch(/^[0-9]+$/)
	})
    })

    test('同じパスワードは生成されない(1)', () => {
	let seed = "abcdefghijkl"
	let passwords = {}
	let collisions = 0
	for(var i=0;i<100000;i++){
	    crypted = crypt.crypt(seed,String(i))
	    if(passwords[crypted]){
		collisions += 1
		console.log(crypted)
	    }
	    passwords[crypted] = true
	}
	expect(collisions).toBe(0)
    })

    test('同じパスワードは生成されない(2)', () => {
	let seed = "000000000000"
	let passwords = {}
	let collisions = 0
	for(var i=0;i<100000;i++){
	    crypted = crypt.crypt(seed,String(i))
	    if(passwords[crypted]){
		collisions += 1
		console.log(crypted)
	    }
	    passwords[crypted] = true
	}
	expect(collisions).toBe(0)
    })
})

