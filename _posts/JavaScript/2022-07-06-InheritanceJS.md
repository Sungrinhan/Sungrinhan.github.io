---
title: "[JS] 상속과 변수"
date: 2022-07-06 08:09:SS +/- TTTT
categories: [JavaScript, Class]
tags: [javascript, class, inheritance] # TAG는 반드시 소문자로 이루어져야함!
---

## 상속과 변수(멤버, 메서드)

### 변수의 상속

- 자식클래스는 부모 클래스 변수를 물려받아 사용할 수 있음
- `private`로 정의된 변수는 상속되긴 하지만 접근할 수 있는 권한이 없다.

```ts
class Employee {
  public name: string;
  employeeNo: number;
  private salary: number; // private 선언 변수는 선언된 클래스 내부에서만 사용
  protected deptNo: number;
}

class Manager extends Employee {
  // Employee 클래스의 모든 변수들은 상속됨.
  jobOfManage: string;
  boss: string;
  employeeNo: number; // 부모 클래스에도 동일한 프로퍼티가 있으나, 상속되지 않고 자식클래스에 있는 값을 사용
}
```

- 부모 클래스의 멤버 변수는 자동으로 자식 클래스에 상속되어 들어감
- 부모 클래스가 가진 변수와 같은 이름의 변수를 선언하면, 부모클래스의 변수는 상속되지 않음 -> 자식 클래스에서 정의한 변수가 사용됨
- **동일한 이름으로 자식 클래스에 정의된 변수는 상속에서 제외**

### super 예약어

> this 에약어
>
> - 생성된 객체 자신에 대한 참조를 의미
> - 멤버 변수와 메서드 매개변수의 이름이 같을 경우, 두 변수를 구분하기 위해 사용

> sueper 예약어
>
> - 부모 객체에 접근할 수 있는 참조변수로 사용

```ts

// WMS ProductMaster  클래스정의

// constructor 의 경우, 서버로 전송할 때 undefined 이거나 null 인 값은 제거하기 위해 설정한다. 이 과정에서, 부모클래스에 있는 변수들도 상속받는데, 같은 변수명이 있기 때문에 super 예약어를 사용하였다.
constructor(partial:  Partial<WmsProductMaster> = {}) {
super();
const  keys  =  Object.keys(partial);
for (const  k  of keys) {
if (!(partial[k] ===  null  || partial[k] ===  undefined)) this[k] = partial[k];
}
}
```

## 상속과 메서드

### 메서드의 상속

- 부모 클래스가 가지고 있는 메서드가 자식 클래스로 상속되어 자식클래스에서 사용가능

```ts
class Camera {
	name: string;
	sheets: number;

	public takePicture() :void {
		console.log(name + sheets);
		}
	}

class PolaroidCamera extends Camera {
	batteryGage:
	}
```

### 메서드의 Overriding

- 부모클래스의 메서드를 재사용하지 않고 새롭게 정의하여 사용
- 부모가 가진 메서드는 상속되지 않음
- - 메서드 Overriding : 메서드 재정의
- - 메서드 Overloading : 하나의 클래스에서 동일한 이름의 메서드를 여러 개 정의
- 자식 클래스에서 재정의된 메서드는 부모 클래스의 메서드와 메서드 이름, 매개변수의 유형과 개수가 동일해야 함

```ts
class Camera {
  name: string;
  sheets: number;

  public takePicture(): void {
    console.log(name + sheets);
  }
}

class PolaroidCamera extends Camera {
  batteryGage: number;
  public takePicture(): void {
    console.log(name + sheets);
    console.log(sheets);
    console.log(name);
  }
}
```

### 메서드의 Overloading

- 하나의 클래스에 동일한 이름의 메서드가 여러개 중복 정의되어 있는 것
- 메서드 매개변수의 개수나 타입이 달라야 함.

super 예약어가 사용된 메서드 Overriding

```ts
class Camera {
  name: string;
  sheets: number;

  public takePicture(): void {
    console.log(name + sheets);
  }
}

class PolaroidCamera extends Camera {
  batteryGage: number;
  public takePicture(): void {
    super.takePicture(); // 부모 클래스의 메서드를 super 예약어를 통해 호출
    console.log(sheets);
    console.log(name);
  }
}
```

## 참조

https://data-make.tistory.com/210
