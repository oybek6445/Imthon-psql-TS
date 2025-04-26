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
exports.sortPostsByDate = exports.deletePost = exports.updatePost = exports.getPostById = exports.getAllPosts = exports.createPost = void 0;
const pool_1 = require("../db/pool");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId, title, content } = req.body;
    const userId = req.user.id;
    const blog = yield pool_1.pool.query('SELECT * FROM blogs WHERE id = $1', [blogId]);
    if (blog.rows.length === 0)
        return res.status(404).send('Blog not found');
    if (blog.rows[0].owner_id !== userId)
        return res.status(403).send('Forbidden');
    const result = yield pool_1.pool.query('INSERT INTO posts (blog_id, title, content) VALUES ($1, $2, $3) RETURNING *', [blogId, title, content]);
    res.status(201).json(result.rows[0]);
});
exports.createPost = createPost;
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.params;
    const result = yield pool_1.pool.query('SELECT * FROM posts WHERE blog_id = $1', [blogId]);
    res.json(result.rows);
});
exports.getAllPosts = getAllPosts;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const result = yield pool_1.pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (result.rows.length === 0)
        return res.status(404).send('Post not found');
    yield pool_1.pool.query('UPDATE posts SET views = views + 1 WHERE id = $1', [postId]);
    res.json(result.rows[0]);
});
exports.getPostById = getPostById;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;
    const post = yield pool_1.pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (post.rows.length === 0)
        return res.status(404).send('Post not found');
    const blog = yield pool_1.pool.query('SELECT * FROM blogs WHERE id = $1', [post.rows[0].blog_id]);
    if (blog.rows.length === 0)
        return res.status(404).send('Blog not found');
    if (blog.rows[0].owner_id !== userId)
        return res.status(403).send('Forbidden');
    yield pool_1.pool.query('UPDATE posts SET title = $1, content = $2 WHERE id = $3', [title, content, postId]);
    res.send('Post updated');
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const userId = req.user.id;
    const post = yield pool_1.pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (post.rows.length === 0)
        return res.status(404).send('Post not found');
    const blog = yield pool_1.pool.query('SELECT * FROM blogs WHERE id = $1', [post.rows[0].blog_id]);
    if (blog.rows.length === 0)
        return res.status(404).send('Blog not found');
    if (blog.rows[0].owner_id !== userId)
        return res.status(403).send('Forbidden');
    yield pool_1.pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.send('Post deleted');
});
exports.deletePost = deletePost;
const sortPostsByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.params;
    const result = yield pool_1.pool.query('SELECT * FROM posts WHERE blog_id = $1 ORDER BY created_at DESC', [blogId]);
    res.json(result.rows);
});
exports.sortPostsByDate = sortPostsByDate;
