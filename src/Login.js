export default function Login({ fs, setFs }) {

  function handleLoginToggle() {
    setFs(draft => {
      const user = draft.user;
      if (user.isLoggedIn) {
        user.isLoggedIn = false;
        user.userName = null;
      } else {
        user.isLoggedIn = true;
        user.userName = 'bentbloh@gmail.com';
      }
    });
  };

  return (
    <div className="login">
      {fs.user.isLoggedIn
        ? <button onClick={handleLoginToggle}>{fs.user.userName}</button>
        : <button onClick={handleLoginToggle}>Login</button>
      }
    </div >
  )
}
