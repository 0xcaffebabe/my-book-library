import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
  ipcMain,
} from 'electron';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {

    const templateDefault: DarwinMenuItemConstructorOptions[] = [
      {
        label: '&导航',
        submenu: [
          {
            label: '&后退',
            accelerator: 'Command+B',
            click: () => {
              BrowserWindow.getAllWindows()[0].webContents.send("back-action")
            }
          },
        ],
      },
      {
        label: '&截图',
        accelerator: 'Command+S',
        click: () => {
          BrowserWindow.getAllWindows()[0].webContents.send("screenshot-action")
        }
      },
      {
        label: '&视图',
        submenu: [
          {
            label: '&护眼模式',
            accelerator: 'Command+E',
            click: () => {
              BrowserWindow.getAllWindows()[0].webContents.send("eyes-mode-action")
            }
          },
          {
            label: '&目录',
            accelerator: 'Option+C',
            click: () => {
              BrowserWindow.getAllWindows()[0].webContents.send("category-action")
            }
          },
          {
            label: '&全屏',
            accelerator: 'F11',
            click: () => {
              BrowserWindow.getAllWindows()[0].setFullScreen(!BrowserWindow.getAllWindows()[0].isFullScreen())
            }
          },
        ]

      },
      {
        label: '&开发',
        submenu: [
          {
            label: '&开发者工具',
            accelerator: 'Command+Shift+I',
            click: () => {
              BrowserWindow.getAllWindows()[0].webContents.toggleDevTools();
            }
          }
        ]
      }
    ];

    return templateDefault;
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&导航',
        submenu: [
          {
            label: '&后退',
            accelerator: 'Ctrl+B',
            click: () => {
              BrowserWindow.getAllWindows()[0].webContents.send("back-action")
            }
          },
        ],
      },
      {
        label: '&截图',
        accelerator: 'Ctrl+S',
        click: () => {
          BrowserWindow.getAllWindows()[0].webContents.send("screenshot-action")
        }
      },
      {
        label: '&视图',
        submenu: [
          {
            label: '&护眼模式',
            accelerator: 'Ctrl+E',
            click: () => {
              BrowserWindow.getAllWindows()[0].webContents.send("eyes-mode-action")
            }
          },
          {
            label: '&目录',
            accelerator: 'Alt+C',
            click: () => {
              BrowserWindow.getAllWindows()[0].webContents.send("category-action")
            }
          },
          {
            label: '&全屏',
            accelerator: 'F11',
            click: () => {
              BrowserWindow.getAllWindows()[0].setFullScreen(!BrowserWindow.getAllWindows()[0].isFullScreen())
            }
          },
        ]
      },
      {
        label: '&开发',
        submenu: [
          {
            label: '&开发者工具',
            accelerator: 'Ctrl+Shift+I',
            click: () => {
              BrowserWindow.getAllWindows()[0].webContents.toggleDevTools();
            }
          }
        ]
      }
    ];

    return templateDefault;
  }
}
