var all_cards = [
  [
    [ '薄', [ '氵', '艹' ] ], [ '呆', [ '木', '口' ] ],
    [ '鋬', [ '金', '扌' ] ], [ '媬', [ '亻', '女' ] ]
  ],
  [
    [ '淩', [ '氵', '土' ] ], [ '蠩', [ '虫', '言' ] ],
    [ '愀', [ '火', '忄' ] ], [ '絹', [ '月', '糹' ] ]
  ],
  [
    [ '籓', [ '氵', '竹' ] ], [ '鑴', [ '山', '王' ] ],
    [ '鮖', [ '石', '魚' ] ], [ '隝', [ '鳥', '阝' ] ]
  ],
  [
    [ '疒', [ '疒' ] ], [ '馬', [ '馬' ] ], [ '盪', [ '氵', '日' ] ],
    [ '镅', [ '钅', '目' ] ], [ '襚', [ '辶', '衤' ] ]
  ],
  [
    [ '瀩', [ '氵', '禾' ] ], [ '悐', [ '犭', '心' ] ],
    [ '輕', [ '一', '車' ] ], [ '谜', [ '米', '讠' ] ]
  ],
  [
    [ '潍', [ '氵', '纟' ] ], [ '則', [ '刂', '貝' ] ],
    [ '釃', [ '酉', '广' ] ], [ '顭', [ '頁', '冖' ] ]
  ],
  [
    [ '礻', [ '礻' ] ], [ '鱼', [ '鱼' ] ], [ '窪', [ '氵', '宀' ] ],
    [ '幑', [ '巾', '彳' ] ], [ '飭', [ '力', '飠' ] ]
  ],
  [
    [ '聻', [ '氵', '耳' ] ], [ '鞇', [ '革', '大' ] ],
    [ '雷', [ '雨', '田' ] ], [ '覽', [ '罒', '丿' ] ]
  ],
  [
    [ '蓺', [ '艹', '土' ] ], [ '箸', [ '竹', '日' ] ],
    [ '绣', [ '禾', '纟' ] ], [ '鞚', [ '宀', '革' ] ]
  ],
  [
    [ '蘰', [ '艹', '糹' ] ], [ '鰢', [ '魚', '馬' ] ],
    [ '谠', [ '讠', '冖' ] ], [ '鳓', [ '鱼', '丿' ] ]
  ],
  [
    [ '萠', [ '艹', '月' ] ], [ '隩', [ '阝', '米' ] ],
    [ '襭', [ '衤', '頁' ] ], [ '饠', [ '飠', '罒' ] ]
  ],
  [
    [ '蘹', [ '艹', '忄' ] ], [ '鶐', [ '鳥', '辶' ] ],
    [ '庫', [ '車', '广' ] ], [ '虜', [ '力', '田' ] ]
  ],
  [
    [ '藀', [ '艹', '火' ] ], [ '研', [ '石', '一' ] ],
    [ '疾', [ '疒', '大' ] ], [ '禉', [ '酉', '礻' ] ]
  ],
  [
    [ '讙', [ '艹', '言' ] ], [ '寳', [ '王', '目' ] ],
    [ '贒', [ '心', '貝' ] ], [ '霺', [ '彳', '雨' ] ]
  ],
  [
    [ '巾', [ '巾' ] ], [ '耳', [ '耳' ] ], [ '蠆', [ '艹', '虫' ] ],
    [ '镚', [ '山', '钅' ] ], [ '猘', [ '犭', '刂' ] ]
  ],
  [
    [ '稜', [ '木', '土' ] ], [ '覬', [ '山', '目' ] ],
    [ '庒', [ '一', '广' ] ], [ '饙', [ '飠', '丿' ] ]
  ],
  [
    [ '力', [ '力' ] ], [ '罒', [ '罒' ] ], [ '纅', [ '木', '糹' ] ],
    [ '篯', [ '竹', '钅' ] ], [ '醷', [ '心', '酉' ] ]
  ],
  [
    [ '稍', [ '木', '月' ] ], [ '魯', [ '魚', '日' ] ],
    [ '獱', [ '犭', '貝' ] ], [ '鰰', [ '礻', '田' ] ]
  ],
  [
    [ '懡', [ '木', '忄' ] ], [ '騭', [ '阝', '馬' ] ],
    [ '梨', [ '禾', '刂' ] ], [ '忁', [ '彳', '大' ] ]
  ],
  [
    [ '衤', [ '衤' ] ], [ '纟', [ '纟' ] ], [ '愁', [ '木', '火' ] ],
    [ '鸍', [ '鳥', '巾' ] ], [ '霭', [ '讠', '雨' ] ]
  ],
  [
    [ '譟', [ '木', '言' ] ], [ '鿎', [ '石', '辶' ] ],
    [ '糓', [ '米', '冖' ] ], [ '聺', [ '宀', '耳' ] ]
  ],
  [
    [ '蠜', [ '木', '虫' ] ], [ '癍', [ '王', '疒' ] ],
    [ '顐', [ '車', '頁' ] ], [ '鳓', [ '鱼', ' 革' ] ]
  ],
  [
    [ '牆', [ '口', '土' ] ], [ '鑝', [ '王', '辶' ] ],
    [ '谫', [ '讠', '刂' ] ], [ '禤', [ '礻', '罒' ] ]
  ],
  [
    [ '結', [ '口', '糹' ] ], [ '疝', [ '山', '疒' ] ],
    [ '继', [ '米', '纟' ] ], [ '鰴', [ '彳', '田' ] ]
  ],
  [
    [ '朐', [ '口', '月' ] ], [ '籯', [ '竹', '目' ] ],
    [ '運', [ '車', '冖' ] ], [ '幕', [ '巾', '大' ] ]
  ],
  [
    [ '頁', [ '頁' ] ], [ '雨', [ '雨' ] ], [ '恬', [ '口', '忄' ] ],
    [ '鮝', [ '魚', '一' ] ], [ '镲', [ '钅', '宀' ] ]
  ],
  [
    [ '煔', [ '口', '火' ] ], [ '陽', [ '阝', '日' ] ],
    [ '懬', [ '心', '广' ] ], [ '鲰', [ '鱼', '耳' ] ]
  ],
  [
    [ '飠', [ '飠' ] ], [ '革', [ '革' ] ], [ '讝', [ '口', '言' ] ],
    [ '鷌', [ '鳥', '馬' ] ], [ '猶', [ '犭', '酉' ] ]
  ],
  [
    [ '虽', [ '口', '虫' ] ], [ '袥', [ '石', '衤' ] ],
    [ '積', [ '禾', '貝' ] ], [ '另', [ '力', '丿' ] ]
  ],
  [
    [ '鑸', [ '金', '土' ] ], [ '騞', [ '石', '馬' ] ],
    [ '顖', [ '心', '頁' ] ], [ '鿨', [ '巾', '田' ] ]
  ],
  [
    [ '鐑', [ '金', '糹' ] ], [ '裎', [ '王', '衤' ] ],
    [ '獷', [ '犭', '广' ] ], [ '寄', [ '宀', '大' ] ]
  ],
  [
    [ '鐗', [ '金', '月' ] ], [ '遄', [ '山', '辶' ] ],
    [ '醔', [ '禾', '酉' ] ], [ '鳕', [ '鱼', '雨' ] ]
  ],
  [
    [ '懰', [ '金', '忄' ] ], [ '癤', [ '竹', '疒' ] ],
    [ '诹', [ '讠', '耳' ] ], [ '饡', [ '貝', '飠' ] ]
  ],
  [
    [ '鍬', [ '金', '火' ] ], [ '鱡', [ '魚', '目' ] ],
    [ '糋', [ '米', '刂' ] ], [ '勒', [ '力', '革' ] ]
  ],
  [
    [ '鍧', [ '金', '言' ] ], [ '锕', [ '阝', '钅' ] ],
    [ '禈', [ '車', '礻' ] ], [ '纯', [ '纟', '丿' ] ]
  ],
  [
    [ '鉵', [ '金', '虫' ] ], [ '鸔', [ '鳥', '日' ] ],
    [ '滂', [ '一', '冖' ] ], [ '徳', [ '彳', '罒' ] ]
  ],
  [
    [ '擡', [ '扌', '土' ] ], [ '鷭', [ '鳥', '米' ] ],
    [ '镥', [ '钅', '鱼' ] ], [ '贀', [ '貝', '大' ] ]
  ],
  [
    [ '刂', [ '刂' ] ], [ '雨', [ '雨' ] ], [ '撧', [ '扌', '糹' ] ],
    [ '礍', [ '石', '日' ] ], [ '餫', [ '車', '飠' ] ]
  ],
  [
    [ '捕', [ '扌', '月' ] ], [ '騜', [ '王', '馬' ] ],
    [ '缬', [ '一', '纟' ] ], [ '聈', [ '力', '耳' ] ]
  ],
  [
    [ '礻', [ '礻' ] ], [ '革', [ '革' ] ], [ '搄', [ '扌', '忄' ] ],
    [ '褍', [ '山', '衤' ] ], [ '懘', [ '心', '冖' ] ]
  ],
  [
    [ '頁', [ '頁' ] ], [ '彳', [ '彳' ] ], [ '烲', [ '扌', '火' ] ],
    [ '遾', [ '竹', '辶' ] ], [ '獥', [ '犭', '丿' ] ]
  ],
  [
    [ '擔', [ '扌', '言' ] ], [ '癬', [ '魚', '疒' ] ],
    [ '麕', [ '禾', '广' ] ], [ '鿡', [ '巾', '罒' ] ]
  ],
  [
    [ '蜇', [ '扌', '虫' ] ], [ '隤', [ '阝', '目' ] ],
    [ '谉', [ '讠', '宀' ] ], [ '鿐', [ '酉', '田' ] ]
  ],
  [
    [ '佳', [ '亻', '土' ] ], [ '癮', [ '阝', '疒' ] ],
    [ '獴', [ '犭', '冖' ] ], [ '霧', [ '力', '雨' ] ]
  ],
  [
    [ '礻', [ '礻' ] ], [ '耳', [ '耳' ] ], [ '纀', [ '亻', '糹' ] ],
    [ '鸘', [ '鳥', '目' ] ], [ '穎', [ '禾', '頁' ] ]
  ],
  [
    [ '讠', [ '讠' ] ], [ '革', [ '革' ] ], [ '倩', [ '亻', '月' ] ],
    [ '磨', [ '石', '广' ] ], [ '衔', [ '钅', '彳' ] ]
  ],
  [
    [ '恘', [ '亻', '忄' ] ], [ '韹', [ '王', '日' ] ],
    [ '醾', [ '米', '酉' ] ], [ '师', [ '巾', '丿' ] ]
  ],
  [
    [ '焲', [ '亻', '火' ] ], [ '驨', [ '山', '馬' ] ],
    [ '轒', [ '車', '貝' ] ], [ '寰', [ '宀', '罒' ] ]
  ],
  [
    [ '諐', [ '亻', '言' ] ], [ '笠', [ '竹', '一' ] ],
    [ '襶', [ '衤', '田' ] ], [ '鲗', [ '刂', '鱼' ] ]
  ],
  [
    [ '蟘', [ '亻', '虫' ] ], [ '鱁', [ '魚', '辶' ] ],
    [ '缌', [ '心', '纟' ] ], [ '餸', [ '飠', '大' ] ]
  ],
  [
    [ '酉', [ '酉' ] ], [ '耳', [ '耳' ] ], [ '嬯', [ '女', '土' ] ],
    [ '鰱', [ '魚', '車' ] ], [ '褷', [ '衤', '彳' ] ]
  ],
  [
    [ '巾', [ '巾' ] ], [ '革', [ '革' ] ], [ '纓', [ '女', '糹' ] ],
    [ '隨', [ '阝', '辶' ] ], [ '寳', [ '一', '貝' ] ]
  ],
  [
    [ '嬴', [ '女', '月' ] ], [ '鷾', [ '鳥', '心' ] ],
    [ '瘌', [ '疒', '刂' ] ], [ '宓', [ '宀', '丿' ] ]
  ],
  [
    [ '纟', [ '纟' ] ], [ '鱼', [ '鱼' ] ], [ '慺', [ '女', '忄' ] ],
    [ '礸', [ '石', '目' ] ], [ '玀', [ '犭', '罒' ] ]
  ],
  [
    [ '熡', [ '女', '火' ] ], [ '锽', [ '王', '钅' ] ],
    [ '馞', [ '禾', '冖' ] ], [ '餾', [ '飠', '田' ] ]
  ],
  [
    [ '頁', [ '頁' ] ], [ '力', [ '力' ] ], [ '謱', [ '女', '言' ] ],
    [ '崑', [ '山', '日' ] ], [ '诶', [ '讠', '大' ] ]
  ],
  [
    [ '蠳', [ '女', '虫' ] ], [ '篤', [ '竹', '馬' ] ],
    [ '糜', [ '米', '广' ] ], [ '鿅', [ '礻', '雨' ] ]
  ],
];

// global mutable state
const defaultTimeout = 150;
var gameOver = false;
var semaphore = 0;
var breakdown = {};

function ensureSemaphoreZero() {
  return new Promise(function(resolve, reject) {
    (function waitForSemaphoreZero() {
      if (semaphore == 0)
        return resolve();
      setTimeout(waitForSemaphoreZero, 10);
    })();
  });
}

const sleep = (milliseconds) => {
  semaphore++;
  return new Promise(resolve => { setTimeout(resolve, milliseconds); })
      .then(() => { semaphore--; })
};

function whichSelected() { return document.querySelectorAll(".selected"); }

function forfeitCallback() {
  ensureSemaphoreZero().then(() => {
    // If the game is over, no more clicks.
    if (gameOver) {
      return;
    }
    console.log(breakdown);
    for (card_1_symbol of document.getElementById("card_1").children) {
      for (card_2_symbol of document.getElementById("card_2").children) {
        var text_1 = card_1_symbol.textContent;
        var text_2 = card_2_symbol.textContent;
        var components_1 = breakdown[text_1];
        var components_2 = breakdown[text_2];
        var intersection = _.intersection(components_1, components_2);
        if (intersection.length == 1) {
          card_1_symbol.click();
          card_2_symbol.click();
          return;
        }
      }
    }
    console.log("NO MATCH?");
  });
}

function onClickCallback() {
  ensureSemaphoreZero().then(() => {
    // If the game is over, no more clicks.
    if (gameOver) {
      return;
    }

    // If already selected, allow us to deselect.
    if (_.includes(this.classList, "selected")) {
      this.classList.toggle("selected");
      return;
    }

    // If another symbol in this card is selected, don't act.
    if (_.includes(
            _.map(whichSelected(), function(e) { return e.parentElement.id; }),
            this.parentElement.id)) {
      return;
    }

    // Else, allow us to select a new symbol.
    this.classList.toggle("selected");

    // If not two symbols are selected, don't act.
    if (whichSelected().length != 2) {
      return;
    }

    var selected = whichSelected();
    selected = _.map(selected, function(e) { return e.textContent[0]; });
    selected = _.map(selected, function(e) { return breakdown[e]; });
    var intersection = _.intersection(...selected);

    if (intersection.length == 0) {
      var es = whichSelected();
      _.forEach(es, function(e) { e.classList.add("wrong"); });
      sleep(1 * defaultTimeout).then(() => {
        _.forEach(es, function(e) { e.classList.add("animate__headShake"); });
        sleep(2 * defaultTimeout).then(() => {
          _.forEach(es, function(e) {
            e.classList.remove("animate__headShake");
            e.classList.remove("wrong");
          });
          _.forEach(es, function(e) { e.classList.toggle("selected"); });
        });
      });
      return;
    }

    else if (intersection.length == 1) {
      var es = whichSelected();
      sleep(1 * defaultTimeout).then(() => {
        _.forEach(es, function(e) { e.classList.add("animate__tada"); });
        sleep(4 * defaultTimeout).then(() => {
          _.forEach(es, function(e) { e.classList.remove("animate__tada"); });

          // unveil reveal row
          revealRow = document.getElementById("revealRow");
          revealCard = document.getElementById("revealCard");
          revealCard.textContent = intersection[0];
          revealRow.classList.remove("invisible");
          revealCard.classList.remove("invisible");
          gameOver = true;
        });
      });
    }
  });
}

function main() {
  var card_1 = _.sample(all_cards);
  all_cards = _.without(all_cards, card_1);

  var card_2 = _.sample(all_cards);
  all_cards = _.without(all_cards, card_2);

  var cardsList = [
    {"num" : 1, "id" : "card_1", "data" : card_1, "color" : "info"},
    {"num" : 2, "id" : "card_2", "data" : card_2, "color" : "warning"},
  ];

  for (const card of cardsList) {
    card_div = document.getElementById(card['id']);
    for (const i in card['data']) {
      var symbol_and_bits = card['data'][i];
      var symbol = symbol_and_bits[0];
      var bits = symbol_and_bits[1];
      breakdown[symbol] = bits;

      var symbol_span = document.createElement("div");
      symbol_span.textContent = symbol; // .concat(bits);
      symbol_span.classList.add(...["text-black", "bg-".concat(card['color']),
                                    "cell", "animate__animated", "m-2", "p-2"]);
      card_div.append(symbol_span);
    }
  }

  for (node of document.querySelectorAll("#gameboard .cell")) {
    node.onclick = onClickCallback;
  }

  document.getElementById("forfeit").onclick = forfeitCallback;
}

main();
