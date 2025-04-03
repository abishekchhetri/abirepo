import { View } from './View';
import icons from 'url:../img/icons.svg';

class paginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', e => {
      const button = e.target.closest('.btn--inline');
      const pageNumber = +button.dataset.goto;
      handler(pageNumber);
    });
  }

  _generateMarkup() {
    const page = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    ); //math.ceil so that we uplift the data

    //page 1 and other pages
    if (this._data.pages === 1 && page > 1)
      return `
    <button data-goto = "${
      this._data.pages + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${this._data.pages + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;

    //last page
    if (this._data.pages === page && page > 1)
      return `
    <button data-goto = "${
      this._data.pages - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${this._data.pages - 1}</span>
  </button>`;

    //other pages
    if (this._data.pages < page)
      return `
    <button data-goto = "${
      this._data.pages - 1
    }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.pages - 1}</span>
          </button>
          <button data-goto = "${
            this._data.pages + 1
          }"  class="btn--inline pagination__btn--next">
            <span>Page ${this._data.pages + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
    `;

    // page1 and no other pages
    return 'single page result available';
    //code here
  }
}

export default new paginationView();
