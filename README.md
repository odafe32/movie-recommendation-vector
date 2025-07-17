# 🎬 Movie Recommendation App

A modern AI-powered web application that recommends similar movies using OpenAI embeddings and Astra DB vector search.

Built with [Next.js 14](https://nextjs.org/), hosted on [Vercel](https://vercel.com/).

---

## 🚀 Features

- 🔍 View details of any movie
- 🎯 See a list of recommended similar movies based on semantic similarity
- 📊 Data stored in **Astra DB** (vector search enabled)
- 🤖 Uses **OpenAI text-embedding-3-large** model for movie vectorization
- ⚡ Fully server-side rendered & fast
- 🌐 Hosted on **Vercel**

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Database:** [Astra DB Vector](https://www.datastax.com/astra)
- **AI:** [OpenAI Embeddings API](https://platform.openai.com/docs/guides/embeddings)

---

## 🌟 Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env.local` file in the root folder with your keys:

```env
OPENAI_API_KEY=your_openai_api_key
ASTRA_DB_APPLICATION_TOKEN=your_astra_db_token
OPENAI_API_KEY
```

### 4️⃣ Load Data

If you have a `SAMPLE_DATA.csv` of movies:

- Run the data import script (if you have one, e.g. `scripts/import.ts`) to insert the movies & vectors into Astra DB.

Example:

```bash
npm run import
```

### 5️⃣ Run Locally

```bash
npm run dev
```

App will run at: [http://localhost:3000](http://localhost:3000/)

---

## 🧪 Deployment

You can deploy directly to [Vercel](https://vercel.com/):

- Push your project to GitHub
- Connect GitHub repo to Vercel
- In Vercel dashboard, set the environment variables (same as `.env.local`)
- Deploy 🚀

---

## 📁 Project Structure

```
app/
  movie/[id]/page.tsx      # Movie details & recommendations page
components/
  MoviePoster.tsx          # Component to render a movie poster
db.ts                      # Astra DB client
types.ts                   # Type definitions
scripts/import.ts          # Data import script (if applicable)
.env.local                 # Environment variables (not committed)
```

---

## 📝 Notes

- Make sure your OpenAI account has quota and correct API key.
- Make sure your Astra DB has Vector Search enabled.
- `.env.local` is ignored by git — don’t forget to configure variables in Vercel.

---

## 🔗 Links

- 🌐 Live site: [https://your-app.vercel.app](https://your-app.vercel.app/)
- 📚 Docs: [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings), [Astra Vector DB](https://www.datastax.com/astra/astra-vector-db)

---

## 👨‍💻 Author

- ✨ Odafe Godfrey ([@odafe32](https://github.com/yourhandle))
