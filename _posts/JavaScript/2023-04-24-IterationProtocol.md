---
title: "[JS] 이터레이션 프로토콜"
date: 2023-04-24 14:12:SS +/- TTTT
categories: [JavaScript]
tags: [javascript, iteration, iterable] # TAG는 반드시 소문자로 이루어져야함!
---

# 1. 이터레이션 프로토콜

ES6에서 도입된 이터레이션 프로토콜(iteration protocol) 은 데이터 컬렉션을 순회하기 위한 프로토콜(미리 약속된 규칙) 이다.

**이터레이션 프로토콜을 준수한 객체는 for...of 문으로 순회할 수 있고, Spread 문법의 피연산자가 될 수 있다.**

이터레이션 프로토콜에는 이터러블 프로토콜(iterable protocol) 과 이터레이터 프로토콜(iterator protocol) 이 있다.

![](https://poiemaweb.com/img/iteration-protocol.png)

배열은 Symbol.iterator 메소드를 소유한다. 따라서 배열은 이터러블 프로토콜을 준수한 이터러블이다.

## 왜 이터레이션 프로토콜을 사용할까?

왜 이러한 프로토콜이 필요한걸까 ? 앞으로 블로깅을 할 때 왜 사용하는지 부터 알아보려 한다. 이유를 알고 이해를 하면 머리에 더 잘 박히기 때문!

데이터 소비자(Data consumer) 인 for...of 문, spread 문법 등은 아래와 같이 다양한 데이터 소스를 사용한다.

> Array, String, Map, Set, TypedArray, DOM data structure, Arguments

위 데이터 소스는 모두 이터레이션 프로토콜을 준수하는 이터러블이다. 즉, 이터러블은 데이터 공급자(Data provider) 의 역할을 한다.

만약 이처럼 다양한 데이터 소스가 각자의 순회 방식을 갖는다면, 데이터 소비자는 다양한 데이터 소스의 순회 방식을 모두 지원해야 한다. 이는 효율적이지 않다. 하지만 다양한 데이터 소스가 이터레이션 프로토콜을 준수하도록 규정하면 데이터 소비자는 이터레이션 프로토콜만을 지원하도록 구현하면 된다.

즉, 이터레이션 프로토콜은 다양한 데이터 소스가 하나의 순회방식을 갖도록 규정하여 데이터 소비자가 효율적으로 다양한 데이터 소스를 사용할 수 있도록 **데이터 소비자와 데이터 소스를 연결하는 인터페이스의 역할!**

![](https://poiemaweb.com/img/iteration-protocol-interface.png)

## 1.1 이터러블 (iterable)

이터러블 프로토콜을 준수한 객체를 이터러블이라 한다. 이터러블은 Symbol.iterator 메소드를 구현하거나 프로토타입 체인에 의해 상속한 객체.

Symbol.iterator 메소드는 이터레이터를 반환함.

이터러블은 for...of 문에서 순회할 수 있으며, sperad 문법의 대상.

```ts
const array = [1, 2, 3];

//배열은 Symbol.iterator 메소드를 소유한다.
// 따라서 배열은 이터러블 프로토콜을 준수한 이터러블.
console.log(Symbol.iterator in array); //true
```

```ts
const obj = { a: 1, b: 2 };

//일반 객체는 Symbol.iterator 메소드를 소유하지 않는다.
// 따라서 일반 객체는 이터러블 프로토콜을 준수한 이터러블이 아니다.
console.log(Symbol.iterator in obj); // false

// TypeError: obj is not iterable
for (const p of obj) {
  console.log(p);
}
```

## 1.2 이터레이터 (iterator)

이터레이터 프로토콜은 next 메소드를 소유하며, next 메소드를 호출하면 이터러블을 순회하며 value, done 프로퍼티를 갖는 이터레이터 리절트 객체를 반환하는 것이다. 이 규약을 준수한 객체가 이터레이터다.

이터러블 프로토콜을 준수한 이터러블은 Symbol.iterator 메소드를 소유함. 이 메소드를 호출하면 이터레이터를 반환. 이터레이터 프로토콜을 준수한 이터레이터는 next 메소드를 갖는다.

```ts
// 배열은 이터러블 프로토콜을 준수한 이터러블
const array = [1, 2, 3]

// Symbol.iterator 메소드는 이터레이터를 반환.
const iterator = array[Symbol.iterator]();

이터레이터 프로토콜을 준수한 이터레이터는 next 메소드를 갖는다.
console.log('next in iterator); // true

// 이터레이터의 next 메소드를 호출하면, value, done 프로퍼티를 갖는 이터레이터 result 객체를 반환한다.
// next 메소드를 호출할 때 마다 이터러블을 순회하며 이터레이터 result 객체를 반환한다.
console.log(iterator.next()); // {value: 1, done: false}
console.log(iterator.next()); // {value: 2, done: false}
console.log(iterator.next()); // {value: 3, done: false}
console.log(iterator.next()); // {value: undefined, done: true}
```

# 2. for...of 문

내부적으로 이터레이터의 next 메소드를 호출하여 이터러블을 순회하며, next 메소드가 반환한 이터레이터 리절트 객체의 value 프로퍼티 값을 for...of 문의 변수에 할당한다. 그리고 이터레이터 리절트 객체의 done 프로퍼티 값이 false 이면 이터러블의 순회를 계속하고 true 이면 이터러블의 순회를 중단함.

내부적으로 동작하는 것을 for 문으로 표현하면 아래와 같다.

```ts
// 이터러블
const iterable = [1, 2, 3];

// 이터레이터
const iterator = iterable[Symbol.iterator]();

for (;;) {
  // 이터레이터의 next 메소드를 호출하여 이터러블을 순회한다.
  const res = iterator.next();

  // next 메소드가 반환하는 이터레이터 result 객체의 done 프로퍼티가 true가 될 때까지 반복
  if (res.done) break;

  console.log(res);
}
```

## 출처

https://poiemaweb.com/es6-iteration-for-of
