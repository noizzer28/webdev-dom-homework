"use strict";
import {renderComments} from "./renderComments.js";
import { getListComments } from "./commentsList.js";
import fetchComments from "./fetchComments.js";

  const commentsArea = document.getElementById("comments-area");
  const nameElement = document.getElementById("name-input");
  const commentElement = document.getElementById("comment-input");
  const addCommentElement = document.getElementById("add-comment-button");
  const removeCommentElement = document.getElementById("delete-comment-button");
 

  export function formatDate(inputDate) {
    const commentDate = new Date(inputDate);
    const options = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return commentDate.toLocaleDateString('ru-RU', options);
  }

  export let comments = [];

//  function fetchComments() {
//     return fetch("https://webdev-hw-api.vercel.app/api/v1/viktoria-kolosova/comments",
//       {
//         method: "GET",
//       })
//     .then((response) => {
//       return response.json()
//     }).then((responseData) => {
//         console.log(responseData);
//         comments = responseData.comments.map((comment) => {
//           return {
//             name: comment.author.name,
//             date: formatDate(comment.date),
//             text: comment.text,
//             likes: comment.likes,
//             isLiked: comment.isLiked,
//             isLikeLoading: comment.isLiked,
//           }
//         });
//         loadElement.style.display = "none";
//         renderComments(commentsArea, getListComments);
//       })
//       .catch (() => {
//         console.error("Failed to load, check your connection")
//       })
//   };

  // Обработчик лайков
  export const likeCountButtonListener = () => {
    const likeButtonElements = document.querySelectorAll('.like-button');
    for (const likeButtonElement of likeButtonElements) {
      likeButtonElement.addEventListener('click', () => {
        event.stopPropagation();
        let index = likeButtonElement.dataset.index;
        comments[index].isLikeLoading = true;
        renderComments(commentsArea, getListComments);
        delay(1000).then(() => {
          if (comments[index].isLiked == false) {
          comments[index].likes++;
          comments[index].isLiked = true;
        } else {
          comments[index].likes--;
          comments[index].isLiked = false;
        }
        comments[index].isLikeLoading = false;
        renderComments(commentsArea, getListComments);
        })

      })
    }
  }
  

  // Ответ на комментарий
  export const replyCommentsListener = () => {
    const replyButtonElements = document.querySelectorAll('.comment');
    for (const replyButtonElement of replyButtonElements) {
      replyButtonElement.addEventListener('click', () => {
        let index = replyButtonElement.dataset.index;
        commentElement.value = `Quote_start${comments[index].name}: New_line ${comments[index].comment} Quote_end`
        renderComments(commentsArea, getListComments);
      })
    }

  }
    
  const getFetchComments = (comment) => {
    return {
        name: comment.author.name,
        date: formatDate(comment.date),
        text: comment.text,
        likes: comment.likes,
        isLiked: comment.isLiked,
        isLikeLoading: comment.isLiked,
      }
}
  fetchComments(getFetchComments);
  replyCommentsListener();
  likeCountButtonListener();
  renderComments(commentsArea, getListComments);



  function delay(interval = 300) {
      return new Promise((resolve) => {
        
        setTimeout(() => {
          resolve();
        }, interval);
      });
    };






  // Удаляет последний комментарий
  removeCommentElement.addEventListener("click", () => {
    comments.splice(-1);
    renderComments();
  })

  // Выключает кнопку при пустых инпутах
  window.addEventListener('input', () => {
    if (nameElement.value === "" || commentElement.value === "") {
      addCommentElement.disabled = true;
    } else {
      addCommentElement.disabled = false;
    }
  });

  // Кнопка Enter
  window.addEventListener('keyup', () => {
    if (event.key === 'Enter') {
      addCommentElement.click();
    }
  });


  // Отправка комментариев
  addCommentElement.addEventListener("click", () => {
    nameElement.classList.remove("validation");
    commentElement.classList.remove("validation");

    if (nameElement.value == "" && commentElement.value == "") {
      nameElement.classList.add("validation");
      commentElement.classList.add("validation");
      return;
    } else if (commentElement.value == "") {
      commentElement.classList.add("validation");
      return;
    } else if (nameElement.value == "") {
      nameElement.classList.add("validation");
      return;
    };

    addCommentElement.disabled = true;
    addCommentElement.textContent = "Данные загружаются..."
    const failedServer = "Сервер сломался, попробуй позже"
    const failedInput = "В поле ввода должно быть минимум три символа"
    const fetchPost = (() => {
      fetch(
      "https://webdev-hw-api.vercel.app/api/v1/viktoria-kolosova/comments",
      {
        method: "POST",
        body: JSON.stringify({
          name: nameElement.value,
          text: commentElement.value,
          forceError: true,
        })
      })
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 500) {
          return Promise.reject(new Error(failedServer));
        } else {
          return Promise.reject(new Error(failedInput));
          console.log(failedInput);
        }
      })
      .then((responseJson) => {
        console.log(responseJson);
        addCommentElement.disabled = false;
        addCommentElement.textContent = "Отправить"
        fetchComments();
        nameElement.value = "";
        commentElement.value = "";
      })
      .catch((error) => {
        if (error.message == failedServer) {
          alert(error);
          fetchPost();
        } else if (error.message == failedInput){
          addCommentElement.disabled = false;
          addCommentElement.textContent = "Отправить"
          alert(error);
        } else {
          addCommentElement.disabled = false;
          addCommentElement.textContent = "Попробуй еще раз"
          alert("Кажется, у вас сломался интернет, попробуйте позже");
        }
        console.log(error);
      })
    });
    fetchPost();
  });


  
