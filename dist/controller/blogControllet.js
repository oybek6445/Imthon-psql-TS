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
exports.getBlogUsers = exports.leaveBlog = exports.joinBlog = exports.searchBlogs = exports.deleteBlog = exports.updateBlog = exports.getBlogInfo = exports.getMyJoinedBlogs = exports.getMyBlogs = exports.createBlog = void 0;
const pool_1 = require("../db/pool");
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const userId = req.user.id;
    const result = yield pool_1.pool.query('INSERT INTO blogs (owner_id, name, description) VALUES ($1, $2, $3) RETURNING *', [userId, name, description]);
    //console.log(result.rows)
    yield pool_1.pool.query('INSERT INTO blog_members (blog_id, user_id) VALUES ($1, $2)', [result.rows[0].id, userId]);
    res.status(201).json(result.rows[0]);
});
exports.createBlog = createBlog;
const getMyBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield pool_1.pool.query('SELECT * FROM blogs WHERE owner_id = $1', [userId]);
    res.json(result.rows);
});
exports.getMyBlogs = getMyBlogs;
const getMyJoinedBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield pool_1.pool.query(`
    SELECT b.* FROM blogs b
    JOIN blog_members bm ON bm.blog_id = b.id
    WHERE bm.user_id = $1
  `, [userId]);
    res.json(result.rows);
});
exports.getMyJoinedBlogs = getMyJoinedBlogs;
const getBlogInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield pool_1.pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
    if (result.rows.length === 0)
        return res.status(404).send('Blog not found');
    res.json(result.rows[0]);
});
exports.getBlogInfo = getBlogInfo;
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;
    const blog = yield pool_1.pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
    if (blog.rows.length === 0)
        return res.status(404).send('Blog not found');
    if (blog.rows[0].owner_id !== userId)
        return res.status(403).send('Forbidden');
    yield pool_1.pool.query('UPDATE blogs SET name = $1, description = $2 WHERE id = $3', [name, description, id]);
    res.send('Blog updated');
});
exports.updateBlog = updateBlog;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.user.id;
    const blog = yield pool_1.pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
    if (blog.rows.length === 0)
        return res.status(404).send('Blog not found');
    if (blog.rows[0].owner_id !== userId)
        return res.status(403).send('Forbidden');
    yield pool_1.pool.query('DELETE FROM blogs WHERE id = $1', [id]);
    res.send('Blog deleted');
});
exports.deleteBlog = deleteBlog;
const searchBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    const result = yield pool_1.pool.query(`SELECT * FROM blogs WHERE name ILIKE '%' || $1 || '%'`, [query]);
    res.json(result.rows);
});
exports.searchBlogs = searchBlogs;
const joinBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.body;
    const userId = req.user.id;
    const check = yield pool_1.pool.query('SELECT * FROM blog_members WHERE blog_id = $1 AND user_id = $2', [blogId, userId]);
    if (check.rows.length > 0)
        return res.status(400).send('Already joined');
    yield pool_1.pool.query('INSERT INTO blog_members (blog_id, user_id) VALUES ($1, $2)', [blogId, userId]);
    res.send('Joined blog');
});
exports.joinBlog = joinBlog;
const leaveBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.body;
    const userId = req.user.id;
    yield pool_1.pool.query('DELETE FROM blog_members WHERE blog_id = $1 AND user_id = $2', [blogId, userId]);
    res.send('Left blog');
});
exports.leaveBlog = leaveBlog;
const getBlogUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.params;
    const result = yield pool_1.pool.query(`
    SELECT u.id, u.username FROM users u
    JOIN blog_members bm ON bm.user_id = u.id
    WHERE bm.blog_id = $1
  `, [blogId]);
    res.json(result.rows);
});
exports.getBlogUsers = getBlogUsers;
