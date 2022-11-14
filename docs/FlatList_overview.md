# FlatList overview

### 데이터 렌더링과 가상화

React-Native 에서는 데이터를 렌더링할때, ScrollView 와 map 함수를 사용하여 스크롤이 되는 리스트를 렌더링할 수 있습니다.

```jsx
import {ScrollView, Text, View} from 'react-native';

const data = [
  {id: '0', text: 'text-0'},
  {id: '1', text: 'text-1'},
  {id: '2', text: 'text-2'},
  {id: '3', text: 'text-3'},
];

const App = () => {
  return (
    <ScrollView>
      {data.map(item => {
        return <Children key={item.id} item={item} />;
      })}
    </ScrollView>
  );
};

const Children = item => {
  return (
    <View>
      <Text>{item.text}</Text>
    </View>
  );
};
```

얼마 되지않는 양의 데이터를 위와같은 방식으로 렌더링하는건 큰 문제가 되지 않습니다.
하지만 데이터의 양이 많아지고 표현해야 할 UI가 복잡해지면, 렌더링을 해야 할 컴포넌트가 많아질수록 메모리 사용량이 비례하여 증가하게 됩니다.
추가적으로 이미지나 동영상이라도 포함되게 되면 그 부하는 기하 급수적으로 증가합니다.

그러면 이 문제를 어떻게 해결할 수 있을까요? 바로 실제로 유저가 보고있는 부분만을 렌더링하고, 보이지 않는 부분은 렌더링하지 않는 `가상화 목록`을 적용하면 해결할 수 있습니다.
React-Native 에서는 가상화 목록(VirtualizedList) 컴포넌트로 래핑된 `FlatList` 컴포넌트를 제공해서 이 문제를 해결하고 있습니다.

### Virtualized List 의 가상화

React-Native 의 가상화 목록 컴포넌트는 위에서 간략하게 설명했듯이 실제로 보이는 부분만을 렌더링하고, 보이지 않는 부분은 렌더링을 생략하고 있습니다.
ScrollView 컴포넌트의 children(items) 이 렌더링 되고 스크롤을 할 때 각 아이템의 높이와 위치, 그리고 현재 스크롤 정보를 기반으로 렌더링이 될 아이템의 범위를 계산하고 렌더링 합니다.
계산해서 렌더링 영역을 벗어나는 위치에 있는 item 들은 언마운트 되고, 영역의 높이 만큼의 빈 View 가 렌더링 됩니다.

```tsx
// 2b. Add cells and spacers for each item
if (itemCount > 0) {
  _usedIndexForKey = false;
  _keylessItemComponentName = '';
  const spacerKey = this._getSpacerKey(!horizontal); // 'width' | 'height'

  const renderRegions = this.state.renderMask.enumerateRegions();
  const lastSpacer = findLastWhere(renderRegions, r => r.isSpacer);

  for (const section of renderRegions) {
    if (section.isSpacer) {
      // Legacy behavior is to avoid spacers when virtualization is
      // disabled (including head spacers on initial render).
      if (this.props.disableVirtualization) {
        continue;
      }

      // Without getItemLayout, we limit our tail spacer to the _highestMeasuredFrameIndex to
      // prevent the user for hyperscrolling into un-measured area because otherwise content will
      // likely jump around as it renders in above the viewport.
      const isLastSpacer = section === lastSpacer;
      const constrainToMeasured = isLastSpacer && !this.props.getItemLayout;
      const last = constrainToMeasured
        ? clamp(
            section.first - 1,
            section.last,
            this._highestMeasuredFrameIndex,
          )
        : section.last;

      const firstMetrics = this.__getFrameMetricsApprox(
        section.first,
        this.props,
      );
      const lastMetrics = this.__getFrameMetricsApprox(last, this.props);
      const spacerSize =
        lastMetrics.offset + lastMetrics.length - firstMetrics.offset;
      cells.push(
        <View
          key={`$spacer-${section.first}`}
          style={{[spacerKey]: spacerSize}}
        />,
      );
    } else {
      this._pushCells(
        cells,
        stickyHeaderIndices,
        stickyIndicesFromProps,
        section.first,
        section.last,
        inversionStyle,
      );
    }
  }
}
```

### 가상화로 인해서 생기는 문제점들

- Render window 를 벗어난 컴포넌트는 언마운트시키고, 빈 뷰를 렌더링

  - 컴포넌트의 상태가 유지되지 않음
    - 공식문서: 유지되어야 하는 상태는 External Store(redux, recoil...) 에서 관리하라고 권장.
  - 외부에서 이미지를 가져오는 이미지 컴포넌트의 경우, 마운트되면 다시 네트워크 요청을 하고 새롭게 렌더링을 시작
    - 공식문서: FastImage(이미지 캐시) 를 사용해서 네트워크 요청을 줄이고 빠른 로딩으로 JS Thread 의 부하 감소를 권장.
  - 스크롤을 빠르게 할 경우, 공백의 빈영역이 렌더링 됨 (Blank areas)
    - 공식문서: 컴포넌트 내의 로직과 중첩된 뷰를 줄이고, 경량화된 이미지를 사용하는 등 최대한 컴포넌트를 가볍게 만들것을 권장.

- FlatList 컴포넌트 리렌더링 되면 무거운 가상화 계산 로직이 실행되고, 내부의 cell 들 또한 리렌더링
  - 공식문서: Pure component 로 FlatList 를 제공하고, useCallback 사용(익명 함수 지양) 을 권장.
  - 공식문서: `shouldUpdateComponent`, `PureComponent`, `memo` 등의 컴포넌트 업데이트 최적화를 권장.
