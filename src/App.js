import './App.css';
import {useEffect, useState} from "react";
import Router from "./router/Router";
import publicRoutes from "./router/Routes/publicRoutes";
import {getPrivateRoutes} from "./router/Routes";
import {useDispatch, useSelector} from "react-redux";
import {getUserInfo} from "./store/Reducers/authReducer";

function App() {
  const dispatch = useDispatch();
  const{token} = useSelector((state)=>state.auth);
  const [allRoutes,setAllRoutes] = useState([...publicRoutes]);

  //组件挂载后，执行一次 getRoutes()，得到私有路由的结构（包装在 / 路径下的 MainLayout 中），然后把它 追加 到 allRoutes 中。
  useEffect(() => {
    const privateRoutes = getPrivateRoutes()
    setAllRoutes([...allRoutes,privateRoutes])
  }, []);

  useEffect(() => {
    if(token){
      dispatch(getUserInfo());
    }
  },[token])

  return <Router allRoutes={allRoutes}/>
}

export default App;
