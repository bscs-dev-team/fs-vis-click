# Dev Stack Setup

Notes on setting up the dev stack for `fs-vis-click`

1. Install nvm for windows
    https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows
    Download and run `nvm-setup.exe`
    Quit and restart VSCode to update paths for terminal window.

    `echo "lts/iron" > .nvmrc`
    `nvm install`

2. Install Parcel and React
    `npm i -S parcel`
    `npm i react react-dom`

    Add to `.gitignore`:
        `.parcel-cache/`

    Add to `.package.json`
    ```
    "source": "src/index.html",
    "scripts": {
        "start": "parcel",
        "build": "parcel build"
    },
    ```
    NOTE: We need to specify a public url of `.`
    so to allow for relative referencing of routes.
    See https://stackoverflow.com/questions/70259224/deploying-react-app-with-parcel-build-on-github-pages

3. Install Libraries
    `npm i -S immer`
    `npm i -S use-immer`
    `npm i -S csvtojson`
    `npm i -S @fortawesome/react-fontawesome`
    `npm i -S @fortawesome/fontawesome-svg-core`
    `npm i -S @fortawesome/free-solid-svg-icons`
    `npm i -S @fortawesome/free-regular-svg-icons`
    `npm i -S @fortawesome/free-brands-svg-icons`

4. Create basic structure
    Add `src/` folder
    Add `src/index.html` file

5. Start the dev server
    `npm start`

6. Set up SSH key

7. Set up github pages
    `npm i -S gh-pages`

    Make repo public if it isn't already -- needs to be public for gh-pages to work.

    Add to `.package.json`
    ```
    ...
    "scripts": {
        ...
        "predeploy" : "parcel build --public-url .",
        "deploy": "gh-pages -d dist -r https://bscs-dev-team:xxx@github.com/bscs-dev-team/fs-vis-click.git,
    },
    ```



# SSH Keys

Personal Acces Tokens are not great for gh-pages because they expire after 30 days.  It's better to set up a SSH Key.

1. Open a terminal.
2. Run `ssh-keygen -t ed25519 -C "devops@bscs.org"` and follow the prompts.
This generates a new SSH key using the Ed25519 algorithm. 
Add the SSH Key to GitHub.  Created file `~.ssh/bscs-dev-team` and `~.ssh/bscs-dev-team.pub`

3. Copy the contents of your new SSH key to your clipboard: `cat ~/.ssh/bscs-dev-team.pub`
Go to GitHub and log in.
Navigate to Settings -> SSH and GPG keys -> New SSH key.
Paste your key and give it a title.
Click Add SSH key.
Configure SSH for GitHub:

4. Ensure the SSH agent is running and add your key: 
`eval "$(ssh-agent -s)"`
`ssh-add ~/.ssh/bscs-dev-team`
Verify the ssh has been added
`ssh-add -l`
Test your connection: ssh -T git@github.com.

5. Fix Origin
`git remote set-url origin git@github.com:bscs-dev-team/fs-vis-click.git`


6. Specify SSH user
```
# ---------------------------
Host github.com-bscs-dev-team
        HostName github.com
        User git
        IdentityFile ~/.ssh/bscs-dev-team
        IdentitiesOnly yes
```


    
# Troubleshooting


#### `fatal: a branch named 'gh-pages' already exists`
Message displayed during `npm run deploy`.
Remove the `node_modules/.cache/gh-pages` folder.
e.g. `rm -rf node_modules/.cache/gh-pages `

#### `remote: Permission to git denied to...`
On Windows, issue might be git credentials maanger.
1. Hit "Windows" key
2. Start "Credentials Manager"
3. Search for `github` entries.
4. Remove old entries.

####
Invalid username or password.
fatal: Authentication failed for 'https://github.com/bscs-dev-team/fs-vis-click.git/'

####
`NODE_DEBUG=gh-pages npm run deploy` = > doesnt' work

#### npm run deploy errors
`libc++abi: terminating due to uncaught exception of type` `std::__1::system_error: mutex lock failed: Invalid argument`
`zsh: abort      npm run predeploy`
* do a good scrubbing:
    `rm -rf node_modules`
    `nvm use`
    `npm ci`
    `npm run build`
    `npm run predploy`
* check git authentication.  SSH is more reliable.

     
#### Parcel not building

If Parcel seems to not be refreshing after code changes,

`rm -rf .parcel-cache`