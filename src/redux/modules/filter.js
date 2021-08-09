// 액션 타입 정의
export const SHOW_ALL = '/redux_basic/filter/SHOW_ALL';
export const SHOW_COMPLETED = '/redux_basic/filter/SHOW_COMPLETED';

// 액션 생성 함수
export function showAll() {
  return { type: SHOW_ALL };
}

export function showCompleted() {
  return { type: SHOW_COMPLETED };
}

// 초기값
const initialState = 'ALL';

// 리듀서
export default function reducer(prevState = initialState, action) {
  if (action.type === SHOW_ALL) {
    return 'ALL';
  }

  if (action.type === SHOW_COMPLETED) {
    return 'COMPLETED';
  }
  return prevState;
}
