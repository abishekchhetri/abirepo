import { View } from './View';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _successMessage = 'Recipe was uploaded Sucessfully!';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this.addHandlerShowWindow();
    this.addHandlerHideWindow();
  }

  _toggleHandler() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this._toggleHandler.bind(this));
  }

  addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this._toggleHandler.bind(this));
    this._overlay.addEventListener('click', this._toggleHandler.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.upload__btn');
      if (!btn) return;
      const dataArr = [...new FormData(this)];
      const dataObj = Object.fromEntries(dataArr);
      handler(dataObj);
    });
  }
  _generateMarkup() {}
}

export default new AddRecipeView();
