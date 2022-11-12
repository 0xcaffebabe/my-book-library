import { createRoot } from 'react-dom/client';
import App from './App';
import StoreService from 'services/StoreService';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

// 还原pdf历史记录
// var originalSetItem = localStorage.setItem;
// localStorage.setItem = (key: string, value: string) => {
//     console.log(111)
//     StoreService.newInstance().saveFile(key, value)
//     originalSetItem(key, value)
// }

// calling IPC exposed from preload script
// window.electron.ipcRenderer.once('ipc-example', (arg) => {
//   // eslint-disable-next-line no-console
//   console.log(arg);
// });
// window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
