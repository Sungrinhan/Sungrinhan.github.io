---
title: "[JS] FormData 정리"
date: 2022-07-06 00:09:SS +/- TTTT
categories: [JavaScript, Errors]
tags: [javascript, formdata] # TAG는 반드시 소문자로 이루어져야함!
---

# FormData 객체

FormData 란 ajax 로 form data 전송을 가능하게 해주는 객체.
보통은 HTML5 의 <form> 태그를 이용해 input 값을 서버에 전송하지만, formdata 를 이용해 스크립트로도 전송할 수 있음.

## FormData 활용

보통은 Ajax 로 폼(form 태그) 전송을 할 일이 거의 없다.
주로 JSON 구조로 "KEY-VALUE" 구조로 데이터를 전송하기 때문이다.

form 전송이 필요한 경우가 있는데 , 이미지를 ajax로 업로드 할 때 필요하다.
이미지는 base64, buffer, binary data 형식으로 서버로 전송해도 된다.

또한, 페이지 전환 없이 폼 데이터를 제출 하고 싶을 때 바로 FormData 객체를 사용한다.

```js
// html 에 form 태그가 있으면 자바스크립트로 가져온다.
var formData = new formData(document.getElementById("form Id")

// html에 form 태그가 없을 때
var formData = new FormData() // new FormData() 로 새로운 객체 생성
formData.append('key값', 'value값')
```

위처럼 append() 메소드로 key-value 값을 하나씩 추가해주면 **같은 key를 가진 값을 여러 개 넣을 수 있다.**
참고로 값은 "문자열"로 자동변환 된다.

> 💡**Tip**
> formData.append(name, value) 함수를 이용해 데이터를 넣을시에 value는 문자열로만 입력된다. 객체를 넣으면 무시되고, 'Object1'처럼 문자열로 입력된다.

내가 이미지 업로드 할 때 사용한 코드를 보자.

```ts
// 이미지 업로드 버튼 클릭시 발생하는 함수
const  handleSubmit  = (e) => {
e.preventDefault();
setLoading(true);
// FormData 객체를 새로 생성해준다.
const  formData  =  new  FormData();
const  url  =  `/wms/api/management/custcds/${custCd}/items/images/imageupload`;

//
formData.append('pcs', inputPcsImgFile.length  && inputPcsImgFile[0]?.uploadedFile);
formData.append('box', inputBoxImgFile.length  && inputBoxImgFile[0]?.uploadedFile);
formData.append('plt', inputPltImgFile.length  && inputPltImgFile[0]?.uploadedFile);

// api 주소 url도 여기서 받아서 한다.
formData.append('url', url);

// 이미지업로드 쿼리
postProductImage(formData).then((res) => {
message.success('사진 업로드가 성공적으로 되었습니다.');
// api 응답으로 내려온 img Urls
const  ImgUrls  =  res?.data;
});
```

- 위와같이 formData 객체를 생성하고 거기에 formData 로 넘길 것들을 append 로 더해주면 된다.
- 이제 formData를 ajax로 넘겨만 주면 끝인데 함정이 있다.
- img File 을 append 하고 formData 를 console.log 로 찍어보면, formData 객체가 찍히긴 하는데 key나 value 값을 확인 할 수 없다.

> 💡Tip
> 자바스크립트에서 formdata 의 데이터를 조작할 때가 있다.
> FormData 객체란 단순한 객체가 아니며 XMLHttpRequest 전송을 위하여 설계된 특수한 객체 형태다. 그러기에 문자열화 할수 없는 객체이며, console.log 로 확인이 불가능하다.

## formData 메소드 정리

```js
// key 가 존재하는지 확인. 값이 boolean type 으로 반환
formData.has("item"); // true
formData.has("money"); // false

//값의 첫번째 value가 반환된다.
formData.get("item"); // hi

//중복된 key값을 모두 가져올 때 배열형식으로 가져온다.
formData.getAll("item"); // ['hi','hello']
```

```js
// 중복된 값을 넣을때는 배열로 한꺼번에 append 할 수 있다.
formData.append("test", ["hi", "sungrin"]);
formData.getAll("test"); // ['hi', 'sungrin']

// 삭제
formData.delete("test");
formData.get("test"); // null

// item 값을 수정한다.,
formData.set("item", "test2");
formData.getAll("item"); // ['test2']
```

**formData.append(name, value)**

- form 의 name 과 value 필드를 추가한다.
- 여기서 name은 input의 name과 vlaue 역할

**formData.append(name, blob, fileName)**

- input 의 type 이 'file'인 경우에 사용
- fileName은 file의 이름에 해당

**formData.delete(name)**

- 주어진 name으로 필드를 제거

**formData.get(name)**

- 주어진 name의 해당하는 필드 value 를 반환.

  **formData.getAll(name)**

- append 함수로 추가시 name이 중복 가능함.
- 따라서 주어진 name 의 해당 하는 필드의 모든 value 를 반환

**formData.has(name)**

- 주어진 name의 해당하는 필드가 있는경우 boolean 값을 반환

**formData.set(name, value)**

- set 함수는 append 함수처럼 필드를 추가시켜줌
- append와 비슷한 set메소드는 필드를 추가해주기도 하지만, <u>기존 key가 있으면 그 key 값을 모두 덮어씌워버림!!</u>

## formData 서버 전송

```ts
axios({
  method: "post",
  url: `http://3.34.0.38:3000/wms/api/management/custcds/${custCd}/items/images/imageupload`,
  data: formData,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
  },
}).then((res) => {});
```

- axios 전송할 경우, data에 formData 를 넣는다. 바이너리 형식으로 서버에 전송할 경우, multipart/form-data 로 전송해준다.
- 헤더부분에는 컨텐트 타입과, 엑세스토큰을 넣어준다.
- 처음에는 쿼리로 formData를 전송하는법을 몰라서 axios 로 했으나 ,쿼리로 제어해보자.

```ts
// 상품마스터 이미지 등록
postProductImage: build.mutation<PostImageUploadResponse, FormData>({
query: (data) => {
const  url  = data.get('url');
data.delete('url');
return {
url:  `${url}`,
method:  'POST',
body: data,
};
},
}),
```

- Request Arg 에다가 FormData 를 넣어주면, 헤더를 정해줄 필요없이 브라우저가 알아서 변경해준다. 정말 쉬운방법인데, 찾는데 좀 걸렸다. 다들 그냥 fetch 로 이미지 업로드를 하나 싶었다.
- 근데 검색하면서 알게 되었는데, formData 를 보낼때는 header 부분은 브라우저가 자동으로 설정해주기 때문에 content-Type 을 따로 지정할 필요가 없었다.

```js
var formData = new FormData();

fetch("url", {
  method: "POST",
  cache: "no-cache",
  body: formData, // body 부분에 폼데이터 변수를 할당
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

`URLSearchParams()` 를 사용하면 일반 객체 형태를 formdata형식으로 반환해준다.
위의 방법보다 가독성이 훨씬 좋아진다.

```js
var formData = new FormData();

fetch("url", {
  method: "POST",
  cache: "no-cache",
  body: new URLSearchParams({
    // 일반 객체를 formdata 형식으로 변환해주는 클래스
    pcs: filename,
    box: filename2,
    plt: filename3,
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## 참조

내 프로젝트, https://inpa.tistory.com/entry/JS-%F0%9F%93%9A-FormData-%EC%A0%95%EB%A6%AC-fetch-api
