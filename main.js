const { app, BrowserWindow, BrowserView, session } = require('electron');

function createWindow () {
    // Cria uma janela de navegação.  
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false
      }
    });

    const view = new BrowserView({
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
          }
    });
    win.setBrowserView(view);
    view.setBounds({ x: 0, y: 0, width: 800, height: 600 });
    view.webContents.loadURL(`https://superlogica.net/login?app_token=41ff683e-6928-37c6-a46d-b305e9fa4b8e&redirect_uri=index`);
    view.webContents.openDevTools();

    app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

    view.webContents.on("did-finish-load", () => {
        let currentURL = view.webContents.getURL();
        let stepLogin = currentURL.includes("app_token");

        console.log(currentURL);

        if (stepLogin && currentURL.includes("amp%3B")) {
            const newURL = currentURL.replace(/amp%3B/g, "");
            view.loadURL(newURL);
        }        

        let codeActive = currentURL.includes("state=ACTIVE");

        if (codeActive) {
          let code = currentURL.substring(currentURL.indexOf("code="));
          code = code.replace(/code=/g, "");
          view.loadURL(pagesManager.getURI(appDir, "authentication"));
        }        
    });
  }
  
  app.on("ready", () => {
    createWindow();
  })