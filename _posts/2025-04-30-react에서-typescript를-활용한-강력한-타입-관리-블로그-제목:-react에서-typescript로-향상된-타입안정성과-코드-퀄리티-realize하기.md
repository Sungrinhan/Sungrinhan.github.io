---
layout: post
title: "React에서 TypeScript를 활용한 강력한 타입 관리

블로그 제목: React에서 TypeScript로 향상된 타입안정성과 코드 퀄리티 Realize하기"
date: 2025-04-30 15:43:07
categories: 프론트엔드
tags: React에서
---

# React에서 TypeScript로 향상된 타입안정성과 코드 퀄리티 Realize하기

## 개념 설명
자바스크립트와 함께 몇 년 동안 개발한 후, TypeScript로 전환한 개발자들이 많습니다. TypeScript는 확장된 자바스크립트로, 자바스크립트에 정적 타입이 추가된 버전이라고 이해할 수 있습니다. 이는 오류를 더 쉽게 추적하고 부가적인 도구나 편집기 지원을 제공하기 위한 것입니다. 

TypeScript의 가장 큰 장점 중 하나는 강력한 타입 시스템입니다. 이는 코드의 품질과 가독성을 높이며, 런타임 오류를 줄이는 데 크게 기여합니다. 오늘날 React는 대표적인 프런트엔드 라이브러리로 사용되며, TypeScript와 함께 사용될 때 더욱 강력해집니다. React와 TypeScript를 함께 사용하면 props, state 및 이벤트 핸들러와 같이 널리 사용되는 React 요소의 타입을 명확하게 지정할 수 있어 코드의 전반적인 품질을 향상시킬 수 있습니다.

## 코드 예시
다음은 React와 TypeScript가 어떻게 함께 작동하는지 보여주는 간단한 예제입니다.

```typescript
import * as React from "react";

interface Props {
  name: string;
  age: number;
}

class MyComponent extends React.Component<Props> {
  render() {
    const { name, age } = this.props;
    return (
      <div>
       {name} is {age} years old.
      </div>
    )
  }
}
```

위의 예제에서, 우리는 Props라는 TypeScript 인터페이스를 정의하고, 이 인터페이스를 MyComponent의 props로 사용하였습니다. 이러한 방식으로, 나중에 이 컴포넌트에 잘못된 타입의 props를 전달하려고 한다면 TypeScript는 에러를 발생시킵니다.

## 실무 활용 및 꿀팁
- 이벤트 핸들러에 타입을 정의하려면 React가 제공하는 SyntheticEvent 타입을 사용하세요. 예를 들면, 클릭 이벤트 핸들러를 정의하려면 다음과 같이 할 수 있습니다:

```typescript
handleClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
 console.log(event.currentTarget.name);
}
```

- TypeScript와 함께 라이브러리를 사용하려면 해당 라이브러리의 타입 정의를 설치해야 할 수도 있습니다. 대부분의 자바스크립트 라이브러리는 @types/ 패키지를 통해 타입을 제공합니다.

```bash
npm install @types/react
```

- React 컴포넌트에 함수형 컴포넌트 형식을 사용하려면, TypeScript의 함수형 컴포넌트 정의를 사용하세요:

```typescript
interface Props {
  name: string;
  age: number;
}

const MyComponent: React.FC<Props> = ({name, age}) => {
  return <div>{name} is {age} years old.</div>;
}
```

## 응용버전 예시
React와 TypeScript를 사용하여 복잡한 상태 관리를 수행하는 간단한 예제를 살펴보겠습니다.

```typescript
interface UserState {
  name: string;
  age: number;
}

class UserComponent extends React.Component<{}, UserState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      name: '',
      age: 0,
    }
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({name: event.currentTarget.value});
  }

  handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({age: Number(event.currentTarget.value)});
  }

  render() {
    return (
      <div>
       <input type="text" value={this.state.name} onChange={this.handleNameChange} />
       <input type="number" value={this.state.age} onChange={this.handleAgeChange} />
      </div>
    )
  }
}
```

위의 코드는 name이라는 문자열과 age라는 숫자를 상태로 가지는 `UserComponent`를 정의하고 있습니다. 각각의 상태는 적절한 이벤트 핸들러를 통해 변경됩니다. 이벤트 핸들러의 인자로 들어오는 이벤트 객체 역시 적절한 타입으로 지정되어 있어, 다른 타입의 이벤트 객체가 들어온다면 컴파일 오류를 발생시킵니다. 이와 같이 React와 TypeScript를 함께 사용하면 코드의 타입 안정성을 높이고, 런타임 오류를 줄이는 데 큰 도움이 됩니다.
