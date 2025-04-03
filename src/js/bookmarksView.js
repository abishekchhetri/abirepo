import { View } from './View';
import previewView from './previewView';

class bookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet! find nice recipe and bookmark it';

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return this._data.map(val => previewView.render(val, false)).join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', function (e) {
      handler();
    });
  }
}
export default new bookmarksView();
