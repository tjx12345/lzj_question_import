const fs = require('fs');
let index = 1;


exports.doFileByArr = function(arr){
    let courseName = arr[0].course;
    console.log(arr.length);
    fs.writeFileSync(`./${courseName}_${index++}.json`,JSON.stringify(arr),'utf8');
}
exports.startMakeJson = function(sourceArr,baseObj,courseMap){

    let tempArr = [];
    let tmp_course_code = sourceArr[0].course_code;

    for(let i = 0; i < sourceArr.length; i++) {
        let q = sourceArr[i];
        let isLast = (i == sourceArr.length - 1);
        let readyInsertObj = {
            ...baseObj,
            chapter:q.chapter,
            cid:q.course_code,
            course: courseMap[q.course_code],
            difficulty:q.degree == 1? '易': (q.degree == 2?'中':'难'),
            id:q.question_id,
            knowledge:q.keywords,
            stem:q.html,
            type:q.type,
            optionA:q.selects.A||q.selects.T||'',
            optionB:q.selects.B||q.selects.F||'',
            optionC:q.selects.C||'',
            optionD:q.selects.D||''
        };

        tempArr.push(readyInsertObj);
        if(q.course_code != tmp_course_code || isLast )  {
            tmp_course_code = q.course_code;
            sourceArr.splice(0,isLast?i+1:i)
            exports.doFileByArr( tempArr.splice(0,isLast?i+1:i) );
            i=0;
        }
        
    }
}

if(!module.parent) {
    const sourceArr = require('./question.json');
    const baseObj = require('./libs/baseObj.json');
    const courseMap = {
        'PYZZSM-1':'20181127_思想道德修养与法律基础（首义）',
        'MZDSX-1':'20181127_毛泽东思想和中国特色社会主义体系概论（首义）',
        'X7UHFG-1':'20181127_中国近现代史纲要   （首义）'

    }
    exports.startMakeJson(sourceArr,baseObj,courseMap);
}


