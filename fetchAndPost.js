import { nameInputHolder, commentInputHolder } from './index.js';
import fetchComments from './fetchComments.js';

const addCommentElement = document.getElementById("add-comment-button");
const nameElement = document.getElementById("name-input");
const commentElement = document.getElementById("comment-input");

const failedServer = "Сервер сломался, попробуй позже"
const failedInput = "В поле ввода должно быть минимум три символа"

export const fetchPost = (() => {
      fetch(
      "https://webdev-hw-api.vercel.app/api/v1/viktoria-kolosova/comments",
      {
        method: "POST",
        body: JSON.stringify({
          name: nameInputHolder(),
          text: commentInputHolder(),
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
          console.error(Error);
        }
        console.log(error);
      })
    });