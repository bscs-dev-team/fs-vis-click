import './NotLoggedIn.css';

export default function NotLoggedIn({ fs, setFs }) {

  function evt_Login() {
    setFs(draft => {
      const user = draft.user;
      user.isLoggedIn = true;
      user.userName = 'bentbloh@gmail.com';
    });
  };

  evt_OnExit = (event) => {
    setFs(draft => {
      draft.editWithoutSaving = true;
    });
  }

  /// COMPONENT RENDER ////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  return (
    <div>
      <div className="screen"></div>
      <div className="NotLoggedIn">
        <h3>LOG IN TO SAVE</h3>
        <p>You are not currently logged in.</p>
        <p>You can create, view, and modify your exploration but your changes will not be saved.</p>
        <p>You can <a href>log in</a> or <a href>register</a> at any time.  Once you've logged in or registered you can  save your exploration.</p>
        <div className="controlbar">
          <button onClick={evt_Login}>Login</button>
          <button onClick={evt_OnExit}>Continue to edit without saving</button>
        </div>
      </div>
    </div >
  )
}