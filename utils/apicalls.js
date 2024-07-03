import axios from "axios";

const ncNews = axios.create({
  baseURL: "https://be-nc-news-1s82.onrender.com/api",
});

export const getUsers = () => {
  return ncNews.get("/users").then((response) => {
    return response.data.users;
  });
};

export const getArticles = (queries) => {
  return ncNews.get("/articles", { params: queries }).then((response) => {
    return response.data.articles;
  });
};

export const getArticleById = (article_id) => {
  return ncNews.get(`/articles/${article_id}`).then((response) => {
    return response.data.article;
  });
};

export const getCommentsByArticleId = (article_id) => {
  return ncNews.get(`/articles/${article_id}/comments`).then((response) => {
    return response.data.comments;
  });
};

export const patchArticleById = (article_id, data) => {
  return ncNews.patch(`/articles/${article_id}`, data).then((res) => {
    return res.data.article;
  });
};

export const postCommentByArticleId = (article_id, data) => {
  return ncNews.post(`/articles/${article_id}/comments`, data).then((res) => {
    return res.data.comment;
  });
};

export const deleteCommentById = (comment_id) => {
  return ncNews.delete(`/comments/${comment_id}`).then((res) => {});
};

export const getTopics = () => {
  return ncNews.get("/topics").then((response) => {
    return response.data.topics;
  });
};
