## FlatList 최적화

### 개요

`FlatList`에서 많은 양의 데이터를 불러올 때, 어떻게 최적화를 전행하는지 알아보고자 합니다.

### 최적화 방법 1. `memo`, `useCallback`의 사용

- `react-native` 프로젝트에서 [FlatList](https://github.com/facebook/react-native/blob/main/Libraries/Lists/FlatList.js#L297) 부분을 살펴보면 순수 컴포넌트로 되어 있는 것을 확인할 수 있습니다.
- 따라서 `FlatList`를 감싸고있는 부모 컴포넌트에서 내려주는 `props`들 중 부모 컴포넌트에서 정의하는 콜백함수들을 익명함수가 아닌 `useCallback`으로 감싸주면, 부모 컴포넌트의 렌더링으로 인한 `FlatList`의 불필요한 리렌더링을 줄일 수 있어 최적화에 도움이 됩니다.
- 또한 `FlatList`의 아이템이 되는 컴포넌트에 `memo`를 적용하여 순수 컴포넌트로 만들어주어, 불필요한 리렌더링을 방지할 수 있습니다.

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

- `SubView`(자식)가 `SuperView`(부모)의 영역과 겹치는 영역이 없다면 네이티브 계층 드로어에서 해당 SubView를 [제거(detach)](https://github.com/facebook/react-native/blob/main/React/Views/RCTView.m#L533-L552)합니다. 하지만 제거된 `SubView`의 메모리가 `deallocated` 되진 않습니다.

#### 2-2. keyExtractor

- 컴포넌트 리스트에서 컴포넌트의 순서가 바뀌거나 삭제되는 등의 작업을 할 때 최적화된 작업이 일어날 수 있도록 각 컴포넌트를 구분해주는 역할을 합니다. 또한 렌더링된 아이템의 높이를 저장하는 키로도 사용됩니다.

#### 2-3. getItemLayout

- 리스트의 높이와 너비를 미리 확정할 수 있습니다. `getItemLayout`이 제공되지 않으면 각 `Cell` 컴포넌트에 `onLayout` 함수가 [전달됩니다](https://github.com/facebook/react-native/blob/main/packages/virtualized-lists/Lists/VirtualizedListCellRenderer.js#L199-L203). `onLayout` 함수는 렌더링 되는 `Cell` 컴포넌트의 높이를 저장하고 리스트 정보를 갱신하는 [무거운 로직](https://github.com/facebook/react-native/blob/main/packages/virtualized-lists/Lists/VirtualizedList.js#L1175-L1208)을 수행합니다.
  이를 통해 각 아이템이 렌더링 될 때 레이아웃 계산 과정이 줄어들어 최적화에 도움이 됩니다.

#### 2-4 windowSize

- 현재 `viewport` 높이를 1로 잡고 아이템을 렌더링할 범위를 결정할 수 있습니다. 해당 범위 내에 있는 컴포넌트들은 렌더링을 시도하게 됩니다. 이 숫자를 줄임으로써 한번에 렌더링되는 컴포넌트의 숫자를 줄일 수 있습니다.

#### 2-5 maxToRenderPerBatch

- `FlatList` 내부에서 사용되고 있는 `VirtualizedList`의 `props`입니다. `batch` 당 렌더링될 아이템의 수를 조절할 수 있습니다.

#### 2-6 initialNumToRender

- 처음 렌더링할 `FlatList` 아이템의 개수를 조절할 수 있습니다. 디바이스 크기가 조금씩 다르므로, 한 화면에 들어갈 수 있는 아이템의 수도 달라질 수 있기 때문에 적절한 개수를 사용해야 합니다.

### 최적화 방법 3. [react-native-fast-image](https://github.com/DylanVann/react-native-fast-image)의 사용

- `FlatList`에서 `Render window`를 벗어난 컴포넌트는 언마운트됩니다. 언마운트된 컴포넌트는 다시 `Render window`에 들어왔을 때 마운트됩니다. `FlatList`의 자식 컴포넌트가 만약 이미지를 포함한다면 매번 새로운 네트워크 요청을 하게됩니다. `FastImage`를 적용하면 캐시된 이미지를 사용하여 불필요한 네트워크 요청을 건너뛰고, 빠른 이미지 로딩으로 `JS Thread`의 부하를 감소시킬 수 있습니다.
