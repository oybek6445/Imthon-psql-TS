import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from '../router/authRoute';
import blogRoutes from '../router/blogRoutes';
import postRoutes from '../router/postRoutes';
import commentRoutes from '../router/commentRoutes';

//kop joylarda resni orniga any qoydim hato chiqvurdi googledan topomadim Ailadan soragim kemadi
//stackoverlow dayam yahshi atvetla bomadi

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

export default app;
