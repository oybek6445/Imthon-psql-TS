"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getCommentsByPostId = exports.createComment = void 0;
const pool_1 = require("../db/pool");
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, content } = req.body;
    const userId = req.user.id;
    const post = yield pool_1.pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (post.rows.length === 0)
        return res.status(404).send('Post not found');
    const result = yield pool_1.pool.query('INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *', [postId, userId, content]);
    res.status(201).json(result.rows[0]);
});
exports.createComment = createComment;
const getCommentsByPostId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const result = yield pool_1.pool.query('SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE post_id = $1 ORDER BY c.created_at ASC', [postId]);
    res.json(result.rows);
});
exports.getCommentsByPostId = getCommentsByPostId;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const comment = yield pool_1.pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);
    if (comment.rows.length === 0)
        return res.status(404).send('Comment not found');
    if (comment.rows[0].user_id !== userId)
        return res.status(403).send('Forbidden');
    yield pool_1.pool.query('UPDATE comments SET content = $1 WHERE id = $2', [content, commentId]);
    res.send('Comment updated');
});
exports.updateComment = updateComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const userId = req.user.id;
    const comment = yield pool_1.pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);
    if (comment.rows.length === 0)
        return res.status(404).send('Comment not found');
    if (comment.rows[0].user_id !== userId)
        return res.status(403).send('Forbidden');
    yield pool_1.pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
    res.send('Comment deleted');
});
exports.deleteComment = deleteComment;
