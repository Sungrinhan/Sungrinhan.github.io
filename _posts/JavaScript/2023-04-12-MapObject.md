---
title: "[JS] Map Object"
date: 2023-04-12 18:15:SS +/- TTTT
categories: [JavaScript]
tags: [javascript, mapobject] # TAG는 반드시 소문자로 이루어져야함!
---

# `Map`이란 ?

- Map 객체는 키-값 쌍과 키의 원래 삽입 순서를 기억한다.
- 모든 값(객체 및 원시값 모두)은 키 또는 값으로 사용될 수 있다.

## 설명

- 한 Map 에서의 키는 오직 단 하나만 존재한다. 이는 `Map` 집합의 **유일성**이다.
- `for ... of` 루프는 각 반복에 대해 `[key, value]` 로 이루어진 멤버가 2개인 배열을 반환한다.
- 반복은 삽입한 순서대로 발생한다.
  > 순서대로..? 일반적인 객체는 순서를 상관하지 않는다. 하지만 자바스크립트의 배열은 iterable 하다고 한다. Map 객체는 그럼 iterable 한 성격을 띄는 것일까? 궁금해져서 찾아봤는데, 밑에서 더 알아보자.

## 키 동일성

- 값 동일성은 SameValueZero 을 기반으로 한다. (0 과 -0 을 다르게 취급)
- NaN 과 NaN 은 다름에도 불구하고 ( `(NaN !== NaN) === true` ) Map 에서의 키는 동일하게 간주된다.
- 다른 모든 값은 `===` 연산자에 의미론에 따라 동일하게 간주된다.

## 객체 vs 맵

Object 와 Map 은 매우 유사한 것 같다. 값을 가리키는 키(key)를 설정, 해당 값(value)을 받아오며, 키를 삭제하고, 키에 무언가가 저장되었는지 여부를 알 수 있다. (대안으로 사용할 수 있는 내장 객체가 없었기 때문에) Object 는 역사적으로 Map 으로 사용되어 왔다.

그러나 경우에 따라서 `Map` 이 선호되는 중요한 차이점이 있다.

|                           | Map                                                                  | Object                                                                                                                                 |
| ------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 우발적 키                 | Map에는 기본적으로 키가 포함되지 않음. 명시적으로 입력된 내용만 표기 | Object 는 프로토타입이 있으므로 자신의 키와 충돌할 수 있는 기본 키가 포함되어있음                                                      |
| 보안                      | 사용자가 제공하는 키와 값에 대해서 안전하게 사용할 수 있음           | 공격자가 객체의 프로토타입을 재정의하여 객체주입공격을 발생시킬 수 있음. `null` 프로토타입 객체를 사용하여 이 문제를 해결할 수 있음    |
| 키 유형                   | 모든값(함수, 객체, 원시값)                                           | Object의 키는 String 또는 Symbol 이여야 함                                                                                             |
| 키 순서                   | 항목을 삽입한 수서대로 항목, 키 및 값을 반복                         | 일반적인 Object의 키는 정렬되어있지만 , 항상 그렇지는 않고 순서가 복잡. 결과적으로 속성 순서에 의존하지 않는것이 가장 좋음.            |
| 크기                      | size 로 가져올 수 있음                                               | 아이템의 수는 수동으로 결정?                                                                                                           |
| 순회                      | Map은 순회가능(iterable) 하기 때문에 직접 반복가능!                  | Object는 iteration protocol 을 구현하지 않기 때문에 Object 자체로는 for ... of 문을 사용해서 직접 반복 불가                            |
| 성능                      | 빈번한 추가 및 제거 상황에서 좀 더 좋음                              | 추가 및 제거에 최적화되지 않음                                                                                                         |
| Serialization and Parsing | 직렬화 또는 구문 분석에 대한 기본지원 x                              | `JSON.stringify()` 을 사용하여 Object 를 JSON 으로 직렬화 지원.`JSON.parse()` 를 사용하여 JSON 에서 Object 로의 구문 분석을 기본 지원. |

## Map 객체에 키, 값 넣기

Object 와는 다르게 메소드로 추가,삭제, 초기화 하는 방법이 올바른 방법이다.

- `set(key, value)` : 키-값 추가
- `has(key)` : 해당 키값이 있는지 찾는다. 있으면 true, 없으면 false
- `get(key)` : 해당 키의 값을 불러온다. 있으면 값을, 없으면 false
- `delete(key)` : 해당 키와 값을 삭제한다. 삭제가 되면 true, 해당 키가 없으면 false
- `clear()` : 객체를 초기화 한다. 값이 없어짐!
- `size()` : Object.keys().length 와 비슷하다. 키-값 쌍의 숫자를 반환.
- `keys()` : 객체에 삽입된 순서에 따라 각 요소의 키를 포함하는 새로운 반복자( 배열..?)을 반환
- `values()` : 객체에 삽입된 순서에 따라 각 요소의 값을 포함하는 새로운 반복자 반환
- `entries()` : 삽입된 순서에 따라 [key, value] 두 개의 멤버 배열을 포함하는 새로운 반복자 반환

## 배열 객체와의 관계

```ts
const myArray = [['FirstName', "Sunglin"], ['LastName', 'Han']]

// 키-값으로 된 2차원 배열을 Map constructor 에 넣으면 Map 객체가 된다.
const myMap = new Map(myArray);
console.log(myMap.get('FirstName'); // "SungLin"

// Array.from() 을 사용하면 Map 객체를 2차원 키값 배열로 만들 수 있다.
console.log(Array.from(myMap)) // myArray 와 같다.  [['FirstName', "Sunglin"], ['LastName', 'Han']]

// spread 연산자를 통해 똑같이 구현 가능
console.log([...myMap])
```

# Map 객체에 대한 나의 생각

아니 뭐야... 이렇게 보니까 완전 객체랑 비슷한데..? 라고 생각했다.
Object.keys() , Object.values(), Object.entries() 와 같이, Object 의 메소드와 비슷하다..

그러면 왜 일반 객체를 안쓰고, Map 객체를 쓰는걸까.
이론상으로 일반객체와 다른점은 ...?

1. 순서가 있다. iterable하다. for... of 구문이 사용가능(Object 는 불가)
   - for ...of 반복문은 ES6 문법이다. 컬렉션 객체가 [Symbol.iterator] 속성을 갖고 있어야함!
   - 일반 객체에서는 for ... in 구문을 사용한다. key 값에는 접근가능하나, value는 없다.
2. 메소드가 다르다. 삽입 삭제 초기화 등 일반 Object 와는 다름. 성능 상 일반객체보다 좋다.
3. 넣을 수 있는 키값이 다르다.

## 객체의 프로퍼티를 자주 변경해야 할 때

- 메소드 이름들이 예측 가능하여 동작이 명확하다.
- 기존 객체와 달리 순회도 쉽게 이루어진다. for...of. 보통
- 모든 상황에 쓸필요는 없고, 자주 변경하지 않는 정보들은 객체에 저장해도 무방할 것

## 아직은 잘 모르겠다. chat gpt 에 물어보았다.

question: When do we use Map object in production? give me an example we need to use Map Object.

그냥 일반적인 내용이다.
캐싱, 데이타 프로세싱, 설정 관리, 번역에서 쓰인다는 내용...

1.  Caching: Map objects can be used as a cache to store frequently accessed data. This can help reduce the amount of time it takes to retrieve the data from a database or other source.
2.  Data processing: Map objects can be used to store data in a format that is easy to process. For example, if you have a large dataset with multiple attributes, you can store the data as a map where the keys represent the attribute names and the values represent the attribute values.
3.  Configuration management: Map objects can be used to store configuration data for an application. For example, you could store key-value pairs that represent the settings for the application, such as database connection settings or user preferences.
4.  Language translation: Map objects can be used to store translations of words or phrases in different languages. Each key in the map represents a word or phrase in a source language, and the value associated with that key represents the translation in the target language.

## 업데이트

- (2023.04.13) 알고리즘으로 구현해야 하는 경우 매우 편하다. hash 객체로 만들 때 써보니 매우매우 편리. 시간복잡도도 매우 줄어든다

## 출처

[JavaScript 표준 내장 객체 Map(MDN)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Map)

[Map.prototype[@@iterator]](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/@@iterator)
