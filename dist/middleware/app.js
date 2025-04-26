"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoute_1 = __importDefault(require("../router/authRoute"));
const blogRoutes_1 = __importDefault(require("../router/blogRoutes"));
const postRoutes_1 = __importDefault(require("../router/postRoutes"));
const commentRoutes_1 = __importDefault(require("../router/commentRoutes"));
//kop joylarda resni orniga any qoydim hato chiqvurdi googledan topomadim Ailadan soragim kemadi
//stackoverlow dayam yahshi atvetla bomadi
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/auth', authRoute_1.default);
app.use('/blogs', blogRoutes_1.default);
app.use('/posts', postRoutes_1.default);
app.use('/comments', commentRoutes_1.default);
exports.default = app;
