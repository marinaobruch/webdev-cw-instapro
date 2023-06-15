import { addPost } from "../api.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { renderHeaderComponent } from "./header-component.js";
import { getToken } from "../index.js";
import { replaceValue } from "../helpers.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {

  let imageUrl = "";

  const render = () => {
    const appHtml = `
        <div class="page-container">
          <div class="header-container"></div>  
            <div class="form">
              <h3 class="form-title">Добавить пост</h3>
                <div class="form-inputs">
                  <div class="upload-image-container"></div>
                    <label>
                      Опишите фотографию:
                      <textarea id="input-text" class="input-text textarea" rows="4"></textarea>
                    </label>
                    <button class="add-button" id="add-button">Добавить</button>
                </div>
            </div>
          </div>    
        </div>
      `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    document.getElementById("add-button").addEventListener("click", () => {

      const description = replaceValue(document.getElementById("input-text").value);

      if (description === "") {
        alert("Добавьте описание");
        return;
      }

      if (imageUrl === "") {
        alert("Добавьте изображение");
        return;
      }

      addPost({
        token: getToken(),
        description: description,
        imageUrl: imageUrl,
      });
      onAddPostClick();
    });
  };
  render();
};