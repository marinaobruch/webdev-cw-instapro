import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, userPosts, getToken } from "../index.js";
import { correctDate } from "../helpers.js";
import { getPosts, getUserPosts, deletePost, likeFetchFunc, dislikeFetchFunc } from "../api.js";

const initLikeButtons = () => {
  const likeButtonElements = document.querySelectorAll(".like-button")
  for (const likeButtonElement of likeButtonElements) {
    likeButtonElement.addEventListener("click", () => {

    })
  }
}

export function renderPostsPageComponent({ appEl, token }) {
  console.log("Актуальный список постов:", posts);

  //  TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
  //  можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow

  const postsHtml = posts.map((post) => {
    return `<li class="post">
    <div class="post-header" data-user-id=${post.user.id}>
        <img src="${post.user.imageUrl}" class="post-header__user-image">
        <p class="post-header__user-name">${post.user.name}</p>
    </div>
    <div class="post-image-container">
      <img class="post-image" src="${post.imageUrl}">
    </div>
    <div class="post-likes">
      <button data-post-id="${post.id}" data-liked="${post.isLiked}" class="like-button">
      ${post.isLiked ? `<img src="./assets/images/like-active.svg">` : `<img src="./assets/images/like-not-active.svg">`}
      </button>
      <p class="post-likes-text">
        Нравится: 
        <strong>  ${post.likes.length === 0
        ? 0
        : post.likes[post.likes.length - 1].name + ((post.likes.length > 1) ? ' и ещё ' + (post.likes.length - 1) : '')}
        </strong>
      </p>
    </div>
    <p class="post-text">
      <span class="user-name">${post.user.name}</span>
      ${post.description}
    </p>
    <p class="post-date">
    ${correctDate(post.createdAt)}
    </p>
  </li>`
  }).join('');

  const appHtml = `
        <div class="page-container">
          <div class="header-container"></div>
          <ul class="posts">
           ${postsHtml}
          </ul>
        </div>`;

  appEl.innerHTML = appHtml;

  initLikeButtons();

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
  const page = POSTS_PAGE;
}




export function renderUserPostComponent({ appEl, token, user }) {

  let postsUserHtml = userPosts.map((post) => {
    return `<li class="post">
          <div class="post-header post-header-userPage" data-user-id=${post.user.id}>
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
          </div>

          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          
          <div class="footer-post">
            <div class="post-likes">
                <button data-post-id="${post.id}" data-liked="${post.isLiked}" class="like-button">
                  ${post.isLiked ? `<img src="./assets/images/like-active.svg">` : `<img src="./assets/images/like-not-active.svg">`}
                </button>
                <p class="post-likes-text">
                Нравится: 
                  <strong>  ${post.likes.length === 0
        ? 0
        : post.likes[post.likes.length - 1].name + ((post.likes.length > 1) ? ' и ещё ' + (post.likes.length - 1) : '')}
                  </strong>
                  </p>
            </div>

            <div class="delete-button-main">
            <button class="delete-button" data-post-id="${post.id}">Удалить пост</button>
            </div>

          </div>

          <p class="post-text">
            <span class="user-name">${post.user.name}</span>
            ${post.description}
          </p>
          <p class="post-date">
          ${correctDate(post.createdAt)}
          </p>
        </li>`
  }).join('');

  const appHtml = `
        <div class="page-container">
          <div class="header-container"></div>
          <ul class="posts">
           ${postsUserHtml}
          </ul>
        </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  //Функция удаления комментария
  if (!user) {
    const deleteButtons = document.querySelectorAll(".delete-button");
    for (const deleteButton of deleteButtons) {
      deleteButton.setAttribute('disabled', '');
      deleteButton.classList.add("disabled");
    }
  }

  if (user) {
    let deleteButtons = document.querySelectorAll(".delete-button");

    for (const deleteButton of deleteButtons) {
      deleteButton.addEventListener("click", () => {

        let id = deleteButton.dataset.postId;

        deletePost({
          id,
          token: getToken(),
        }).then(() => {
          console.log('Запись успешно удалена')
        })
      })
    };
  }
  const page = USER_POSTS_PAGE;
}
