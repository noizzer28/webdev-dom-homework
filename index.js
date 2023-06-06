"use strict";
import {renderComments} from "./renderComments.js";
import { getListComments } from "./commentsList.js";
import fetchComments from "./fetchComments.js";
import {fetchPost} from "./fetchAndPost.js";

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
  export function updateComments(newComment) {
    comments = newComment;
  }

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
    


  fetchComments();
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
    renderComments(commentsArea, getListComments);
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

  export  function nameInputHolder() {
     const nameInput = nameElement.value;
     return nameInput;
  }

  export function commentInputHolder() {
    const commentInput = commentElement.value;
    return commentInput;
  }
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
    fetchPost();
  });


  
