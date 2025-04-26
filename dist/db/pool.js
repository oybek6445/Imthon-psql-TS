"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const postgres_pool_1 = require("postgres-pool");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = new postgres_pool_1.Pool({
    connectionString: 'postgresql://postgres:mitron2020@localhost:5432/postgres',
});
