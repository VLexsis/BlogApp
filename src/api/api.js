import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://blog-platform.kata.academy/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Articles"], // Добавляем тег для статей
  endpoints: (build) => ({
    getArticles: build.query({
      query: ({ offset, limit }) => ({
        url: "/articles",
        params: {
          offset,
          limit,
        },
      }),
      providesTags: ["Articles"], // Указываем, что этот запрос предоставляет данные с тегом "Articles"
    }),
    getArticleBySlug: build.query({
      query: (slug) => ({
        url: `/articles/${slug}`,
      }),
      providesTags: (result, error, slug) => [{ type: "Articles", id: slug }], // Тег для конкретной статьи
    }),
    updateArticle: build.mutation({
      query: ({ slug, articleData }) => ({
        url: `/articles/${slug}`,
        method: "PUT",
        body: { article: articleData },
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: "Articles", id: slug }, // Инвалидируем тег для конкретной статьи
        { type: "Articles", id: "LIST" }, // Инвалидируем тег для списка статей
      ],
    }),
    createArticle: build.mutation({
      query: ({ article }) => ({
        url: "/articles",
        method: "POST",
        body: { article },
      }),
      invalidatesTags: ["Articles"], // Инвалидируем тег для списка статей
    }),
    deleteArticle: build.mutation({
      query: ({ slug }) => ({
        url: `/articles/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Articles"], // Инвалидируем тег для списка статей
    }),
    likeArticle: build.mutation({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: "POST",
      }),
      invalidatesTags: (result, error, slug) => [
        { type: "Articles", id: slug }, // Инвалидируем тег для конкретной статьи
      ],
    }),
    unlikeArticle: build.mutation({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, slug) => [
        { type: "Articles", id: slug }, // Инвалидируем тег для конкретной статьи
      ],
    }),
  }),
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://blog-platform.kata.academy/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    register: build.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
    }),
    login: build.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getCurrentUser: build.query({
      query: () => ({
        url: "/user",
      }),
    }),
    updateUser: build.mutation({
      query: (userData) => ({
        url: "/user",
        method: "PUT",
        body: userData,
      }),
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleBySlugQuery,
  useUpdateArticleMutation,
  useCreateArticleMutation,
  useDeleteArticleMutation,
  useLikeArticleMutation,
  useUnlikeArticleMutation,
} = articlesApi;

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
} = authApi;
