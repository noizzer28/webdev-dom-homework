import { replyCommentsListener, likeCountButtonListener, comments } from "./index.js";


  const renderComments = (elementHTML, listComments) => {
    const commentsHtml = comments.map((comment, index) => {
      return listComments(comment, index);
    }).join('');
    elementHTML.innerHTML = commentsHtml;
    likeCountButtonListener();
    replyCommentsListener();
  }

export {renderComments};