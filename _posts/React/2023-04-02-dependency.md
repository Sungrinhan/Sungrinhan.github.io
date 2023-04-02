---
title: "[React] 의존성 역전원칙, 의존성 주입"
date: 2023-04-02 20:01:SS +/- TTTT
categories: [React]
tags: [react, dip, dependency] # TAG는 반드시 소문자로 이루어져야함!
---

# 의존성

## 목차

1. 의존성 역전 원칙
2. 의존성 주입

## 1. 의존성 역전 원칙(DIP) - 객체지향 패러다임

의존성이란?

- 특정한 모듈이 동작하기 위해서 다른 모듈을 필요로 하는 것을 의미

의존성 역전 원칙이란..?

- 유연성이 극대화된 시스템을 만들기 위한 원칙
- 소스 코드 의존성이 **추상에 의존**하며 **구체에는 의존하지 않는** 것을 의미

> 추상이란?
>
> - 구체적인 구현 방법이 포함되어 있지 않은 형태를 의미
> - 내부가 어떻게 구현되어있는지 신경쓰지 않고 그냥 내가 "해줘야 하는 일" 과 "결과"만 신셩쓸 수 있게 됨

간단하게 예를 들어보자면...

```ts
const getToDo = () => {
  // ...something happens here
  // ...something logic happens
};
```

위의 함수는 ToDo 를 get 하는 함수라는 것을 알 수 있다. 이 안에서의 로직은 신경쓰지 않고, getToDo 라는 함수를 사용하면 그 "결과" 만 알게 되는 것. 로직은 모르지만 무엇을 하는 함수인지를 추상적으로 바로 알 수 있다. 또한 모듈화를 하게되면 유지보수에도 좋다는 점이 있다. (getToDo 안의 로직만 변경하면 이 모듈이 적용되는 모든 곳에서도 변경이 되기 때문)

> 구체 란 ?
>
> - 반대로 실질적으로 해당 동작을 하기 위해서 수행해야 하는 구체적인 일련의 동작과 흐름.
> - 구체적인 동작들은 굉장히 빈번하게 변경될 여지가 많다.
> - 애플리케이션이 이러한 구체에 점점 의존하게 된다면? 구체가 변할 때 마다 내 애플리케이션에도 그에 맞춰서 변화해야 한다는 의미.

### 내가 느낀 의존성 역전 원칙..

모듈화 하는것도 의존성 역전 원칙이 아닌가 싶다. 재사용성, 유지보수 모두 유리한 점이 있다.

변화가 자주 발생하는 구체에 의존하는 것은 애플리케이션 구조 상 기피해야 할 항목이다.

하지만 일반적으로 코드를 작성하다 보면 , 위와 같이 구체에 의존하는 경우가 자주 발생한다.

```ts
fetch("todos", {
	headers: {
		Authorization: localStorage.getItem("ACCESS_TOKEN");
		}
	}
```

위 코드는 두가지 문제가 있다.

1. localStorage 라는 구체적인 사항에 의존. 이는 storage를 추후에 다른 저장소로 변경하기 힘들다는 것을 의미.
2. localStorage 는 브라우저에서 제공하는 API. 브라우저는 우리가 개발한 애플리케이션이 아닌 외부 요소다. 외부 요소는 변화가 발생할 수 있으며, 가장 큰 문제는 어떤식으로 변화할 지 우리가 컨트롤 할 수 없다는 점.

구체적인 요소를 안 쓸수는 없다. 브라우저에서 제공하는 기능을 이용해야 한다는 사실을 배제할 순 없으니까.

-> 외부 요소에 직접적으로 의존하는 코드를 최소화 하고, 전체적인 제어권을 애플리케이션 안으로 가져오는 방법을 알아보자.

### 제어권을 애플리케이션 안으로 가져오는 방법

추상적으로 먼저 생각해 보자.

1. Storage 를 이용하는 이유: Token 을 관리하기 위해서다.
2. Token을 관리하기 위해서 일반적으로 진행하는 작업은 크게 3가지
   a. 저장
   b. 삭제
   c. 토큰 가져오기

```ts
/*
	ToeknRepositoryInterface

		save(token: string) : void
		get(): string
		delete(): void
*/
```

위의 interface 는 앞으로 Token 을 사용할때는 save, get, delete 라는 세가지 메서드를 통해서 소통하자 라고 정의한 것.

interface 의 가장 큰 특징은 추상적 이란 것이다.
interface 를 사용하는 입장에선 interface 에서 정한 약속이 잘 지켜지기만 한다면 "내가 해줘야 하는 일"과 "결과"만 신경쓰면 되고, 세부 사항(구체)은 신경쓰지 않아도 된다는 것.

이제 interface 에 맞춰서 실제 우리가 원하는 기능들을 구체적으로 구현해보자.

```ts
class LocalTokenRepository {
	#TOKEN_KEY = "ACCESS_TOKEN"

	save(token) {
		localStorage.setItem(this.#TOKEN_KEY, token);
		}

	get() {
		return localStorage.getItem(this.#TOKEN_KEY);
		}

	remove() {
		localStorage.removeItem(this.#TOKEN_KEY);
		}
}

const tokenRepository = new LocalTokenRepository();

fetch("todos", {
	headers: {
		Authorization: tokenRepository.get()
		}
	}
```

위와 같은 방식으로 코드를 변경하면, 외부 요소인 localStorage 는 TokenRepository Class 에 의해 관리되게 된다. 그리고 이 Class 는 우리 애플리케이션 내부의 요소이기에 통제할 수 있게 됨.

=> TokenRepository Class 가 ToeknRepository Interface 에 의존한다고 볼 수 있음.

코드는 아래의 방향대로 실행됨.

- fetch -> tokenRepository -> localStorage

기존처럼 headers 안에 바로 구체를 쓴다면..?

- fetch -> localStorage

tokenRepositoryInterface 를 이용해서 추상적인 요소로 의존성의 방향을 변경해버린 코드는 아래와 같은 호출 흐름과 의존성 방향을 가진다.

- 호출흐름: fetch -> tokenRepository Interface -> tokenRepository Class -> localStorage
- 의존성 방향 : fetch -> tokenRepository Interface <- tokenRepository Class -> localStorage

이처럼 특정 시점에서 코드의 실행 흐름(제어 흐름)과 의존성의 방향이 반대로 뒤집혔기에 이를 "**의존성 역전 원칙(DIP)**" 이라고 부르며, **IoC(Inversion of Control)** 이라고도 표현한다.

- DIP 원칙을 적용하면 애플리케이션이 상대적으로 변경 여지가 적은 추상적인 요소에 의존하도록 설계가 가능.
- 변경될 여지가 많은 구체적인 요소에 직접적으로 의존하지 않을 수 있게 됨 -> 다양한 변경에 대해서 손쉽게 대응 가능(유지보수 UP!)

## 2. 의존성 주입

특정한 모듈에 필요한 의존성을 내부에서 가지고 있는 것이 아니라, 해당 모듈을 사용하는 입장에서 주입해주는 형태로 설계하는 것을 의미..!

### Class형에서 의존성 주입

- 의존성 주입 X

```ts
class LocalTokenRepository {
  #TOKEN_KEY = "ACCESS_TOKEN";

  save(token) {
    localStorage.setItem(this.#TOKEN_KEY, token);
  }

  get() {
    return localStorage.getItem(this.#TOKEN_KEY);
  }

  remove() {
    localStorage.removeItem(this.#TOKEN_KEY);
  }
}

class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.tokenRepository = new LocalTokenRepository();
  }

  fetch(url, options = {}) {
    return window.fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        Authorization: this.tokenRepository.get(),
        ...options.headers,
      },
    });
  }
}

const httpClient = new HttpClient(process.env.BASE_URL);
```

- 의존성 주입 O

```ts
class LocalTokenRepository {
  #TOKEN_KEY = "ACCESS_TOKEN";

  save(token) {
    localStorage.setItem(this.#TOKEN_KEY, token);
  }

  get() {
    return localStorage.getItem(this.#TOKEN_KEY);
  }

  remove() {
    localStorage.removeItem(this.#TOKEN_KEY);
  }
}

class SessionTokenRepository {
  #TOKEN_KEY = "ACCESS_TOKEN";

  save(token) {
    sessionStorage.setItem(this.#TOKEN_KEY, token);
  }

  get() {
    return sessionStorage.getItem(this.#TOKEN_KEY);
  }

  remove() {
    sessionStorage.removeItem(this.#TOKEN_KEY);
  }
}

class TestTokenRepository {
  constructor() {
    this.#token = null;
  }

  save(token) {
    this.#token = token;
  }

  get() {
    return this.#token;
  }

  remove() {
    this.#token = null;
  }
}

class HttpClient {
  constructor(baseURL, tokenRepository) {
    this.baseURL = baseURL;
    this.tokenRepository = tokenRepository;
  }

  fetch(url, options = {}) {
    return window.fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        Authorization: this.tokenRepository.get(),
        ...options.headers,
      },
    });
  }
}

// ver1
const localTokenRepository = new LocalTokenRepository();
const httpClient = new HttpClient(process.env.BASE_URL, localTokenRepository);

// ver2
const sessionTokenRepository = new SessionTokenRepository();
const httpClient = new HttpClient(process.env.BASE_URL, sessionTokenRepository);

// ver3
const testTokenRepository = new TestTokenRepository();
const httpClient = new HttpClient(process.env.BASE_URL, testTokenRepository);
```

클래스 내부에서 의존성을 가지고 있는 것이 아니라
클래스를 생성할 때 외부에서 주입하는 식으로 변경하게되면
추후에 HttpClient 의 코드 수정없이
HttpClient에서 사용하는 tokenRepository 와 연관된 동작을 쉽게 변경해서 다양하게 사용할 수 있게 됨.

의존성 주입을 적용하면 좋은 점:

1. 프로그램의 유연성
2. 테스트의 용이성
3. mocking 등을 쉽게 활용

### 함수형에서 의존성 주입하기

```ts
const log = (data) => console.log(data);
log("Hello, World");

// --------------------------

const log = (logger, data) => logger(data);

log(console.log, "Hello, World");
log(console.info, "Hello, World");
log(console.warn, "Hello, World");
log(console.error, "Hello, World");
log(customLogger, "Hello, World");
```

Class 의 경우에는 constructor 를 통해서
함수의 경우에는 인자(param) 을 통해서 의존성을 주입하게 됨.

그런데 리액트 application 에는 어떻게 적용할까?
리액트는 props를 통해서 단방향으로만 데이터를 전달할 수 있기에 의존성을 주입하기가 쉽지 않다.
이를 해결하기 위해서 context API 를 컴포넌트에게 의존성을 주입하는 용도로 사용가능하다..!

## 출처

Wanted Pre-Onboarding
