# [Profiling](https://reactnative.dev/docs/profiling#profiling-android-ui-performance-with-systrace)

## **Profiling Android UI Performance with `systrace` ([링크](https://reactnative.dev/docs/profiling#profiling-android-ui-performance-with-systrace))[](https://reactnative.dev/docs/profiling#profiling-android-ui-performance-with-systrace)**

React Native에서 기본으로 제공하는 프로파일러 `systrace`를 사용하면 안드로이드 기기에 한해 UI Thread, JavaScript Thread, Native Modules Thread 등 프로세스에서 수행된 작업의 정보를 볼 수 있습니다.

아래 명령어를 수행해 지정한 시간동안 기기의 trace를 수집합니다.

- 기기 및 소프트웨어 정보: Galaxy S10+ / One UI 4.1 / Android 12

```jsx
$ <path_to_android_sdk>/platform-tools/systrace/systrace.py --time=5 -o trace.html sched gfx view -a <your_package_name>
```

trace 수집이 끝나고 생성된 html 파일을 브라우저로 열었는데요. 여러 프로세스 목록을 프레임 또는 시간 단위로 볼 수 있습니다.

![systraceexample-05b3ea44681d0291c1040e5f655fcd95](https://user-images.githubusercontent.com/29711964/203380322-46ef7099-ed1a-4e65-90e3-2005790645f3.png)

## 실제 안드로이드 앱에서 측정

성능을 측정하기 위해 android의 연산/레이아웃/드로우를 담당하는 UI Thread와 JavaScript가 실행되는 JS Thread(mqt_js or <…>)를 살펴봅니다.

아래는 최적화 전인 앱 화면에서 FlatList의 스크롤을 5초간 내리는동안 수집한 trace 결과입니다.

- UI Thread에서 Android 관련 메소드인 traversal, draw, Record 등의 수행이 잦게 일어나고 있습니다.

<img width="1258" alt="general" src="https://user-images.githubusercontent.com/29711964/203381201-cca475c1-d8f4-4ae3-8825-d0068d93d84d.png">

- JS Thread에서 DispatchEventsRunnable 호출 블록이 일어납니다. DispatchEvent는 이벤트를 받아 이벤트를 실행시키고 처리하는 일을 합니다.

<img width="862" alt="general_jsThread" src="https://user-images.githubusercontent.com/29711964/203381356-1a04b12a-4a4b-4073-ad35-7cb631ae8813.png">

최적화 전 후를 육안으로 비교하기 위해 앵글 범위를 넓혀 특정 프레임 구간을 보겠습니다. 눈에 띄는 구간(이상치)을 붉은색 영역으로 표시해 두었습니다.

0ms ~ 2500ms 구간 사이의 UI Thread 입니다.

<img width="1416" alt="최적화_전_ui스레드" src="https://user-images.githubusercontent.com/29711964/203381619-3f68d726-1106-49d0-ac41-9721e2a0f32b.png">

400ms ~ 1000ms 구간 사이의 JS Thread(mqt_js) 입니다.

<img width="626" alt="최적화_전_js스레드" src="https://user-images.githubusercontent.com/29711964/203381458-a7ea2edf-42bb-4172-bef8-59c35c5398b1.png">

## 최적화 이후 안드로이드 앱에서 측정

**이번엔 최적화 된 앱**에서 동일한 조건 아래에(시간, 행동, 대상 화면) systrace를 측정했습니다.

0ms ~ 2500ms 구간 사이의 UI Thread 입니다.

- 최적화 전보다 블록의 너비가 좁아 보입니다. 이는 작업 블록이 처음 시작되고 끝나기까지 시간이 단축되었다는 의미로 보입니다.

<img width="1436" alt="최적화_후_ui스레드" src="https://user-images.githubusercontent.com/29711964/203381696-a11f7026-8479-4e08-a4ef-6f2615df1f1c.png">

0ms ~ 1000ms 구간 사이의 JS Thread(mqt_js) 입니다.

- 이 스레드 또한 최적화 전과 비교할때 연산 블록의 너비가 좁아지고, 육안 차이가 미미하지만 호출 빈도가 줄었습니다.

<img width="646" alt="최적화_후_js스레드" src="https://user-images.githubusercontent.com/29711964/203381779-9755feef-2072-4b77-b462-8f43eed0e67d.png">
