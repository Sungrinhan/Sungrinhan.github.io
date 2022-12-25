---
title: "[Git][Error] Git 사용중 branch가 꼬였을때 "
date: 2022-12-25 17:57:SS +/- TTTT
categories: [Git, Errors]
tags: [antd, gitpull, error] # TAG는 반드시 소문자로 이루어져야함!
---

# Git pull err ( Need to specify how to reconcile divergent branches )

### 에러 상황

1. git pull 을 할 때마다 새로운 commit 이 생겨서 `merge: main브랜치와 병합` 이라는 불필요한 커밋을 항상 해왔다.

2. git pull 을 할 때 다음과 같은 오류가 발생했다.

```ts
fatal: Need to specify how to reconcile divergent branches
```

### 기본 Git Pull 의 문제점

`git pull --help` 을 보면 다음과 같은 설명을 볼 수 있다.

```ts
... In its default mode, git pull is shorthand
for git fetch followed by git merge FETCH_HEAD.
```

위의 내용을 보면, `git pull` 은 `git fetch` + `git merge FETCH_HEAD` 와 같이 동작한다는 것을 알 수 있다.

기본 mode 의 경우 `git pull` 을 실행하면 `git merge commit` 을 생성하게 된다. 기존에 존재하지 않는 commit 이 자동으로 생기게 된다.

따라서 pull 을 받을 때 마다 불필요한 `merge commit` 이 생기게 되는 것이다.

#### Example

Local branch 에 작업을 하는 도중 다른 누군가가 remote 에 새로운 commit 을 만든 상황.

![](https://64.media.tumblr.com/9fb0685ca9c513197d3be0f4fd186e12/tumblr_inline_ps7dd2ta811wthf4f_540.png)
만약 이런경우 `git pull` 이나 `git pull origin master` 를 별도의 옵션없이 실행하면 다음과 같은 상황이 발생한다.

![](https://64.media.tumblr.com/eea76d484de575ea94c8203cbba4b80b/tumblr_inline_ps7ddfddO01wthf4f_540.png)
만약 작업을 다른 branch 에서 하고 있다면 또 다른 문제가 발생한다.

develop 이라는 branch 에 check-out 후 `git pull origin master`를 작업한다면 local master 에 작업되는 것이 아닌, 작업중인 branch에 merge가 되는 상황이 발생하게 된다.

### ## Git Pull --ff-only 동작 원리

이런 상황을 방지하기 위해서 Git 에서는 이러한 commit 이 생기는 것을 방지하는 옵션을 제공하고 있다.

`git pull --ff-only` 하면 Git 은 새 커밋을 생성하지 않고, `fast-forward` 인 경우에만 branch를 업데이트 한다.

이게 실행되지 않는다면 (local 과 remote 가 분리된 경우)
`git pull --ff-only` 는 다음과 같은 에러메시지를 출력한다.

```ts
$ git pull --ff-only upstream master
# ...
fatal: Not possible to fast-forward, aborting.
```

- human error를 방지한다.
- 이 에러가 나오면, 왜 branch 가 갈라진 이유를 찾아야 한다.
- 때로는 master 를 local branch 로 가져오려고 하는 실수를 찾을수도 있다.
- 실제로 merge commit 을 만들려고 했던경우는 git merge 를 하면 된다.
- 이렇게 하면 `download` 와 `commit`을 서로 다른 두 단계로 수행하여, 두 작업을 분리하는데 도움이 된다.

매번 `--ff-only` 를 붙이는건 어려울 것. global 설정을 통해 항상 fast-forward 방향으로 pull할 수 있도록 하자.

```ts
$ git config --global pull.ff only
```

## 출처

[# [GIT] Git pull 전략 (default, --ff -only, --rebase)](https://sanghye.tistory.com/43)
[## [Why You Should Use git pull –ff-only] by sffc Tech Blog](https://blog.sffc.xyz/post/185195398930/why-you-should-use-git-pull-ff-only)
