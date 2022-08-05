---
title: "[TS] 타입스크립트 첫걸음 5편(연산자를 이용한 타입의 정의)"
date: 2022-08-05 11:55:SS +/- TTTT
categories: [TypeScript, Course]
tags: [course, typescript, uniontype, typeguard] # TAG는 반드시 소문자로 이루어져야함!
---

## [TS] 타입스크립트 첫걸음 5편(연산자를 이용한 타입의 정의)

### Union Type "I"

```ts
function logMessage(value: string) {
  console.log(value);
}

logMessage("hello");

logMessage(100);

function logMessage(value: string | number) {
  // 유니온 타입: 하나 이상의 타입을 쓸 때
  console.log(value);
}

logMessage("hello");
logMessage(100);

// 유니온 타입의 장점 (타입가드를 할 수 있다. 그리고 자동완성 기능 또한 해당 타입에 맞게 쓸 수 있다. 역시나 개발의 편의성을 위해서 인것 같다. 타입가드 또한 명료해진다.)
function logMessage(value: string | number) {
  if (typeof value === "number") {
    value.toLocaleString();
  }
  if (typeof value === "string") {
    value.toString();
  }
  throw new TypeError("value must be string or nunmber"); // 해당타입이 아닐경우? 에러메시지를 띄울 수 있다.
}

logMessage("hello");
logMessage(100);
```

### 유니온 타입의 특징

```ts
interface Developer {
  name: string;
  skill: string;
}

interface Person {
  name: string;
  age: number;
}

function askSomeone(someone: Developer | Person) {
  // union 을 써서, or 연산자기 때문에 모든 property 에 접근가능하다고 생각할 수 있다.
  someone.name;
  someone.skill; // 하지만 그것은 타입스크립트에서는 안전하지 않은 경우다. 따라서 공통된 부분인 name 만 사용이 가능하고 , 나머지는 타입가드를 해줘야 한다.
  someone.age;
}
```

### && 연산자(intersection)

```ts
var bowman: string & number & boolean; // bowman: never 라고 나온다.

function askSomeone(someone: Developer & Person) {
  // && 연산자를 사용하면 , developer 와 person 객체에서 모든부분이다. 모든 속성을 합친 타입이다.
  console.log(someone);
  someone.name;
  someone.skill;
  someone.age;
}

askSomeone({ name: "디벨로퍼", skill: "웹 개발" }); // age 도 필요하다.
askSomeone({ name: "캡틴", age: 100 }); // skill 도 필요하다.
```

- & 연산자를 쓰면 , 두 객체를 포함한 모든 정보를 담는다.
