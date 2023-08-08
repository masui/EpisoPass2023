//
// EpisoPass.comのテスト
//

const URL = 'https://EpisoPass.com/index.html' // デプロイ環境
// const URL = 'http://pitecan.com/tmp/episopass.html' // テスト環境

describe('EpisoPassのテスト', () => {
    it('EpisoPass.comにアクセスしてデフォルト問題をチェック', () => {
	cy.visit(URL) // EpisoPass.comサイトに移動
	cy.get('#editbutton').click()     // クリックしてタブを選択
	cy.get('#seed')
	    .should('have.value', 'EpisoPass_123456') // デフォルト値をチェック
	    .clear()
	    .type('EpisoPass_123456')
	    .should('have.value', 'EpisoPass_123456') // 手入力をチェック
	cy.get('#pass')
	    .should('have.value', 'JuxtyNblx.093247')
	
	cy.get('#dasbutton').click() // DAS作成してみる
	cy.get('#dmid0').click()
	cy.get('#dmid0').click()
	cy.get('#dmid0').click()

	cy.get('#id0').should('contain', '東京')
	cy.get('#id0').click()
	cy.get('#id0').click()
	cy.get('#id0').click()

	cy.get('#passspan').should('have.value', 'JuxtyNblx.093247') // パスワード作成できたことをチェック
    })

    it('長い問題のテスト', () => {
	cy.visit(encodeURI(URL+'?questions=ビフテキをおかわりしたのは?;洋菓子屋でオナラするのは?;吊橋が怖いのは?;意外とカツカレーが美味かったのは?;デカい石が割れてるのは?;麻雀させられたのは?;Google道案内に騙されたのは?;K君が川に落ちるのは?;マサコの家は?;包丁売ってたのは?&answers=北海道;青森;岩手;宮城;秋田;山形;福島;茨城;栃木;群馬;埼玉;千葉;東京;神奈川;新潟;富山;石川;福井;山梨;長野;岐阜;静岡;愛知;三重;滋賀;京都;大阪;兵庫;奈良;和歌山;鳥取;島根;岡山;広島;山口;徳島;香川;愛媛;高知;福岡;佐賀;長崎;熊本;大分;宮崎;鹿児島;沖縄'))

	cy.get('#editbutton').click() // 問題編集画面に移動
	cy.get('#question0').should('have.value', 'ビフテキをおかわりしたのは?')
	cy.get('#answer0-0').should('have.value', '北海道')
	cy.get('#answer0-46').should('have.value', '沖縄')
	cy.get('#question1').should('have.value', '洋菓子屋でオナラするのは?')
	cy.get('#answer1-0').should('have.value', '北海道')
	cy.get('#answer1-46').should('have.value', '沖縄')

	cy.get('#dasbutton').click() // DAS生成画面に移動

	// 左上のボタンを10回クリック
	for(var i=0;i<10;i++){
	    cy.get('#dmid0').click()
	}

	cy.get('#id0').should('contain', '北海道')
	
	// 左上のボタンを10回クリック
	for(var i=0;i<10;i++){
	    cy.get('#id0').click()
	}

	cy.get('#passspan').should('have.value', 'RnccdDlbyRkwa71876')
    })
})
