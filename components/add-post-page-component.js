export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="form">
    <h3 class="form-title">Добавить пост</h3>
      <div class="form-inputs">
        <div class="uploan-image-container">
          <div class="upload-image">
          <label class="file-upload-label secondary-button">     
          Выберите фото
          </label>
          </div>
        </div>
        <label>
          Опишите фотографию:
          <textarea class="input-text textarea" rows="4"></textarea>
        </label>
        <button class="add-button" id="add-button">Добавить</button>
      </div>
  </div>
    `;


    appEl.innerHTML = appHtml;

    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick({
        description: "Описание картинки",
        imageUrl: "https://image.png",
      });
    });
  };

  render();
}
