import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { Browser } from '@capacitor/browser';

async function initializeApp() {
  console.log('Nativefy: Initializing...');
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    Keyboard.addListener('keyboardWillShow', (info) => console.log('Keyboard show:', info.keyboardHeight));
    Keyboard.addListener('keyboardWillHide', () => console.log('Keyboard hide'));
    App.addListener('appStateChange', ({ isActive }) => console.log('App active:', isActive));
    App.addListener('backButton', ({ canGoBack }) => { if (!canGoBack) console.log('Back pressed'); });
    App.addListener('appUrlOpen', (event) => console.log('URL:', event.url));
    await SplashScreen.hide({ fadeOutDuration: 500 });
    console.log('Nativefy: Ready');
  } catch (error) {
    console.error('Nativefy error:', error);
    await SplashScreen.hide();
  }
}

function setupExternalLinkHandler() {
  document.addEventListener('click', async (event) => {
    const target = event.target as HTMLAnchorElement;
    if (target.tagName === 'A' && target.href) {
      const url = new URL(target.href);
      if (url.origin !== window.location.origin && !target.href.startsWith('javascript:')) {
        event.preventDefault();
        await Browser.open({ url: target.href });
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupExternalLinkHandler();
});
