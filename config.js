let options = {
    titles: ['章','节','知识点','题型','题干','选项A','选项B','选项C','选项D','正确答案','难易度','命题人'
    // ,'课','流水'
    ]
}
options.fields = Object.keys( {
  "chapter": 1,
  "section": 1,
  "knowledge": "毛泽东思想的形成和发展",
  "type": "单选",
  "stem": "毛泽东思想科学体系的主要创立者是（）。\n",
  "optionA": "毛泽东",
  "optionB": "周恩来",
  "optionC": "朱德",
  "optionD": "刘少奇",
  "answer": "A",
  "difficulty": "易",
  "author": "詹红菊",
  // "course":'GY',
  // "serial":'1212'
});

let rules = {
  // '8A6ART':/毛泽东思想和中国特色社会主义理论/,
  // 'N3KN7V':/马克思主义/,
  'PYZZSM-1':/思想道德修/,
  'X7UHFG-1':/中国近.*代史/,
  'MZDSX-1':/毛泽东思想/
}
const path = require('path');
module.exports = {
  options,rules,dist:path.resolve('./')
}