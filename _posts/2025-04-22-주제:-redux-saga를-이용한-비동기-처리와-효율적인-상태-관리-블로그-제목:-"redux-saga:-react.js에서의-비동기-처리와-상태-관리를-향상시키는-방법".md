---
layout: post
title: "Redux Saga를 이용한 비동기 처리와 효율적인 상태 관리

블로그 제목: "Redux Saga: React.js에서의 비동기 처리와 상태 관리를 향상시키는 방법""
date: 2025-04-22 15:05:11
categories: 프론트엔드
tags: Redux
---

# Redux Saga: React.js에서의 비동기 처리와 상태 관리를 향상시키는 방법

## Redux Saga 소개

Redux Saga는 JavaScript 애플리케이션에서 부작용 (비동기 요청과 같이 결과가 애플리케이션의 상태에 의존하지 않는 함수)를 쉽게 관리할 수있는 라이브러리이다. 이것은 애플리케이션 사이드 이펙트, 즉 데이터 요청, 가상 액션에 응답, 브라우저 캐시 액세스 등을보다 쉽고 가독성이 좋게 만드는 데 실제로 도움이 된다.

## Redux Saga의 작동 방식

Redux Saga는 ES6 기능인 제너레이터를 사용하여 비동기일 수 있는 동작을 조정한다. 이 잘 설계된 조합은 비동기 코드의 읽기 쉽고 테스트하기 쉬운 작성을 가능하게 한다. 제너레이터는 기본적으로 함수가 중간에서 멈추고 다시 시작할 수있는 기능을 제공하므로, 코드의 비실질적인 부분 (비동기 요청들)을 순차적으로 겉보기 분명하게 구성할 수 있다.

기본적으로 Redux Saga는 애플리케이션에서 발생하는 각 Redux 액션에 대응하는 Saga를 등록하고, 해당 액션을 감지하면 정의한 작업을 실행한다.

## Redux Saga 사용 예시

Redux Saga는 애플리케이션 상태에 대한 사이드 이펙트를 관리하기 위해 사용된다. 비동기 작업을 처리하는 가장 일반적인 시나리오 중 하나는 API 호출을 보내는 것이다.

기본적인 Redux Saga 사이드 이펙트로서 API 호출을 처리하는 코드 예시를 살펴보자.

```javascript
import { call, put, takeEvery } from 'redux-saga/effects';
import Api from '...';

// worker Saga: USER_FETCH_REQUESTED 액션에 응답하여 비동기 요청을 수행함
function* fetchUser(action) {
  try {
    const user = yield call(Api.fetchUser, action.payload.userId);
    yield put({ type: "USER_FETCH_SUCCEEDED", user: user });
  } catch (e) {
    yield put({ type: "USER_FETCH_FAILED", message: e.message });
  }
}

function* mySaga() {
  yield takeEvery("USER_FETCH_REQUESTED", fetchUser);
}

export default mySaga;
```
위 예제에서 `fetchUser`라는 worker Saga는 `USER_FETCH_REQUESTED` 액션을 감지하면 실행된다. 이 saga는 Api 모듈의 `fetchUser` 함수에 `userId`를 전달하여 API 호출을 수행한다. API 요청이 성공하면 결과를 payload로 포함하는 `USER_FETCH_SUCCEEDED` 액션을 dispatch한다. 만약 API 요청이 실패하면, 에러 메시지를 payload로 포함하는 `USER_FETCH_FAILED` 액션을 dispatch한다.

## Redux Saga 활용 팁

Redux Saga에서는 지연 (`delay`), 동시성 (병렬 작업 실행), 데버틀링 및 쓰로틀링, 비동기 호출 중단 (예: API 요청 취소)과 같은 고급 사이드 이펙트 관리 기능도 제공한다. 이런 기능들은 애플리케이션의 복잡성을 크게 줄여주며, 신뢰성과 사용성을 향상시키는 데 도움이 된다.

```javascript
import {all, call, put, takeEvery, delay} from 'redux-saga/effects';
import Api from '...';

// worker saga
function* fetchUser(action) {
    try {
        yield delay(1000);
        const user = yield call(Api.fetchUser, action.payload.userId);
        yield put({type: "USER_FETCH_SUCCEEDED", user: user});
    } catch (e) {
        yield put({type: "USER_FETCH_FAILED", message: e.message});
    }
}

// root saga
function* mySaga() {
    yield all([
        takeEvery("USER_FETCH_REQUESTED", fetchUser),
        // 다른 worker sagas를 등록할 수 있다
    ]);
}

export default mySaga;
```
위 예제는 `delay`의 사용방법을 보여주는 고급 Redux Saga 코드의 한가지 예시이다.
