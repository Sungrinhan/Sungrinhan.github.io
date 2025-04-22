---
layout: post
title: "Middleware in Redux : 효율적인 비동기 작업과 디버깅을 위한 필수 요소"
date: 2025-04-22 15:09:22
categories: 프론트엔드
tags: Middleware
---

**Middleware in Redux: 효율적인 비동기 작업과 디버깅을 위한 필수 요소**

Redux에서의 middleware는 액션을 dispatch 하여 리듀서에서 이를 처리하기 전의 중간 공간을 의미합니다. 즉, 액션이 특정 작업을 처리하는 도중에 원하는 동작을 삽입할 수 있게 해줍니다. 이는 비동기 작업을 처리하거나, 특정 조건에 따라 액션을 무시하거나, 콘솔에 로그를 출력하거나, 서버 API 호출 등과 같은 사용자 정의 작업을 적용하는 데 특히 유용합니다.

Redux middleware를 구현하려면, 다음과 같은 패턴의 함수를 작성해야 합니다.

```javascript
const myMiddleware = store => next => action => {
    // 여기서 미들웨어 로직을 작성할 수 있습니다.
    return next(action);
};
```
store는 리덕스 스토어 인스턴스이며, next는 처리할 다음 미들웨어를 가리킵니다. 만약 다음 미들웨어가 없다면 리듀서를 가리킵니다.

다음은 실제로 Redux 미들웨어를 적용하는 방법입니다.

```javascript
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import myMiddleware from './middleware/myMiddleware';

const store = createStore(
    rootReducer,
    applyMiddleware(myMiddleware)
);
```

따라서 다음과 같이 action 객체를 dispatch하면, 리듀서로 전달되기 전에 미들웨어에서 처리됩니다.

```javascript
store.dispatch({ type: 'MY_ACTION' });
```

실무에서는 대표적으로 Redux-Thunk, Redux-Saga와 같은 라이브러리를 사용하여 비동기 작업을 처리합니다. 이들은 모두 미들웨어의 형태로 제공되며, 액션 생성기(action creator) 안에서 비동기 작업을 할 수 있게 해줍니다. 그렇기 때문에 더 복잡한 비동기 작업을 쉽게 관리할 수 있습니다.

그리고 미들웨어는 리덕스 개발 도구와 같은 디버깅 작업에도 이용됩니다. 예를 들어, 액션이 발생할 때마다 상태 변화를 콘솔에 출력하거나, 서버와의 API 통신 내용을 기록하려면 다음처럼 미들웨어를 작성할 수 있습니다.

```javascript
const loggerMiddleware = store => next => action => {
    console.group(action && action.type); // action type으로 log를 그룹화함
    console.log('이전 상태', store.getState());
    console.log('액션', action);
    next(action); // 다음 미들웨어, 없으면 리듀서에게 전달
    console.log('다음 상태', store.getState());
    console.groupEnd(); // 그룹 끝
};
```

마지막으로, middleware를 통해 액션에 따른 다양한 side-effect를 관리하는 응용 사례를 알아봅시다. 예를 들면, 특정 액션을 감지하면 웹소켓을 통해 서버에 실시간으로 데이터를 전송하는 것이 있습니다. 이때, 미들웨어에서 액션을 감지하여 웹소켓 API 호출을 효율적으로 관리할 수 있습니다.

```javascript
let socket = null;

const webSocketMiddleware = store => next => action => {
    switch(action.type) {
        case 'WS_CONNECT':
            // socket 연결
            if(socket !== null) {
                socket.close();
            }
            socket = new WebSocket(action.payload);
            break;
        case 'WS_DISCONNECT':
            // socket 연결 종료
            if(socket !== null) {
                socket.close();
            }
            socket = null;
            break;
        case 'WS_SEND':
            // 서버로 메시지 보내기
            if(socket !== null) {
                socket.send(JSON.stringify(action.payload));
            }
            break;
        default:
            return next(action);
    }
};
```

이제 Redux 미들웨어를 어떻게 사용하고 활용할 수 있는지 보다 깊이 이해하셨을 거라 생각합니다. 미들웨어는 Redux에서의 강력한 도구로, 이를 잘 활용하면 애플리케이션의 비동기 처리 능력과 디버깅 요소를 효과적으로 관리할 수 있습니다.

