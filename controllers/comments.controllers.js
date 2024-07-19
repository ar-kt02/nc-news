const {
   insertComment,
   removeCommentById,
   updateCommentById,
} = require("../models/comments.models");

exports.postComment = (request, response, next) => {
   const { article_id } = request.params;
   const { username, body } = request.body;

   insertComment(article_id, username, body)
      .then((comment) => {
         response.status(201).send({ comment });
      })
      .catch(next);
};

exports.deleteCommentById = (request, response, next) => {
   const { comment_id } = request.params;

   removeCommentById(comment_id)
      .then(() => {
         response.sendStatus(204);
      })
      .catch(next);
};

exports.patchCommentById = (request, response, next) => {
   const { comment_id } = request.params;
   const { inc_votes } = request.body;

   updateCommentById(comment_id, inc_votes)
      .then((comment) => {
         response.status(200).send({ comment });
      })
      .catch(next);
};
