import { nameInputHolder, commentInputHolder, updateComments, formatDate } from './index.js';
import { renderComments } from './renderComments.js';
import { getListComments } from './commentsList.js';
// import { getFetchComments } from './commentsList.js';


const loadElement = document.getElementById("loading");
const commentsArea = document.getElementById("comments-area");

const transformComments = (comment) => {
  return {
      name: comment.author.name,
      date: formatDate(comment.date),
      text: comment.text,
      likes: comment.likes,
      isLiked: comment.isLiked,
      isLikeLoading: comment.isLiked,
    }
}

export default function fetchComments() {
    return fetch("https://webdev-hw-api.vercel.app/api/v1/viktoria-kolosova/comments",
      {
        method: "GET",
      })
    .then((response) => {
      return response.json()
    }).then((responseData) => {
        console.log(responseData);
        const newComments = responseData.comments.map((comment) => {
        console.log(comment);
        console.log(transformComments(comment));
           return transformComments(comment); 
        });
        updateComments(newComments);
        loadElement.style.display = "none";
        // window.scrollTo(0, 0);
        renderComments(commentsArea, getListComments);
      })
      .catch (() => {
        console.error(error);
      })
  };


