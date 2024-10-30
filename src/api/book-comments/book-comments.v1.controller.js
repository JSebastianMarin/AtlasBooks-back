import { HTTP_CODES } from "../../helpers/httpCodes.js";

export default class BookCommentsController {
  #bookCommentsService;

  constructor({ bookCommentsService }) {
    this.#bookCommentsService = bookCommentsService;

    this.createCommentOfBook = this.createCommentOfBook.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  async createCommentOfBook(req, res) {
    const { text, bookId } = req.body;
    const { id: userId } = req.user;

    const newComment = await this.#bookCommentsService.createCommentOfBook(
      text,
      bookId,
      userId
    );

    res.formatResponse(
      newComment,
      "Comment created successfully",
      HTTP_CODES.CREATED
    );
  }

  async updateComment(req, res) {
    const { text, commentId } = req.body;
    const { id: userId } = req.user;

    const newComment = await this.#bookCommentsService.updateComment(
      text,
      commentId,
      userId
    );

    res.formatResponse(newComment, "Comment updated successfully");
  }

  async deleteComment(req, res) {
    const { commentId } = req.body;
    const { id: userId } = req.user;

    await this.#bookCommentsService.deleteComment(commentId, userId);

    res.formatResponse(null, "Comment deleted successfully");
  }
}
