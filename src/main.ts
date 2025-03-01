import { SceneManager } from './AppManager';

(async () => {
  const app = new SceneManager();
  await app.initialize();
})();
