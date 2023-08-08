//
// EpisoPass.comがちゃんと動くかのテスト
// デフォルトのQ/AおよびEpisoQのQ/AでDAS生成までチェック
//
// jest-puppeteerというのを使う
// 何故かnpmでは入らなかったのでyarnで入れる
//

describe('EpisoPass.comのテスト', () => {
    beforeAll(async () => {
	await page.goto('https://episopass.com');
    })
    
    test('ページのタイトルが「EpisoPass」', async () => {
	await expect(page.title()).resolves.toMatch('EpisoPass');
    });

    test('デフォルト問題で正しいパスワード生成するかチェック', async () => {
	await page.click('#editbutton');

	var data;

	// $('#seed')の値を取得
	// どう書くのが正解なのかよくわからない

	// 方法1
	//var seed = await page.evaluate((selector) => {
	//    return document.querySelector(selector).value;
	//}, '#seed')

	// 方法2
	//var seed = await page.$eval('#seed', item => {
	//    return item.value;
	//});

	// 方法3
	var item = await page.$('#seed')
	var seed = await (await item.getProperty('value')).jsonValue();

    	expect(seed).toMatch('EpisoPass_123456')
	
	data = await (await (await page.$('#answer0-1')).getProperty('value')).jsonValue();

    	expect(data).toMatch('大阪')

	// DAS作成ページに移動
	await page.click('#dasbutton');

	// 左上のボタンを3回クリック
	await page.click('#dmid0');
	await page.click('#dmid0');
	await page.click('#dmid0');

	// 左上のボタンが「東京」になっていることを確認
	data = await (await (await page.$('#id0')).getProperty('innerHTML')).jsonValue();
	expect(data).toMatch('東京')

	// 左上の東京ボタンを3回クリック
	await page.click('#id0');
	await page.click('#id0');
	await page.click('#id0');

	// 東京を3回選んだとき生成されるパスワードのチェック
	data = await (await (await page.$('#passspan')).getProperty('value')).jsonValue();
    	// expect(data).toMatch('JuxtyNbld=413067')
	expect(data).toMatch('JuxtyNblx.093247')
    })

    test('長い問題', async () => {
	let data
	
	await page.goto("https://episopass.com/episopass.html?questions=ビフテキをおかわりしたのは?;洋菓子屋でオナラするのは?;吊橋が怖いのは?;意外とカツカレーが美味かったのは?;デカい石が割れてるのは?;麻雀させられたのは?;Google道案内に騙されたのは?;K君が川に落ちるのは?;マサコの家は?;包丁売ってたのは?&answers=北海道;青森;岩手;宮城;秋田;山形;福島;茨城;栃木;群馬;埼玉;千葉;東京;神奈川;新潟;富山;石川;福井;山梨;長野;岐阜;静岡;愛知;三重;滋賀;京都;大阪;兵庫;奈良;和歌山;鳥取;島根;岡山;広島;山口;徳島;香川;愛媛;高知;福岡;佐賀;長崎;熊本;大分;宮崎;鹿児島;沖縄")
	
	await expect(page.title()).resolves.toMatch('EpisoPass');
	
	await page.click('#editbutton');
	await page.click('#dasbutton');
	
	var item = await page.$('#seed')
	var seed = await (await item.getProperty('value')).jsonValue();

    	expect(seed).toMatch('EpisoPassSeed01234')

	// 左上のボタンを10回クリック
	for(var i=0;i<10;i++){
	    await page.click('#dmid0');
	}
	
	// 左上のボタンが「東京」になっていることを確認
	data = await (await (await page.$('#id0')).getProperty('innerHTML')).jsonValue();
	expect(data).toMatch('北海道')
	
	// 左上の北海道ボタンを10回クリック
	for(var i=0;i<10;i++){
	    await page.click('#id0');
	}

	// 東京を3回選んだとき生成されるパスワードのチェック
	data = await (await (await page.$('#passspan')).getProperty('value')).jsonValue();
    	// expect(data).toMatch('RnccdDlblSoyw02984')
	expect(data).toMatch('RnccdDlbyRkwa71876')
    })
});
