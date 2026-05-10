import express from 'express';
const router = express.Router();

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

import db from '../lib/db.js';
import userMiddleware from '../middleware/users.js';
