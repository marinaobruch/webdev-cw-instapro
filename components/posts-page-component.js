import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, userPosts, getToken, user } from "../index.js";
import { getPosts, getUserPosts, deletePost, likeFetchFunc, dislikeFetchFunc } from "../api.js";
// import { formatDistance } from "date-fns";
// import { ru } from 'date-fns/locale'
import { correctDate } from "../helpers.js";

function initLikeButtons(page, token, data) {
  const likeButtonElements = document.querySelectorAll(".like-button");

  for (const likeButtonElement of likeButtonElements) {

    likeButtonElement.addEventListener("click", () => {

      let id = likeButtonElement.dataset.postId;

      if (likeButtonElement.dataset.liked === `false`) {
        // console.log("Лайк поставлен");
        likeFetchFunc({ id, token: getToken() }).then(() => {
          goToPage(page, data)
        }).catch((error) => {
          alert(error.message)
        })
      } else {
        // console.log("Лайк удален");
        dislikeFetchFunc({ id, token: getToken() }).then(() => {
          goToPage(page, data)
        }).catch((error) => {
          alert(error.message)
        })
      }
    })
  }
}

export function renderPostsPageComponent({ appEl, token }) {
  // console.log("Актуальный список постов:", posts);

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
  initLikeButtons(page, token, { notIsLoad: true });

}

export function renderUserPostComponent({ appEl, token, user }) {
  let postsUserHtml = userPosts.map((post) => {
    return `<li class="post-user">
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
            ${!user ? `` : `${user._id === post.user.id ? `            
            <div class="delete-button-main">
            <button class="delete-button" data-post-id="${post.id}">Удалить пост</button>
            </div>` : ``}`}
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
          <ul class="posts-user">
           ${postsUserHtml}
          </ul>
        </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });


  const page = USER_POSTS_PAGE;

  let data = {
    userId: userPosts[0]?.user.id
  }

  initLikeButtons(page, token, data);


  //Функция удаления комментария
  const deleteButtons = document.querySelectorAll(".delete-button");
  for (const deleteButton of deleteButtons) {
    let id = deleteButton.dataset.postId;
    deleteButton.addEventListener("click", () => {
      deletePost({
        id,
        token: getToken(),
      }).then(() => {
        console.log('Запись успешно удалена')
        goToPage(USER_POSTS_PAGE, data);
      })
    })
  };

}
