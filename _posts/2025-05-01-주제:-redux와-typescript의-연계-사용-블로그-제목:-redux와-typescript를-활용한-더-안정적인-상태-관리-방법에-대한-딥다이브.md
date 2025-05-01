---
layout: post
title: "주제: Redux와 TypeScript의 연계 사용
블로그 제목: Redux와 TypeScript를 활용한 더 안정적인 상태 관리 방법에 대한 딥다이브"
date: 2025-05-01 08:49:49
categories: 프론트엔드
tags: 주제:
---

---

Redux와 TypeScript를 함께 사용하면 상태 관리를 더욱 강화하고 안정적으로 할 수 있습니다. Redux는 JavaScript 애플리케이션에서 상태를 예측 가능하게 관리하기 위한 라이브러리이며, TypeScript는 자바스크립트의 슈퍼셋으로, 정적 타입으로 코드의 안정성을 높여주는 언어입니다.

Redux의 핵심 기능 중 하나는 애플리케이션의 상태를 중앙 집중식으로 관리한다는 것입니다. 이는 개발자들이 애플리케이션의 상태 변화를 예측하고 이해하기 쉽게 해주며, 하나의 저장소에서 애플리케이션 상태를 관리하므로 코드의 복잡성을 줄여줍니다.

TypeScript는 자료형을 사용하여 변수, 함수 매개변수, 반환값에 대한 정보를 제공하여, 복잡한 코드를 이해하는 데 도움을 줍니다. 또한, 자료형 오류를 컴파일 단계에서 잡아냄으로써 런타임 오류를 방지해줍니다. 따라서, Redux와 TypeScript를 함께 사용하면, 동적인 JavaScript 언어의 유연성과 정적 자료형의 안정성을 동시에 얻을 수 있습니다.

이제 Redux와 TypeScript를 연계하여 사용하는 실제 코드 예시를 볼 것입니다.

```typescript
// actions.ts
import { createAction } from '@reduxjs/toolkit';

export const addTodo = createAction<string>('todos/add');
export const toggleTodo = createAction<number>('todos/toggle');

// reducer.ts
import { createReducer } from '@reduxjs/toolkit';
import { addTodo, toggleTodo } from './actions';

export interface Todo {
  text: string;
  completed: boolean;
}

interface TodosState {
  todos: Todo[];
}

const initialState: TodosState = {
  todos: [],
};

export const todosReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addTodo, (state, action) => {
      state.todos.push({ text: action.payload, completed: false });
    })
    .addCase(toggleTodo, (state, action) => {
      const todo = state.todos[action.payload];
      if (todo) {
        todo.completed = !todo.completed;
      }
    });
});
```

위 코드에서는 액션 생성 함수`createAction`과 리듀서 생성 함수 `createReducer`를 사용하여 Redux 액션과 리듀서를 정의하였습니다. 여기서 TypeScript의 장점을 활용하여 액션 페이로드의 타입을 지정하였고, 각 Todo 항목과 Todo 목록의 상태를 인터페이스로 정의하여 안전하게 상태를 관리하였습니다.

실무에서는 액션 타입을 상수로 정의하고, 이를 여러 파일에서 재사용할 수 있도록 모듈로 분리하는 것이 좋습니다. 또한, 공통적으로 사용되는 상태의 형태를 인터페이스나 타입으로 정의하여 코드의 일관성을 유지하고 오류를 줄일 수 있습니다.

음 다음은 Redux와 TypeScript를 활용하여 비동기 요청을 처리하는 응용 예제입니다.

```typescript
// actions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async () => {
    const response = await axios.get<Todo[]>('https://example.com/todos');
    return response.data;
  }
);

// reducer.ts
import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { fetchTodos } from './actions';

interface TodosState {
  todos: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodosState = {
  todos: [],
  status: 'idle',
  error: null,
};

export const todosReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchTodos.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
      state.status = 'succeeded';
      state.todos = action.payload;
    })
    .addCase(fetchTodos.rejected, (state, action: PayloadAction<string | null>) => {
      state.status = 'failed';
      state.error = action.payload;
    });
});
```

이때 서버로부터 받는 데이터의 형태를 TypeScript 타입으로 정의하면, 데이터 처리 과정에서 발생할 수 있는 오류를 줄일 수 있습니다.

마지막으로, Redux 코드를 작성하면서 아래와 같은 습관을 갖는 것이 좋습니다. 복잡한 로직은 미들웨어나 썽크(thunk)에 배치하고, 리듀서는 순수 함수 기반으로 유지하며, 상태를 불변하게 관리하고, 셀렉터를 사용하여 상태 쿼리를 최적화하세요.

Redux와 TypeScript의 함께 사용하는 것은 코드의 안정성과 가독성을 높여줍니다. 그러나 처음에는 셋업이 복잡하고 학습 곡선이 다소 가파르기 때문에, 사전에 Redux와 TypeScript에 대한 충분한 이해가 필요합니다.

이 포스트는 Redux와 TypeScript의 기본적인 사용 방법에 대해 설명하였습니다. 더 다양하고 복잡한 상황에서는 공식 문서를 참고하거나, 커뮤니티에서 해결책을 찾는 것이 좋습니다.
