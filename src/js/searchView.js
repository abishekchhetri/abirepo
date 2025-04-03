class searchView {
  #parentEl = document.querySelector('.search__field');
  #button = document.querySelector('.search__btn');

  #clearInput() {
    this.#parentEl.value = '';
  }
  getQuery() {
    const query = this.#parentEl.value;
    this.#clearInput();
    return query;
  }
  addHandlerSearch(handle) {
    this.#button.addEventListener('click', e => {
      e.preventDefault();
      handle();
    });
  }
}
export default new searchView();
