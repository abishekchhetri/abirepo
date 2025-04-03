import icons from '../img/icons.svg';
export class View {
  _data;

  render(renderData, boolean = true) {
    //from model to the view directly data flow
    // console.log(renderData);

    if (
      this.renderData ||
      (Array.isArray(renderData) && renderData.length === 0)
    )
      return this.renderError();

    this._data = renderData;
    const markup = this._generateMarkup();

    //we are actually returning the markup inorder to
    if (!boolean) return markup;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(renderData) {
    //updating only the text content
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElement = Array.from(newDom.querySelectorAll('*'));

    const currElement = Array.from(this._parentEl.querySelectorAll('*'));

    newElement.forEach((newEl, idx) => {
      const curr = currElement[idx];
      if (
        newEl.firstChild &&
        !newEl.isEqualNode(curr) &&
        newEl.firstChild.nodeValue.trim() !== ''
      ) {
        curr.textContent = newEl.textContent;
      }

      //updating the data attribute
      if (!newEl.isEqualNode(curr)) {
        Array.from(newEl.attributes).forEach(attr => {
          curr.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
  _clear() {
    this._parentEl.innerHTML = '';
  }
  //render the error message to the ui
  renderError(message = this._errorMessage) {
    const html = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }

  //render the success message
  renderSuccess(message = this._successMessage) {
    const html = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }

  renderSpinner() {
    this._clear();
    const html = `
    <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
          `;
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }
}
