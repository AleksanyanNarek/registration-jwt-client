import { useContext, useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import { Context } from '.';
import { observer } from "mobx-react-lite";
import UserService from "./services/UserService";

function App() {
  const {store} = useContext(Context);  

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if(localStorage.getItem('accessToken')) {
      store.checkAuth();
    }
  }, []);

  const getUsers = async () => {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);

    } catch (e) {
      console.log(e.message)
    }
  }

  if(store.isLoading){
    return (
      <div>Loading...</div>
    )
  }

  if(!store.isAuth){
    return (
      <div>
        <h1>{store.isAuth ? `user authorized ${store.user.email}` : 'you not authorized' }</h1>
        <LoginForm />
        <div>
          <button onClick={getUsers}>get users</button>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <h1>{`user authorized ${store.user.email}`}</h1>
      <h1>{store.user.isActivated ? 'account confirmed by mail' : 'account not confirmed by mail' }</h1>
      <button onClick={() => store.logout()} >Log out</button>
      <div>
        <button onClick={getUsers}>get users</button>
      </div>
      {users?.map(user => {
        return <div key={user._id}>{user.email}</div>
      })}
    </div>
  );
}

export default observer(App);