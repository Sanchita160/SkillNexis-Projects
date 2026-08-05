import { useState } from "react";
import PostCard from "./PostCard";
import postsData from "./posts.json";
import "./App.css";

function App() {
  // search box mein jo type karenge wo yahan store hoga
  const [search, setSearch] = useState("");

  // jo category select hui hai wo yahan store hogi
  const [category, setCategory] = useState("All");

  // saari categories nikal rahe hain posts se (duplicate hata ke)
  const allCategories = ["All", "JavaScript", "React", "DSA", "CSS", "Career"];

  // ab posts ko filter kar rahe hain search aur category ke hisaab se
  let filteredPosts = postsData;

  if (category !== "All") {
    filteredPosts = filteredPosts.filter((post) => post.category === category);
  }

  if (search !== "") {
    filteredPosts = filteredPosts.filter((post) =>
      post.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div className="App">
      <h1>My Blog</h1>
      <p>React se bana hua ek simple blog page</p>

      {/* Search box */}
      <input
        type="text"
        placeholder="Search post by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {/* Category filter buttons */}
      <div className="filter-buttons">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cat === category ? "active-btn" : ""}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts dikhana */}
      <div className="post-list">
        {filteredPosts.length === 0 && <p>Koi post nahi mila.</p>}

        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default App;
