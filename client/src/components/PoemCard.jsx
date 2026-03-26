import { useState } from 'react';

function PoemCard({ poem, onLike, onAddComment, liking, commenting, commentError }) {
  const createdDate = new Date(poem.created_at).toLocaleDateString();
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    const submitted = await onAddComment(poem._id, {
      author: commentAuthor,
      content: commentContent,
    });

    if (submitted) {
      setCommentAuthor('');
      setCommentContent('');
    }
  };

  return (
    <article className="poem-card">
      <div className="poem-meta">
        <span className="poem-topic">{poem.topic}</span>
        <span>{createdDate}</span>
      </div>
      <h3 className="poem-title">{poem.title}</h3>
      <p className="poem-content">{poem.content}</p>
      <div className="poem-footer">
        <span className="poem-author">By {poem.author || 'Anonymous'}</span>
        <div className="poem-likes">
          <span>{poem.likes} likes</span>
          <button
            className="like-button"
            onClick={() => onLike(poem._id)}
            disabled={liking}
            type="button"
          >
            {liking ? 'Liking...' : 'Like'}
          </button>
        </div>
      </div>

      <section className="comment-section">
        <div className="comment-header">
          <h4 className="comment-heading">Comments ({poem.comments?.length || 0})</h4>
          <button
            className="comment-toggle-button"
            type="button"
            onClick={() => setShowComments((previous) => !previous)}
          >
            {showComments ? 'Hide Comments' : 'View Comments'}
          </button>
        </div>

        {showComments &&
          (poem.comments?.length ? (
            <ul className="comment-list">
              {poem.comments.map((comment) => (
                <li key={comment._id} className="comment-item">
                  <p className="comment-content">{comment.content}</p>
                  <p className="comment-meta">
                    {comment.author || 'Anonymous'} •{' '}
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="comment-empty">No comments yet. Be the first to respond.</p>
          ))}

        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={commentAuthor}
            onChange={(event) => setCommentAuthor(event.target.value)}
          />
          <textarea
            rows="3"
            placeholder="Write a comment..."
            value={commentContent}
            onChange={(event) => setCommentContent(event.target.value)}
            required
          />
          <button className="comment-button" type="submit" disabled={commenting}>
            {commenting ? 'Posting...' : 'Post Comment'}
          </button>
          {commentError && <p className="state-message error">{commentError}</p>}
        </form>
      </section>
    </article>
  );
}

export default PoemCard;
