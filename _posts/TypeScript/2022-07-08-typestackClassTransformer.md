---
title: "[TS] Class Transformer"
date: 2022-07-08 17:44:SS +/- TTTT
categories: [TypeScript, ClassTransformer]
tags: [classtransformer, typescript] # TAG는 반드시 소문자로 이루어져야함!
---

# typestack 의 class-transformer

## 왜 class-transformer 를 공부하게 되었나?

rtk query 를 사용하면서 였다. 기본적으로 api 를 쿼리로 제어할 때 , req arg 와 res arg 의 타입을 미리 지정해놓고 사용 했었다. 그런데 이번에 wms 를 개발하게 되면서, url path 에 넣을 프로퍼티를 req arg 에 넣으면, 나중에 빼기가 어렵다는 것이다. 이전에는 req props 에 타입을 지정해두고, 나중에 body 에 실어보내기 전에 객체 삭제 메소드인 delete 를 해서 없앴다.

이사님은 나에게 class-transformer 를 알려주셨고, 타입스크립트 답게 코드를 아름답게 짜기 위해 공부를 시작했다.

## What is class-transformer

자바스크립트에는 두가지 종류의 객체가 있다.

- plain (literal) objects
- class (constructor) objects

일반 객체는 `Object` 클래스의 인스턴스인 객체다. 때로는 표기법을 통해 생성될 때 리터럴 객체 라고 한다. `{}` 클래스 개체는 자체 정의된 생성자, 속성 및 메서드가 있는 클래스의 인스턴스 이다. 일반적으로 `class` 표기법을 통해 정의합니다.

무엇이 문제일까...?

때로는 **일반 자바스크립트 객체**를 가지고 있는 **ES6 클래스로 변환**하고 싶을 때가 있다.
예를 들어 백엔드, 일부 API 또는 json 파일에서 json 을 로드하고 그 후에 `JSON.parse` 는 클래스의 인스턴스가 아닌 일반 자바스크립트 객체를 갖게 된다.

`user.json ` 예를 들어 로드중인 사용자 목록이 있다.

```ts
[
  {
    id: 1,
    firstName: "Johny",
    lastName: "Cage",
    age: 27,
  },
  {
    id: 2,
    firstName: "Ismoil",
    lastName: "Somoni",
    age: 50,
  },
  {
    id: 3,
    firstName: "Luke",
    lastName: "Dacascos",
    age: 12,
  },
];
```

그리고 `User ` class 가 있다.

```ts
export class User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;

  getName() {
    return this.firstName + " " + this.lastName;
  }

  isAdult() {
    return this.age > 36 && this.age < 60;
  }
}
```

`user.json` 파일에서 `User` 타입의 유저들을 다운로드 받는다고 가정하고, 다음과 같은 코드를 작성하길 원한다.

```ts
fetch("user.json").then((users: User[]) => {
  // you can use users here, and type hinting also will be available to you
  // but users are not actually instances of User class
  // this means that you can't use methods of User class
});
```

이 코드에서 `user[0].id`, `users[0].firstName`, `users[0].lastName` 은 사용할 수 있다.
하지만 `users[0].getName()` 이나 `users[0].isAdult()` 는 사용할 수 없는데, "유저들"은 사실 plain javascript object 의 배열형태이고 User object 의 인스턴스가 아니기 때문이다.
나는 사실 컴파일러를 속인건데, `users: User[]` 라고 했기 때문이다.

어떻게 해결해야 할까?
어떻게 `users` 배열을 plain javascript objects 에서 `User` 객체들의 인스턴스로 만들 수 있을까?
새로운 instance 를 만들고 수동으로 모든 프로퍼티를 새로운 오브젝트로 카피하면 될까? 객체 복잡도가 높을수록 매우 잘못될 확률이 높다.

이때 필요한 것이 class-transformer 이다 .**플레인 자바스크립트 객체를 -> 갖고있는 클래스의 인스턴스로 바꿔준다.**

예를 들어보자

```ts
fetch("user.json").then((users: Object[]) => {
  const realUsers = plainToClass(User, users);
  // now each user in realUsers is an instace of User class
});
```

이제는 `users[0].getName()` `users[0].isAdult()` 메소드를 사용할 수 있다.

## Methods

### plainToClass

이 메소드는 플레인 자바스크립트 객체를 특정 클래스의 인스턴스로 만들어준다.

```ts
import { plainToClass } from "class-transformer";
let users = plainToClass(User, userJson); //
```

### serialize

너의 모델을 json 으로 바로 serialize 할수 있다.

```ts
import { serialize } from "class-transformer";
let photo = serialize(photo);
```

`serialize` 는 배열과 배열이 아닌것들에도 작동한다.

## Enforcing type-safe instance

`plainToClass` 메소드는 클래스에는 정의되어 있지 않는 프로퍼티라도, 플레인오브젝트에 있는 모든 프로퍼티를 set 한다.

```ts
import { plainToClass } from "class-transformer";

class User {
  id: number;
  firstName: string;
  lastName: string;
}

const fromPlainUser = {
  unknownProp: "hello there",
  firstName: "Sunglin",
  lastName: "Han",
};

console.log(plainToClass(User, fromPlainUser));

// User {
//	unknownProp: 'hello there',
//	firstName: 'Sunglin',
//	lastName: 'Han'
// }
```

만약 이것이 너가 의도하지 않은 것이라면 , `excludeExtraneousValus` 옵션을 넣어서 해결할 수 있다.

```ts
import { Expose, plainToClass } from 'class-transformer';

class User {
	@Expose() id: number;
	@Expose() firstName: string;
	@Expose() lastName: string;
}

const fromPlainUser = {
	unknownProp: 'hello there'
	firstName: 'Sunglin',
	lastName: 'Han'
};

console.log(plainToClass(User, fromPlainUser, {excludeExtraneousValues: true }));

// User {
//	id: undefined,
//	firstName: 'Sunglin',
//	lastName: 'Han'
}
```

## Working with nested objects

복잡도가 높은 객체를 변형하려면, 어떤타입의 객체로 변형할건지를 아는 것이 요구된다. 타입스크립트가 좋은 reflection abilities 를 갖고 있지 않기 때문에, 각 프로퍼티가 어떤 타입의 객체인지를 상세히해주는 것이 좋다. `@Type` 데코레이터가 이를 해결해준다.

우리가 사진으로 이루어진 앨범을 갖고있고, 앨범을 플레인 객체에서 클래스 객체로 변형하려고 한다면:

```ts
import { Type, plainToClass } from "class-transformer";

export class Album {
  id: number;
  name: string;
  @Type(() => Photo)
  photos: Photo[];
}

export class Photo {
  id: number;
  filename: string;
}

let album = plainToClass(Album, albumJson);

// now album is Album object with Photo objects inside
```

## Skipping specific properties

가끔 변형도중 어떤 프로퍼티들을 스킵하고 싶을 때 `@Exclude` 데코레이터를 사용하면 된다:

```ts
import { Exclude } from 'class-transformer';

export class User {
	id: number;
	email: string;
	@Exclude()
	password: string;
```

이렇게 하면 `password` 프로퍼티는 변형과정에서 스킵되어 result 에서는 없어진다.

## 참조

[깃헙 typestack class-transformer](https://github.com/typestack/class-transformer#what-is-class-transformer)
