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

6. Set up personal access token
    1. Go to account (upper right) and select "settings"
    2. Go to "Developer SEttings" -- https://github.com/settings/tokens
    3. Go to Personal access tokens
    4. Go to "Tokens (classic)
    5. Go to "Generate a new Token (classic)
        --  Set expiration to 6/30/2025
        --  Check all "repo" permissions
    6. Copy the PAT (get code from package.json `deploy` script)
        `git remote set-url origin https://bscs-dev-team:xxx@github.com/bscs-dev-team/fs-vis-click.git`
    7. Update deployment script
        `"deploy": "gh-pages -d dist -r https://bscs-dev-team:xxx@github.com/bscs-dev-team/fs-vis-click.git"`

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



### set origin
https://bscs-dev-team@github.com/bscs-dev-team/fs-vis-click.git

    NOTE: with GitHub Desktop you might need to set the "Repository -> Repository Settings -> Git config" to "Use a local Git config" with "bscs-dev-team" as the user.


    
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
* generate a new Personal Access Token
    1. Go to account (upper right) and select "settings"
    2. Go to "Developer SEttings" -- https://github.com/settings/tokens
    3. Go to Personal access tokens
    4. Go to "Tokens (classic)
    5. Go to "Generate a new Token (classic)
        --  Set expiration to 6/30/2025
        --  Check all "repo" permissions
    6. Copy the PAT
        `git remote set-url origin https://bscs-dev-team:xxx@github.com/bscs-dev-team/fs-vis-click.git`
    7. Update deployment script
        `"deploy": "gh-pages -d dist -r https://bscs-dev-team:xxx@github.com/bscs-dev-team/fs-vis-click.git"`
    


    
    
    