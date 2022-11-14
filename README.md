## FlatList 최적화

### 개요

`FlatList`에서 많은 양의 데이터를 불러올 때, 어떻게 최적화를 전행하는지 알아보고자 합니다.

### 최적화 방법 1. `memo`, `useCallback`의 사용

- `react-native` 프로젝트에서 [FlatList](https://github.com/facebook/react-native/blob/main/Libraries/Lists/FlatList.js#L297) 부분을 살펴보면 순수 컴포넌트로 되어 있는 것을 확인할 수 있습니다.
- 따라서 `FlatList`를 감싸고있는 부모 컴포넌트에서 내려주는 `props`들 중 부모 컴포넌트에서 정의하는 콜백함수들을 익명함수가 아닌 `useCallback`으로 감싸주면, 부모 컴포넌트의 다른 props의 변화로 인한 `FlatList`의 불필요한 리렌더링을 줄일 수 있어 최적화에 도움이 됩니다.
- 또한 `FlatList`에 아이템이 되는 컴포넌트는 `memo`를 사용하여 순수 컴포넌트로 만들어주어서 불필요한 리렌더링을 방지할 수 있습니다.

##### `memo` 사용 예시

- [memo](https://reactjs.org/docs/react-api.html#reactmemo)는 컴포넌트를 리턴하는 고차 컴포넌트(HOC)입니다. 인자로 들어온 컴포넌트를 순수 컴포넌트로 만들어 줍니다. 순수 컴포넌트는 `props`가 변하거나 내부 `state`가 변할 때만 리렌더링됩니다.

```ts
const PhotoView = memo(({photo, onPress, selected}: PhotoViewProps) => {
 //
}

```

##### `useCallBack` 사용 예시

- `PhotoView`의 `props`인 `onPress`에 전해지는 `onPressPhoto` 콜백함수 역시 `useCallback`으로 감싸주어서,`PhotoView`의 불필요한 리렌더링을 막아줍니다.

```ts
const onPressPhoto = useCallback((photo: Photo) => {
  setPhotoIds(([...draft]) => {
    const idx = draft.indexOf(photo.id);

    if (idx > -1) {
      draft.splice(idx, 1);
    } else {
      draft.push(photo.id);
    }

    return draft;
  });
}, []);

const renderItem: ListRenderItem<Photo> = useCallback(
  ({item}) => (
    <PhotoView
      selected={photoIds.indexOf(item.id) > -1}
      photo={item}
      onPress={onPressPhoto}
    />
  ),
  [photoIds, onPressPhoto],
);
```

### 최적화 방법 2. FlatList에서 제공하는 props 사용

#### 2-1. removeClippedSubviews

- 안드로이드에서는 `default`가 `true`입니다. 화면 밖에 불필요하게 렌더링되어 있는 요소들을 `unMount` 함으로써 최적화에 도움을 줍니다.

#### 2-2. keyExtractor

- 컴포넌트 리스트에서 컴포넌트의 순서가 바뀌거나 삭제되는 등의 작업을 할 때 최적화된 작업이 일어날 수 있도록 각 컴포넌트를 구분해주는 역할을 합니다.

#### 2-3. getItemLayout

- 리스트의 높이와 너비를 미리 확정할 수 있습니다. 이를 통해 각 아이템이 렌더링 될 때 레이아웃 계산 과정이 줄어들어 최적화에 도움이 됩니다.

#### 2-4 windowSize

- 현재 `viewport` 높이를 1로 잡고 아이템을 렌더링할 범위를 결정할 수 있습니다. 해당 범위 내에 있는 컴포넌트들은 렌더링을 시도하게 됩니다. 이 숫자를 줄임으로써 한번에 렌더링되는 컴포넌트의 숫자를 줄일 수 있습니다.

### 최적화 방법 3. [react-native-fast-image](https://github.com/DylanVann/react-native-fast-image)의 사용

- `FlatList`에서 빠른 속도로 스크롤을 하게 되면 한번에 많은 양의 이미지를 요청해야 하기 떄문에 결국 빠른 이미지 로딩이 중요합니다.
- `react-native-fast-image`를 사용하면 캐시 성능 및 전반적인 `Image` 컴포넌트의 퍼포먼스 개선으로 최적화에 도움을 줄 수 있습니다.
