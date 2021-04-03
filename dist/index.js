"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const emoji_regex_1 = tslib_1.__importDefault(require("emoji-regex"));
const tiny_pinyin_1 = tslib_1.__importDefault(require("tiny-pinyin"));
const EnglishReg = /^[a-zA-Z]/;
const ChineseReg = /^[\u4e00-\u9fff]/;
const NumberReg = /^\d+$/;
function tryGetNumber(str) {
    const res = /^\d+(\.*\d*)*/g.exec(str);
    if (res) {
        const index = res[0].length;
        if (NumberReg.test(res[0])) {
            return { target: Number(res[0]), index };
        }
        return {
            target: res[0],
            index: index,
        };
    }
    else {
        return { target: str[0], index: 1 };
    }
}
var Priority;
(function (Priority) {
    Priority[Priority["SPECIAL_CHAR"] = 0] = "SPECIAL_CHAR";
    Priority[Priority["NUMBER_CHAR"] = 1] = "NUMBER_CHAR";
    Priority[Priority["CHINESE_CHAR"] = 2] = "CHINESE_CHAR";
    Priority[Priority["ENGLISH_CHAR"] = 3] = "ENGLISH_CHAR";
})(Priority || (Priority = {}));
function getPriority(val) {
    if (typeof val === 'number' || /^\d+(\.*\d*)*/.test(val)) {
        return Priority.NUMBER_CHAR;
    }
    if (ChineseReg.test(val)) {
        return Priority.CHINESE_CHAR;
    }
    if (EnglishReg.test(val)) {
        return Priority.ENGLISH_CHAR;
    }
    return Priority.SPECIAL_CHAR;
}
function getTargetStr(prev, next) {
    const prevArr = prev.split('.').map((item) => {
        if (item === '') {
            return '0';
        }
        return item;
    });
    const nextArr = next.split('.').map((item) => {
        if (item === '') {
            return '0';
        }
        return item;
    });
    const prevLength = prevArr.length;
    const nextLength = nextArr.length;
    const len = Math.max(prevLength, nextLength);
    for (let i = 0; i < len - prevLength; i++) {
        prevArr.push('0');
    }
    for (let i = 0; i < len - nextLength; i++) {
        nextArr.push('0');
    }
    return [prevArr.join('.'), nextArr.join('.')];
}
function tryTransformDecimal(prev, next) {
    const [prevTarget, nextTarget] = getTargetStr(prev, next);
    const prevArr = prevTarget.split('.');
    const nextArr = nextTarget.split('.');
    const prevLength = prevArr.length;
    const nextLength = nextArr.length;
    const len = Math.min(prevLength, nextLength);
    for (let i = 0; i < len; i++) {
        const prev = i !== 0 ? `0.${prevArr[i]}` : prevArr[i];
        const next = i !== 0 ? `0.${nextArr[i]}` : nextArr[i];
        if (parseFloat(prev) !== parseFloat(next)) {
            return [parseFloat(prev), parseFloat(next)];
        }
    }
    const prevLen = prev.split('.').length;
    const nextLen = next.split('.').length;
    return [prevLen, nextLen];
}
function compare(prevVal, nextVal, locale = 'en-US') {
    if (!prevVal) {
        return -1;
    }
    if (!nextVal) {
        return 1;
    }
    const aNumber = tryGetNumber(String(prevVal));
    const bNumber = tryGetNumber(String(nextVal));
    const prev = aNumber.target;
    const next = bNumber.target;
    const prevPriority = getPriority(prev);
    const nextPriority = getPriority(next);
    if (prevPriority !== nextPriority) {
        return prevPriority - nextPriority;
    }
    else {
        if (prev !== next) {
            switch (prevPriority) {
                case Priority.NUMBER_CHAR: {
                    const [prevNumber, nextNumber] = tryTransformDecimal(String(prev), String(next));
                    if (prevNumber === nextNumber) {
                        return compare(String(prevVal).substring(aNumber.index), String(nextVal).substring(bNumber.index));
                    }
                    return prevNumber - nextNumber;
                }
                case Priority.CHINESE_CHAR: {
                    if (tiny_pinyin_1.default.isSupported()) {
                        const prevChar = tiny_pinyin_1.default.convertToPinyin(prev);
                        const nextChar = tiny_pinyin_1.default.convertToPinyin(next);
                        const cmp = prevChar.localeCompare(nextChar, locale);
                        if (cmp === 0) {
                            return compare(String(prevVal).substring(aNumber.index), String(nextVal).substring(bNumber.index));
                        }
                        return cmp;
                    }
                    else {
                        return String(prev).localeCompare(String(next), locale);
                    }
                }
                case Priority.ENGLISH_CHAR:
                case Priority.SPECIAL_CHAR: {
                    return String(prev).localeCompare(String(next), locale);
                }
            }
        }
        else {
            return compare(String(prevVal).substring(aNumber.index), String(nextVal).substring(bNumber.index));
        }
    }
}
const regex = emoji_regex_1.default();
function sort(source, property, order = 'asc', locale = 'en-US') {
    try {
        return source
            .map((item) => {
            const val = item[property];
            return {
                ...item,
                parsed: typeof val === 'number'
                    ? val
                    : (val || '无').replace(regex, ''),
            };
        })
            .sort((prev, next) => order === 'asc'
            ? compare(prev['parsed'], next['parsed'], locale)
            : compare(next['parsed'], prev['parsed'], locale))
            .map((item) => {
            delete item['parsed'];
            return item;
        });
    }
    catch (e) {
        return source;
    }
}
exports.sort = sort;
