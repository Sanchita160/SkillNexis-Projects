// Ye component ek post ko card ki tarah dikhata hai
function PostCard(props) {
  const post = props.post;

  return (
    <div className="post-card">
      <h2>{post.title}</h2>
      <p className="post-info">
        By {post.author} | {post.category} | {post.date}
      </p>
      <p>{post.description}</p>
    </div>
  );
}

export default PostCard;
