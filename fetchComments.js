import { comments } from './index.js';
import { renderComments } from './renderComments.js';
import { getListComments } from './commentsList.js';
// import { getFetchComments } from './commentsList.js';


const loadElement = document.getElementById("loading");
const commentsArea = document.getElementById("comments-area");



export default function fetchComments(listComment) {
    return fetch("https://webdev-hw-api.vercel.app/api/v1/viktoria-kolosova/comments",
      {
        method: "GET",
      })
    .then((response) => {
      return response.json()
    }).then((responseData) => {
        console.log(responseData);
        comments = responseData.comments.map((comment) => {
        console.log(comment);
        console.log(listComment(comment));
           return listComment(comment); 
        });
        loadElement.style.display = "none";
        renderComments(commentsArea, getListComments);
      })
      .catch (() => {
        console.error(Error);
      })
  };