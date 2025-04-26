---
layout: post
title: "프론트엔드 테스트 기법과 Jest

블로그 제목: React에서 Jest를 활용한 프론트엔드 테스트 기법 마스터하기"
date: 2025-04-26 11:43:29
categories: 프론트엔드
tags: 프론트엔드
---

---
layout: post
title:  "React에서 Jest를 활용한 프론트엔드 테스트 기법 마스터하기"
---

## 프론트엔드 테스트: Jest를 활용하자

프론트엔드 테스트는 그 어느때보다 중요해졌습니다. 특히, 리액트와 같은 modern UI 라이브러리의 복잡성이 증가함에 따라 테스트의 중요성 역시 매우 높아졌습니다. 이제는 단순히 돔 조작을 이외에도 상태 관리, 비동기 요청 등 복잡한 기능을 관리해야하므로, 적절한 단위 또는 통합 테스트는 높은 품질의 프론트엔드 애플리케이션 개발의 핵심 요소입니다.

최근에 자바스크립트 테스트 도구로서 많이 쓰이고 있는 것이 Jest입니다. Jest는 Facebook이 오픈소스로 제공하는 자바스크립트 테스팅 프레임워크로, 간단하게 설치하고 설정할 수 있으며, 매우 빠르고 유연한 API를 제공함으로써 테스트 작성을 쉽게 해주는 장점이 있습니다.

### Jest: 기본 예시

Jest를 이용하여 기본적인 테스트 코드를 작성해보겠습니다. Jest에서는 테스트를 `it` 또는 `test` 함수로 작성합니다.

```js
// sum.js
function sum(a, b) {
  return a + b;
}
module.exports = sum;

// sum.test.js
const sum = require('./sum');
test('sums up two values', () => {
  expect(sum(1, 2)).toBe(3);
});
```

위 예시에서 볼 수 있듯이, Jest 테스트는 아주 직관적입니다. `expect` 함수로 어떤 값을 입력하면, `.toBe` 메서드를 이용하여 그 값이 기대하는 값과 같은지를 확인할 수 있습니다.

### 실무에서 사용할 법한 예시 및 꿀팁 

단순한 함수의 경우 위와 같이 테스트를 작성하면 되지만, 실제 애플리케이션에서는 비동기적인 요청이나 side effect를 발생시키는 함수를 테스트해야 할 때가 많습니다. 이런 경우에는 Jest에서 제공하는 `mock` 기능을 이용하여 테스트를 작성하면 편합니다.

```js
// api.js
async function getUserName(userId) {
  const response = await fetch(`/users/${userId}`);
  const user = await response.json();
  return user.name;
};
 
// api.test.js
jest.mock('./api');
const { getUserName } = require('./api');

it('calls fetch with the right args and returns the username', async () => {
  getUserName.mockResolvedValueOnce('Bob');
  const name = await getUserName(4);
  expect(name).toBe('Bob');
});
```

위 코드 예시처럼 실무에서는 `jest.mock` 기능을 활용해 API 호출과 같은 비동기 작업들을 모의하고 이에 대한 반환값을 미리 설정함으로써 실제 API를 호출하지 않고도 테스트 코드를 작성할 수 있습니다. 이렇게 하면 테스트를 독립적으로 유지할 수 있으며, 네트워크 지연 등의 문제로 테스트가 실패하는 것을 방지할 수 있습니다.

### 응용 버전 예시

Jest와 관련된 응용 버전으로는 `snapshot testing`이 있습니다. 이 방법은 React 컴포넌트의 출력값을 간편하게 테스트할 수 있도록 도와줍니다. `toMatchSnapshot` 함수를 이용해서, 처음 실행 시에는 스냅샷을 생성하고 이후 실행할 때는 이전 스냅샷과 비교하여 변동사항이 없는지 테스트합니다.

```js
// Link.react.test.js
import React from 'react';
import renderer from 'react-test-renderer';
import Link from '../Link.react';

it('renders correctly', () => {
  const tree = renderer
    .create(<Link page="http://www.facebook.com">Facebook</Link>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
```

Jest만 잘 이용하면 프론트엔드 테스트의 거의 모든 케이스를 커버할 수 있습니다. 기본적인 단위테스트부터 비동기 처리, 리액트 컴포넌트 테스트까지 다양한 테스트 케이스를 효율적으로 작성할 수 있으므로, Jest는 프론트엔드 개발자의 필수 도구로서 빠르게 자리잡고 있습니다. 매번 기능을 추가할 때마다 수동으로 확인하는 시대는 지났습니다. Jest와 같은 테스트 프레임워크를 이용하면, 기능을 추가하거나 변경할 때마다 코드가 올바르게 동작하는지 자동적으로 검증할 수 있습니다.

