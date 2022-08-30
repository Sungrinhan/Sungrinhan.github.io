---
title: "[TS] 타입스크립트 첫걸음 7편(자바스크립트,프로토타입,타입스크립트)"
date: 2022-08-05 11:55:SS +/- TTTT
categories: [TypeScript, Course]
tags: [course, typescript, prototype, inheritance] # TAG는 반드시 소문자로 이루어져야함!
---

## Inheritance and the prototype chain

```ts
class Person {
  // 클래스 로직 (인스턴스를 만들어줌)
  constructor(name, age) {
    // 초기화 함수
    console.log("생성 되었습니다.");
    this.name = name;
    this.age = age;
  }
}

let sungrin = new Person("성린", 31); // '생성 되었습니다.'
console.log(sungrin);

// 자바스크립트는 프로토타입 기반의 언어이다.
var user = { name: "capt", age: 100 }; // 사용자의 정보를 담은 객체
var admin = { name: "capt", age: 100, role: "admin" }; // 지금과 같이 비슷한 형태의 객체를 만들어 나갈때, 코드중복을 줄일 수 있다.

let admin = {};

admin.__proto__ = user; // 크롬 개발자도구 콘솔에서 위와 같은 명령어를 입력하면, admin.name 과 admin.age 를 내려받아서 사용할 수 있다.(상속)

admin.role = "admin";

console.log(admin); // {role: admin} 으로 보이지만, 콘솔창에서 __proto__ 를 클릭하면 부모객체인 user 의 값을 확인할 수 있다. -> name 값과 age 확인가능.
```

### 활용 사례

```ts
function Person(name, age) {
  this.name = name;
  this.age = age;
}

var capt = new Person("캡틴", 100); // 생성자 new 함수
```

위의 코드는 class 형이 나오기 전에, 함수로도 클래스와 같은 기능을 할 수 있다.
아래와 같이 class 로 변형 해보자.

```ts
class Person {
  constructor(name, age) {
    console.log("생성 되었습니다");
    this.name = name;
    this.age = age;
  }
}
```

### 타입스크립트에서 class 문법

```ts
class Person {
  private name: string;
  public age: number; // constructor 안에 있는 타입을 지정해줘야함.
  readonly log: string;

  constructor(name: string, age: number) {
    // 안에 들어오는 인자의 타입도 지정해줄 수 있다.
    this.name = name;
    this.age = age;
  }
}
```

- 클래스 컴포넌트, 클래스 함수의 경우는 현재 리액트에서 사라지고 있는 추세다. 왜? 함수형으로 모두 바뀌는중이라고 하는데, 왜그럴까?
