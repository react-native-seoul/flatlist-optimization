## FlatList 최적화

### [react-native-fast-image][FastImageLink]
이미지 크기가 작을 수록 성능에 유리하기 때문에 최대 720p 이미지 크기만 사용하고 `react-native-fast-image`를 사용하여 이미지 캐싱을 최적화 합니다.

```js
<FastImage
  onLoadEnd={() => setLoading(false)}
  resizeMode={'cover'}
  source={{uri: post.photo}}
  style={StyleSheet.absoluteFill}
/>
```

[FastImageLink]:https://github.com/DylanVann/react-native-fast-image

### useCallBack
`useCallBack`을 사용해서 조건부로 렌더링해서 렌더 횟수를 줄입니다.

- Before
```js
renderItem={({item}) => {
  return <PostCard key={item.id} post={item} />;
}}
```

- After
```js
const postCardItem = useCallback(
    ({item}: {item: Post}) => <PostCard key={item.id} post={item} />,
  [],
);
```

### keyExtractor
`keyExtractor`는 키는 캐싱에 사용되며 항목 `re-ordering`을 추적하기 위한 반응 키로 사용됩니다.

이는 항목을 동적으로 추가하거나 제거할 때 유용합니다.

```js
const keyExtractor = useCallback(key => key.id.toString(), []);

<FlatList
  keyExtractor={keyExtractor}
  ...
/>
```

### maxToRenderPerBatch
`maxToRenderPerBatch`는 소품은 모든 스크롤에서 렌더링할 최대 항목 수를 설정하는 데 사용합니다.

default 값이 `10`이고 `item`의 크기에 따라서 더 줄일 수도 있습니다.

예를 들어 목록의 2개 `item`이 화면 높이의 `100%`를 덮는 경우 약 `3~5`로 설정합니다. 

목록의 5개 항목이 화면 높이의 `100%`를 덮으면 대략 `8`까지 설정합니다.

`Feed.tsx` 예시에서는 `item` 1개가 거의 모든 화면을 덮었기 때문에 `2`로 설정했습니다.

```js
<FlatList
  maxToRenderPerBatch={2}
  ...
/>
```

### windowSize
`windowSize`는 보이는 영역 외부에서 렌더링되는 최대 항목 수를 길이 단위로 결정합니다.

default 값이 `21` 이고 뷰포트 위로 최대 10개, 아래로 최대 10개를 렌더합니다.

```js
<FlatList
  windowSize={2}
/>
```

이외에 `FlatList`에서 렌더 되는 컴포넌트를 `useMemo`등을 사용하여 순수 컴포넌트로 만드는 방법도 있습니다.

예시의 경우 위에 항목들을 적용하기 전에도 큰 성능 문제가 없었기 때문에 위에서 했던 최적화 방법들을 적용해도 큰 차이를 못 느꼈습니다.