import { useState } from 'react';

const App = () => {

  const initForm = {
    email: '',
    password: '',
  };

  const initUsers = [];

  const [ form, setForm ] = useState(initForm);
  const [ users, setUsers ] = useState(initUsers);

  const inputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  let responseText = '';

  const formSubmit = async () => {
    try {
      let res = await fetch(
        '/api/v1/auth/login',
        {
          method: 'post',
          body: JSON.stringify(form),
          headers: {
            'content-type': 'application/json'
          }
        }
      );
  
      let responseText = await res.text();
      let responseJSON = JSON.parse(responseText);

      console.log(responseJSON);
      localStorage.setItem('jwt', responseJSON.jwt);
      
    } catch(err) {
      console.log('Login error');
    }
  };

  const getUsers = async () => {
    try {
      let res = await fetch(
        '/api/v1/users',
        {
          method: 'get',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        }
      );
      let data = await res.json();
      console.log(data);
      setUsers(data);
    } catch(err) {
      console.log(err);
    }
  };

  return (
    [
      <div className="form">
        <label>
          <span>Username</span>
          <input type="text" name="email" value={form.email} onChange={inputChange}/>
        </label>
        <label>
          <span>Password</span>
          <input type="password" name="password" value={form.password} onChange={inputChange}/>
        </label>
        <button onClick={formSubmit}>Log In</button>
      </div>,
      <hr/>,
      <div className="data">
        <button onClick={getUsers}>Get Users</button>
        <br/>
        <table border="1">
          <tr>
            <th>email</th>
            <th>password</th>
          </tr>
          {
            users.map(u => {
              return (
                <tr key={u._id}>
                  <td>{u.email}</td>
                  <td>{u.password}</td>
                </tr>
              );
            })
          }
        </table>
      </div>
    ]
  );
}

export default App;
