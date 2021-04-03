import { shuffle } from 'lodash';

import { sort } from '../src';

describe('sort', () => {
  it('sort by name with version', () => {
    const expectResult = [
      { name: '0' },
      { name: '1' },
      { name: '1' },
      { name: '2' },
      { name: '2.1' },
      { name: '2.3' },
      { name: '3.0.1' },
      { name: '12' },
      { name: '12.1.1' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name', 'asc')).toStrictEqual(expectResult);
  });

  it('sort by name with version 1', () => {
    const expectResult = [
      { name: '2-0' },
      { name: '2-1' },
      { name: '2-3' },
      { name: '3.0.1' },
      { name: '12' },
      { name: '12.1.1' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name', 'asc')).toStrictEqual(expectResult);
  });

  it('sort by name with string number', () => {
    const expectResult = [
      { name: '1' },
      { name: '2' },
      { name: '12' },
      { name: '123' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name', 'asc')).toStrictEqual(expectResult);
  });

  it('sort by name with word case0', () => {
    const expectResult = [
      { name: '1-211' },
      { name: '1211' },
      { name: '哇哈哈' },
      { name: '西瓜' },
      { name: '张阿爸' },
      { name: 'W' },
      { name: 'XIgua' },
      { name: 'ZHANGaba' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name', 'asc')).toStrictEqual(expectResult);
  });

  it('sort by name with word case1', () => {
    const expectResult = [
      { name: '1.0.4' },
      { name: '2.0.4' },
      { name: '13.10.1' },
      { name: '哇aaaa哈哈' },
      { name: '西bbb阿爸' },
      { name: '西bbbb瓜' },
      { name: 'a1231a' },
      { name: 'a1231b' },
      { name: 'X1231a' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name', 'asc')).toStrictEqual(expectResult);
  });

  it('sort by name with word case2', () => {
    const expectResult = [
      { name: '@&TH&%^#' },
      { name: '2.0.4' },
      { name: '13.dasSfsa10.1' },
      { name: '👩21231a' },
      { name: '哇aaaa哈哈' },
      { name: '西bbb阿爸' },
      { name: '西bbbb瓜' },
      { name: 'a1231a' },
      { name: 'dasdsa1.0.4' },
      { name: 'X1231a' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name', 'asc')).toStrictEqual(expectResult);
  });

  it('sort by name with word case3', () => {
    const expectResult = [
      { name: '1.1' },
      { name: '1.2' },
      { name: '1.3' },
      { name: '1.4' },
      { name: '1.5' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name')).toStrictEqual(expectResult);
  });

  it('sort by name with word case4', () => {
    const expectResult = [
      { name: '1-1 was' },
      { name: '1-2 dasdasda' },
      { name: '1-3dasdasd' },
      { name: '1-4czzxc' },
      { name: '👩1-5👩👩' },
      { name: '1-54214124' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name')).toStrictEqual(expectResult);
  });

  it('sort by name with word case5', () => {
    const expectResult = [
      { name: '1-1' },
      { name: '1-2' },
      { name: '1-3' },
      { name: '1-4' },
      { name: '👩1-5' },
      { name: '2-1' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name')).toStrictEqual(expectResult);
  });

  it('sort by name with word desc', () => {
    const expectResult = [
      { name: '2-1' },
      { name: '👩1-5' },
      { name: '1-4' },
      { name: '1-3' },
      { name: '1-2' },
      { name: '1-1' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name', 'desc')).toStrictEqual(expectResult);
  });

  it('sort by name with word case6', () => {
    const expectResult = [
      { name: '1.asdas3' },
      { name: '1.1' },
      { name: '1.2.6124' },
      { name: '1233121.4' },
      { name: '阿迪说的撒.5' },
      { name: 'fasfas多少啊1.5' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name')).toStrictEqual(expectResult);
  });

  it('sort by name with number', () => {
    const expectResult = [
      { name: '1.asdas3' },
      { name: '1.1' },
      { name: '1.2.61 24' },
      { name: '1233121' },
      { name: '1233121.4' },
      { name: '阿迪说的撒.5' },
      { name: 'fasfas多少啊1.5' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name')).toStrictEqual(expectResult);
  });

  it('sort by name with number & word', () => {
    const expectResult = [
      { name: '1阿三大叔大叔' },
      { name: '1.1大叔大叔' },
      { name: '1.2.6124发发发' },
      { name: '1.3多少啊' },
      { name: '阿迪说的撒.5' },
      { name: 'fasfas多少啊1.5' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name')).toStrictEqual(expectResult);
  });

  it('sort by name with number & word', () => {
    const expectResult = [
      { name: '1 阿三大叔大叔' },
      { name: '1.1大叔大叔' },
      { name: '1.2.6124发发发' },
      { name: '1.3多少啊' },
      { name: '阿迪说的撒.5' },
      { name: 'fasfas多少啊1.5' },
    ];
    const arr = shuffle(expectResult);

    expect(sort(arr, 'name')).toStrictEqual(expectResult);
  });

  it('sort by name with number', () => {
    const expectResult = [
      { name: '标题' },
      { name: '标题（1）' },
      { name: '标题（2）' },
      { name: '标题（3）' },
      { name: '标题（4）' },
      { name: '标题（5）' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name')).toStrictEqual(expectResult);
  });

  it('sort by name with version 99', () => {
    const expectResult = [
      { name: '啊啊啊啊啊啊啊啊' },
      { name: '📚备课大纲' },
      { name: '📖被讨厌的勇气' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name', 'asc')).toStrictEqual(expectResult);
  });

  it('sort by name with version 100', () => {
    const expectResult = [
      { name: '0.1测试' },
      { name: '0.8测试' },
      { name: '1测试' },
      { name: '1.0测试' },
      { name: '1.0.0测试' },
      { name: '1.01测试' },
      { name: '1.08测试' },
      { name: '1.1测试' },
      { name: '1.17测试' },
      { name: '1.2测试' },
      { name: '2.3测试' },
      { name: '3.11测试' },
      { name: '12测试' },
      { name: '12.88测试' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name', 'asc')).toStrictEqual(expectResult);
  });

  it('sort by name with version 101', () => {
    const expectResult = [
      { name: '0.1ah' },
      { name: '0.8zh' },
      { name: '1.6测试' },
      { name: '2 ' },
      { name: '2.1测试' },
      { name: '2.3ah' },
      { name: '3.0.1' },
      { name: '12😁' },
      { name: '19' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name', 'asc')).toStrictEqual(expectResult);
  });

  it('sort by name with version 102', () => {
    const expectResult = [
      { name: '0.1ah' },
      { name: '1zfsda' },
      { name: '1.4cdf' },
      { name: '2csdl' },
      { name: '2.1rewq' },
      { name: '2.3csa' },
      { name: '3.0.1csdac' },
      { name: '12za' },
      { name: '12.1.1csdaf' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name', 'asc')).toStrictEqual(expectResult);
  });

  it('sort by name with version 103', () => {
    const expectResult = [
      { name: '0.01测试' },
      { name: '1.00测试' },
      { name: '1.432测试' },
      { name: '2测试' },
      { name: '2.1测试' },
      { name: '2.343测试' },
      { name: '3.0.1测试' },
      { name: '12测试' },
      { name: '12.1.1测试' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name', 'asc')).toStrictEqual(expectResult);
  });

  it('sort by name with version 104', () => {
    const expectResult = [
      { name: '1900.12.9测试' },
      { name: '2020.02.17测试' },
      { name: '2020.10测试' },
      { name: '2020.10.1测试' },
      { name: '2020.12.12测试' },
      { name: '2020.12.29测试' },
      { name: '2020.2.17测试' },
      { name: '2020.2.28测试' },
      { name: '2021.01.10测试' },
      { name: '2021.1.10ah' },
    ];

    const arr = shuffle(expectResult);

    expect(sort(arr, 'name', 'asc')).toStrictEqual(expectResult);
  });
});
