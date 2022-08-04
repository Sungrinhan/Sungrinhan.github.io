---
title: "[TS] 타입스크립트 첫걸음 2편(기본 타입에 대해 알아보자)"
date: 2022-08-04 15:31:SS +/- TTTT
categories: [TypeScript, Course]
tags: [course, typescript, basictypes] # TAG는 반드시 소문자로 이루어져야함!
---

# 타입스크립트 첫걸음 2편

## 기본타입에 대해 알아보자.

```ts
// JS 문자열 선언

//var str = 'hello'

//TS 문자열 선언
const str: string = "hello";

//ts 숫자
let num: number = 10;

//ts 배열
let arr: Array<number> = [1, 2, 3];
let heroes: Array<string> = ["Capt", "thor", "hulk", 10]; // 10은 에러가 난다.
let items: number[] = [1, 2, 3];

// TS 튜플

let address: string[] = ["gangnam", "pangyo"];

let newadress: [string, number] = ["gangnam", 100]; // 튜플은 배열의 각각 인덱스에 타입이 정의된다.

// ts 객체
let obj: object = {};

// let person: object = {
// name: "capt",
// age: 100,
// };

let person: { name: string; age: number } = {
  name: "human",
  age: 40,
};

// ts 진위값
let show: boolean = true;
```

## 함수의 타입선언

### 함수의 타입을 정의하는 최종 방식

```ts
// parameter 에 타입을 정의할 수 있다.
function sum(a: number, b: number) {
  return a + b;
}
sum(10, 20);

// 함수의 반환 값에 타입을 정의하는 방식
function add(): number {
  return 10;
}

// 함수에 타입을 정의하는 방식(최종)
function sum(a: number, b: number): number {
  return a + b;
}
```

### 파라미터 개수를 제한하는 타입스크립트 성질

```ts
// 타입스크립트에서는 파라미터의 개수가 다르면 오류가 난다. 파라미터의 개수를 제한하는 타입스크립트의 성질.

sum(10,20) // 30
sum(10, 20, 30, 40) ; // 오류
-> 자바스크립트의 경우는 그것의 유연한 성질 때문에 오류가 나지않는다.
```

### 함수의 Optional Parameter

```ts
//함수의 옵셔널 파라미터
function log(a: string, b?: string) {
  // 옵셔널 파라미터의 경우 question mark 를 붙여서 필수값이 안되게 할 수 있다.
}

log("hello world"); // 필요에 따라 파라미터를 한개만 넣을 수 있다.
log("hello ts", "abc");
```

## 인터페이스

인터페이스는 명세같은 것이다. 어떠한 로직의 변경이나, 함수처럼 작동하지는 않지만 미리 지정해둔 타입이 입력되지 않고 휴먼에러나 제이슨 같이 의도하지 않은 타입이 입력될 경우는 에러를 발생시킨다.

```ts
interface User {
  age: number;
  name: string;
}
```

### 변수에 활용한 인터페이스

```ts
let seho: User = {
  // 반복되는 타입에 대해서 코드를 줄여준다.
  age: 31,
  name: "성린",
};
```

### 함수에 인터페이스 활용

```ts
// 함수에 인터페이스 활용
const getUser = (user: User) => {
  console.log(user);
};

const capt = {
  name: "캡틴",
};

const capt2 = {
  name: "캡틴",
  age: 25,
};

getUser(capt); // user 의 객체 형태가 맞지않아 에러가 나게 된다.
getUser(capt2); // 타입이 맞기 때문에 에러가 나지 않는다.
```

### 함수 스펙에 인터페이스 활용

실무에서는 앞으로 사용할 함수를 미리 정의해놓고 필요하면 가져와서 쓸수 있게끔 만든것.

```ts
// 함수의 스펙에 인터페이스를 활용
interface SumFunction {
  (a: number, b: number): number; // 인자의 타입과 결과값의 타입을 미리 지정해 둘 수 있다.
}

let sum: SumFunction;
sum = function (a: number, b: number): number {
  return a + b;
};
```
