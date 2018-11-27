const xlsTools = require('./xlsxTools.js');
const fs = require('fs');
var inquirer = require('inquirer');
const path = require('path');

function _getPath(...paths) {
    return path.join(...paths);
}

const { options, rules, dist } = require('../config');


function _getCourseCode(name) {
    for (let key in rules) {
        if (rules[key].test(name)) {
            return key;
        }
    }
}

exports.makeJsonByXls = function(src) {
    let arr = xlsTools.parseXlsx(src, options);

    let courseCode = _getCourseCode(src)
    console.log(src, '文件:', courseCode, ',记录数:', arr.length);
    arr = operationQuestionSelects(arr, courseCode);

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
                question_id: it._id,
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