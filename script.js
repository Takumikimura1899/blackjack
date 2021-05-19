let patern = [
  ["自分のカードの合計", "相手のカードの合計", "勝敗"],
  ["21を超えている", "21を超えていない", "相手の勝ち"],
  ["21を超えていない", "21を超えている", "自分の勝ち"],
  ["21を超えている", "21を超えている", "引き分け"],
  ["21を超えていない", "21を超えていない", "大きい方が勝ち　同じなら負け"],
];
console.table(patern);
// **********************
// グローバル関数
// **********************

// カードの山 (配列)
let cards = [];
// 自分のカード (配列)
let myCards = [];
// 相手のカード　(配列)
let comCards = [];
// 勝敗決定フラグ　(論理型)
let isGameOver = false;

// **********************
// イベントハンドラの割り当て
// **********************

// ページの読み込みが完了したとき実行する関数を登録
window.addEventListener("load", loadHandler);
// // 「カードを引く」ボタンを押した時実行する関数を登録
document.getElementById("pick").addEventListener("click", clickPickHandler);
// // 「勝負する！」ボタンを押した時に実行する関数を登録
document.getElementById("judge").addEventListener("click", clickjudgeHandler);
// // 「もう一回遊ぶ」ボタンを押した時に実行する関数を登録
document.getElementById("reset").addEventListener("click", clickResetHandler);

// **********************
// イベントハンドラ
// **********************

// ページの読み込みが完了したときに実行する関数
function loadHandler() {
  //     シャッフル
  shuffle();
  //     自分がカードを引く
  pickMyCard();
  //     相手がカードを引く
  pickComCard();
  //     画面を更新する
  updateView();
  // デバッグ
  // debug();
}

// 「カードを引く」ボタンを押した時に実行する関数
function clickPickHandler() {
  // 勝敗が未決定の場合
  if (isGameOver == false) {
    //     自分がカードを引く
    pickMyCard();
    //     相手がカードを引く
    pickComCard();
    //     画面を更新する
    updateView();
  }
}

// 「勝負する」ボタンを押した時実行する関数
function clickjudgeHandler() {
  let result = "";
  // 勝敗が未決定の場合
  if (isGameOver == false) {
    //     勝敗を判定する
    result = judge();
    //     勝敗を画面に表示する
    showResult(result);
    // 勝敗決定フラグを「決定に変更」
    isGameOver = true;
  }
}

// 「もう一回遊ぶ」ボタンを押した時実行する関数
function clickResetHandler() {
  //     画面を初期表示に戻す
  // reloadメソッドでページを再読み込みする
  cards = [];
  myCards = [];
  comCards = [];
  isGameOver = false;
  // 画面を初期表示に戻す
  loadHandler();
}
// カードの山をシャッフルする関数
function shuffle() {
  // カードの初期化
  for (let i = 1; i <= 52; i++) {
    cards.push(i);
  }
  console.log(cards);
  let cardsLength = cards.length;

  for (let i = cardsLength - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  console.log(cards);
}

// 自分がカードを引く関数;
function pickMyCard() {
  // 自分のカードの枚数が４枚以下の場合
  if (myCards.length <= 4) {
    // カードの山(配列)から一枚取り出す
    let card = cards.pop();
    // 取り出した一枚を自分のカード(配列)に追加する
    myCards.push(card);
  }
}

// 相手がカードを引く関数;
function pickComCard() {
  // 自分のカードの枚数が４枚以下の場合
  if (comCards.length <= 4) {
    // カードを引くかどうか考える
    if (pickAI(comCards)) {
      // カードの山(配列)から一枚取り出す
      let card = cards.pop();
      // 取り出した一枚を自分のカード(配列)に追加する
      comCards.push(card);
    }
  }
}

// カードを引くかどうか考える関数
function pickAI(handCards) {
  // 現在のカードの合計を求める
  let total = getTotal(handCards);
  // カードを引くかどうか
  let isPick = false;

  // 合計が１１以下なら「引く」
  if (total <= 11) {
    isPick = true;
  }
  // 合計が12~14なら80%の確率で「引く」
  else if (total >= 12 && total <= 14) {
    if (Math.random() < 0.8) {
      isPick = true;
    }
  }
  // 合計が15~17なら35%の確率で「引く」
  else if (total >= 15 && total <= 17) {
    if (Math.random() < 0.35) {
      isPick = true;
    }
  }
  // 合計が18以上なら「引かない」
  else if (total >= 18) {
    isPick = false;
  }
  // 引くか引かないかを戻り値で返す
  return isPick;
}

// カードの合計を計算する関数
function getTotal(handCards) {
  let total = 0; //計算した合計を入れる変数
  let number = 0; //カードの数字を入れる変数
  for (let i = 0; i < handCards.length; i++) {
    // 13で割った余りを求める
    number = handCards[i] % 13;
    //  j,Q,K(余りが11,12,0)のカードは10と数える
    if (number == 11 || number == 12 || number == 0) {
      total += 10;
    } else {
      total += number;
    }
  }
  //「A」のカードを含んでいる場合
  if (
    handCards.includes(1) ||
    handCards.includes(14) ||
    handCards.includes(27) ||
    handCards.includes(40)
  ) {
    // 「A」を11と数えても合計が21を超えていなければ11と数える
    if (total + 10 <= 21) {
      total += 10;
    }
  }
  // 合計を返す
  return total;
}

// 画面を更新する関数
function updateView() {
  // 自分のカードを表示する
  let myfields = document.querySelectorAll(".myCard");
  for (let i = 0; i < myfields.length; i++) {
    // 自分のカードの枚数がiより大きい
    if (i < myCards.length) {
      //   表面の画像を表示する
      myfields[i].setAttribute("src", getCardPath(myCards[i]));
    } else {
      //   裏面の画像を表示する
      myfields[i].setAttribute("src", "./img/blue.png");
    }
  }
  // 相手のカードを表示する
  let comfields = document.querySelectorAll(".comCard");
  for (let i = 0; i < comfields.length; i++) {
    // 相手のカードの枚数が１より大きい場合
    if (i < comCards.length) {
      // 表面の画像を表示する
      comfields[i].setAttribute("src", getCardPath(comCards[i]));
    } else {
      // 裏面の画像を表示する
      comfields[i].setAttribute("src", "./img/red.png");
    }
  }
  // カードの合計を再計算する
  document.getElementById("myTotal").innerText = getTotal(myCards);
  document.getElementById("comTotal").innerText = getTotal(comCards);
}

// カードの画像パスを求める関数
function getCardPath(card) {
  // カードのパスを入れる変数
  let Path = "";
  // カードの数字が一桁なら先頭にゼロをつける
  if (card <= 9) {
    path = "./img/0" + card + ".png";
  } else {
    path = "./img/" + card + ".png";
  }
  // カードのパスを返す
  return path;
}

// 勝敗を判定する関数
function judge() {
  // 勝敗を表す変数
  let result = "";
  // 自分のカードの合計を求める
  let myTotal = getTotal(myCards);
  // 相手のカードの合計を求める
  let comTotal = getTotal(comCards);
  // 勝敗のパターン表に当てはめて勝敗を決める
  if (myTotal > 21 && comTotal <= 21) {
    // 自分の合計が21を超えていれば負け
    result = "loose";
  } else if (myTotal <= 21 && comTotal > 21) {
    // 相手の合計が21を超えていれば勝ち
  } else if (myTotal > 21 && comTotal > 21) {
    // 自分も相手も21を超えていれば引き分け
    result = "draw";
    // 勝敗を呼び出し元に返す
  } else {
    // 自分も相手も21を超えていない場合
    if (myTotal > comTotal) {
      // 自分の合計が相手の合計より大きければ勝ち
      result = "win";
    } else if (myTotal < comTotal) {
      // 自分の合計が相手の合計より小さければ負け
      result = "loose";
    } else {
      // 自分の合計が相手の合計と同じなら引き分け
      result = "draw";
    }
  }
  // 勝敗を呼び出し元に返す
  return result;
}

// 勝敗を画面に表示する関数
function showResult(result) {
  // メッセージを入れる関数
  let message = "";
  // 勝敗に応じてメッセージを決める
  switch (result) {
    case "win":
      message = "あなたの勝ちです！";
      break;
    case "loose":
      message = "あなたの負けです！";
      break;
    case "draw":
      message = "引き分けです!";
      break;
  }
  // メッセージを表示する
  alert(message);
}

function debug() {
  console.log("カードの山", cards);
  console.log("自分のカード", mycards, "合計" + getTotal(myCards));
  console.log("相手のカード", comCards, "合計" + getTotal(comCards));
  console.log("勝敗決定フラグ", isGameOver);
}
