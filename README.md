# Redux

API 호출은 Component의 componentDidMount 시점에 합니다.  
Component에는 View만 보이도록 노력해야 합니다.  
**비동기 로직은 모두 Container에 맡기고, Component는 UI만 집중합시다.**