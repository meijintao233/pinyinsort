// 用于文件夹和文件名排序 特殊 > 数字 > 中文 > 英文
import emojiRegex from 'emoji-regex';
import pinyin from 'tiny-pinyin';

const EnglishReg = /^[a-zA-Z]/;
const ChineseReg = /^[\u4e00-\u9fff]/;
const NumberReg = /^\d+$/;

function tryGetNumber(str: string) {
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
  } else {
    return { target: str[0], index: 1 };
  }
}

enum Priority {
  SPECIAL_CHAR = 0,
  NUMBER_CHAR = 1,
  CHINESE_CHAR = 2,
  ENGLISH_CHAR = 3,
}

function getPriority(val: number | string) {
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

function getTargetStr(prev: string, next: string) {
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

function tryTransformDecimal(prev: string, next: string) {
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

  // 相同时，数字多的排在后面
  const prevLen = prev.split('.').length;
  const nextLen = next.split('.').length;
  return [prevLen, nextLen];
}

function compare(
  prevVal?: string | number,
  nextVal?: string | number,
  locale = 'en-US'
): number {
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
  } else {
    if (prev !== next) {
      switch (prevPriority) {
        case Priority.NUMBER_CHAR: {
          const [prevNumber, nextNumber] = tryTransformDecimal(
            String(prev),
            String(next)
          );

          // 相同看多一位
          if (prevNumber === nextNumber) {
            return compare(
              String(prevVal).substring(aNumber.index),
              String(nextVal).substring(bNumber.index)
            );
          }

          return prevNumber - nextNumber;
        }
        case Priority.CHINESE_CHAR: {
          if (pinyin.isSupported()) {
            const prevChar = pinyin.convertToPinyin(prev as string);
            const nextChar = pinyin.convertToPinyin(next as string);

            const cmp = prevChar.localeCompare(nextChar, locale);

            // 相同看多一位
            if (cmp === 0) {
              return compare(
                String(prevVal).substring(aNumber.index),
                String(nextVal).substring(bNumber.index)
              );
            }

            return cmp;
          } else {
            return String(prev).localeCompare(String(next), locale);
          }
        }
        case Priority.ENGLISH_CHAR:
        case Priority.SPECIAL_CHAR: {
          return String(prev).localeCompare(String(next), locale);
        }
      }
    } else {
      return compare(
        String(prevVal).substring(aNumber.index),
        String(nextVal).substring(bNumber.index)
      );
    }
  }
}

const regex = emojiRegex();
export function sort<
  Key extends string | number,
  T extends { [key in Key]?: string | number }
>(source: T[], property: Key, order: 'asc' | 'desc' = 'asc', locale = 'en-US') {
  try {
    return source
      .map((item) => {
        const val = item[property];
        return {
          ...item,
          parsed:
            typeof val === 'number'
              ? val
              : ((val as string) || '无').replace(regex, ''),
        };
      })
      .sort((prev, next) =>
        order === 'asc'
          ? compare(prev['parsed'], next['parsed'], locale)
          : compare(next['parsed'], prev['parsed'], locale)
      )
      .map((item) => {
        delete item['parsed'];
        return item;
      }) as T[];
  } catch (e) {
    return source;
  }
}
