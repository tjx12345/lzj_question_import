const xlsTools = require('./xlsxTools.js');
const fs = require('fs');
var inquirer = require('inquirer');
const path = require('path');
const uuidv1 = require('uuid/v1');



function _getPath(...paths) {
    return path.join(...paths);
}

const { options, rules, dist } = require('../config');

const NUM = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '二十一', '二十二', '二十三', '二十四', '二十五'];



function _getCourseCode(name) {
    for (let key in rules) {
        if (rules[key].test(name)) {
            return key;
        }
    }
}

function _getChapter(arr) {
    let o = {};
    arr.forEach(oo => {
        let chapterNum = (oo.chapter - 0);
        if (oo.chapter == undefined) {
            return;
        }
        o[chapterNum + ''] = `第${NUM[chapterNum]}章`;
    });
    return o;
}

exports.makeJsonByXls = function(src) {
    let arr = xlsTools.parseXlsx(src, options);

    let courseCode = _getCourseCode(src)
    console.log(src, '文件:', courseCode, ',记录数:', arr.length);
    arr = operationQuestionSelects(arr, courseCode);

    let obj = _getChapter(arr);
    console.log(JSON.stringify(obj));

    return arr;
}


function operationQuestionSelects(data, courseCode) {
    const tem = []
    try {
        data.forEach(it => {
            //if (it.cid === '8A6ART') {
            const selects = {}
            const answer = String(it.answer).trim()
            if (answer == 'T' || answer == 'F') {
                Object.assign(selects, { "F": "错误", "T": "正确" })
            } else {
                Object.keys(it).forEach(i => {
                    if (i.substr(0, 6) == 'option') {
                        Object.assign(selects, {
                            [i.substr(6)]: it[i]
                        })
                    }
                })
            }
            const type = String(it.type).trim()
            const degree = String(it.difficulty).trim()
            tem.push({

                question_id: uuidv1(),
                course_code: courseCode,
                chapter: it.chapter,
                html: it.stem,
                selects,
                img: it.pic || '',
                answer: it.answer,
                degree: degree == '易' ? 1 : degree == '中' ? 2 : 3,
                keywords: it.knowledge,
                description: it.analysis || '',
                type: type == '单选' ? 1 : type == '多选' ? 2 : type == '判断' ? 4 : type == '判断正误' ? 4 : type == '判断题' ? 4 : type,
            })
            //}
        });
        console.log(tem.length);
        return tem;
    } catch (e) {
        console.error(e)
    }

}


if (!module.parent) {
    let regex = /\.xlsx?$/;
    let fileNames = fs.readdirSync(dist);
    let titles = [];
    fileNames = fileNames.filter(f => regex.test(f));
    inquirer
        .prompt({
            type: 'checkbox',
            name: 'selected',
            message: '请选择',
            choices: fileNames
        })
        .then(answers => {
            if (answers.selected.length != 0) {
                let filesData = answers.selected.map(file => exports.makeJsonByXls(_getPath(dist, file)));
                let tmpArr = [];
                filesData.forEach(f => {
                    tmpArr = tmpArr.concat(f);
                    console.log(tmpArr.length);
                });
                console.log('总记录数:', tmpArr.length);
                fs.writeFileSync(_getPath(dist, './question.json'), JSON.stringify(tmpArr), 'utf8');

            }
        });

}