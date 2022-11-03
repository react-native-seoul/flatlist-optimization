export interface UseDataList<T> {
  (limit?: number): {
    data: T[];
    onLoadNext: () => void;
  };
}
