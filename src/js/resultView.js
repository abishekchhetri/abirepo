import { View } from './View';
import previewView from './previewView';

class resultView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'Recipe not found !';

  _generateMarkup() {
    const id = window.location.hash.slice(1);

    return this._data.map(val => previewView.render(val, false)).join('');
  }

  // _generateMarkupPreview(val) {
  //   const id = window.location.hash.slice(1);

  //   return `  <li class="preview">
  //           <a class="preview__link ${
  //             val.id === id ? 'preview__link--active' : ''
  //           }" href="#${val.id}">
  //             <figure class="preview__fig">
  //               <img src="${val.image}" alt="Test" />
  //             </figure>
  //             <div class="preview__data">
  //               <h4 class="preview__title">${val.title}</h4>
  //               <p class="preview__publisher">${val.publisher}</p>
  //             </div>
  //           </a>
  //         </li>`;
  // }
}
export default new resultView();
