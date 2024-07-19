# Northcoders News API

Hosted with Supabase and Render:

[Live app on Render](https://nc-news-id0p.onrender.com/api)

## Summary

Northcoders News API is a backend API built for a social news website where users can interact with articles through comments and votes, similar to Reddit.

## Recommended versions:

Node.js v22.2.0 or later

Postgres v14.11 or later

## Setup instructions

### 1. Clone the repository:

```
git clone https://github.com/ar-kt02/nc-news
```

### 2. Install necessary dependencies:

```
npm install
```

### 3. Setting up your .env:

Create the file .env.test and .env.development in root directory, add the database names below (or refer to your setup.sql file):

```
PGDATABASE=nc_news_test
PGDATABASE=nc_news
```

Note: add your .env files to .gitignore.

### 4. Create your local databases:

```
npm run setup-dbs
```

### 5. Seed your dev database:

```
npm run seed
```

### 6. Run all tests:

```
npm test
```

### 7. Run your server:

```
npm start
```

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
