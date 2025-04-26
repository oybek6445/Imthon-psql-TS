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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pool_1 = require("../db/pool");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const hash = yield bcrypt_1.default.hash(password, 10);
    yield pool_1.pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hash]);
    res.status(201).send('User created');
});
exports.register = register;
//any qilib qoydim hato berdi google dan yahshi javob topmadim AI ladan soragim kemadi
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield pool_1.pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0)
        return res.status(400).send('Invalid credentials');
    const valid = yield bcrypt_1.default.compare(password, user.rows[0].password);
    if (!valid)
        return res.status(400).send('Invalid credentials');
    const token = jsonwebtoken_1.default.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true }).send('Logged in');
});
exports.login = login;
