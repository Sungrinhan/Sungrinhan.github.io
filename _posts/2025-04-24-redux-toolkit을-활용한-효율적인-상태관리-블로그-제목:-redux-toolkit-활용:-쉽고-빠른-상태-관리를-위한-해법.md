---
layout: post
title: "Redux Toolkit을 활용한 효율적인 상태관리

블로그 제목: Redux Toolkit 활용: 쉽고 빠른 상태 관리를 위한 해법"
date: 2025-04-24 13:32:39
categories: 프론트엔드
tags: Redux
---

블로그 내용:

Redux Toolkit은 Redux의 '공식 방법'으로 사실상 Redux의 요구사항을 단순화 합니다. Redux Toolkit을 사용하면 당신은 액션 타입, 액션 생성자 함수, 리듀서 함수를 직접 작성할 필요가 없습니다. 대신 `createSlice()`라는 Redux Toolkit 함수를 사용하여 이 모든 것들을 한 번에 생성할 수 있습니다.

```javascript
import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: state => state + 1,
    decrement: state => state - 1
  }
})

export const { actions, reducer } = counterSlice
```
위의 코드에서 리듀서 함수는 더 이상 불변성을 직접 관리할 필요가 없습니다. Redux Toolkit은 'Immer'라는 라이브러리를 내부적으로 사용하여 불변성을 자동으로 처리합니다. 

이제 실무에서 어떻게 활용할 수 있을지 알아봅시다. Redux Toolkit은 비동기 작업 처리를 위한 `createAsyncThunk` 함수를 제공합니다. 

```javascript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchUserById = createAsyncThunk('users/fetchByIdStatus', async (userId, thunkAPI) => {
  const response = await axios.get(`/api/users/${userId}`)
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState: {},
  reducers: {},
  extraReducers: {
    [fetchUserById.fulfilled]: (state, action) => {
      state[action.payload.id] = action.payload
    }
  }
})

export default usersSlice.reducer
```

위의 코드에서 `createAsyncThunk`는 Promise를 반환하는 함수를 인자로 받습니다. 이 함수 내에서는 서버로 데이터를 가져오거나, 저장하는 등의 비동기 작업을 처리하면 됩니다. 또한 `extraReducers`는 단일 액션 타입에 따라 여러 리듀서들을 실행할 수 있게 해줍니다.

응용 버전을 살펴보면, 복잡한 상태 객체를 관리하는 상황에서도 Redux Toolkit을 효과적으로 활용할 수 있습니다. 

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchCommentsByPostId = createAsyncThunk('comments/fetchByPostIdStatus', async (postId, thunkAPI) => {
  const response = await axios.get(`/api/posts/${postId}/comments`)
  return response.data
})

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {},
  reducers: {},
  extraReducers: {
    [fetchCommentsByPostId.fulfilled]: (state, action) => {
      action.payload.forEach(comment => {
        state[comment.id] = comment
      })
    }
  }
})

export default commentsSlice.reducer
```
위의 코드에서는 포스트 ID로 댓글들을 가져와서 상태에 저장하는 시나리오를 보여줍니다. `fetchCommentsByPostId`라는 비동기 액션을 통해 서버에서 데이터를 가져온 후, 이를 상태에 반영하는 부분은 `extraReducers`를 통해 처리합니다.

Redux Toolkit은 익히면 Redux 코드를 훨씬 더 간결하고 명확하게 만들 수 있는 도구입니다. 기본적인 사용법부터 비동기 작업 처리, 복잡한 상태 관리까지 쉽게 해결할 수 있으므로, 실무에서 많이 활용하게 될 것입니다.
