import PoemCard from '../components/PoemCard';

const TOPICS = ['All', 'Love', 'Sad', 'Life', 'Nature', 'Hope'];

function HomePage({
  poems,
  loading,
  error,
  selectedTopic,
  onTopicChange,
  onLike,
  onAddComment,
  likingPoemId,
  commentingPoemId,
  commentError,
}) {
  return (
    <main className="page-content">
      <section className="intro">
        <h2>Read and Share Poetry</h2>
        <p>
          A quiet space for words and feelings. Browse poems by topic or add
          your own voice.
        </p>
      </section>

      <section className="filters" aria-label="Poem topic filters">
        {TOPICS.map((topic) => (
          <button
            key={topic}
            className={`filter-button ${selectedTopic === topic ? 'active' : ''}`}
            onClick={() => onTopicChange(topic)}
            type="button"
          >
            {topic}
          </button>
        ))}
      </section>

      {loading && <p className="state-message">Loading poems...</p>}
      {error && !loading && <p className="state-message error">{error}</p>}

      {!loading && !error && poems.length === 0 && (
        <p className="state-message">No poems found for this topic yet.</p>
      )}

      <section className="poem-list" aria-live="polite">
        {poems.map((poem) => (
          <PoemCard
            key={poem._id}
            poem={poem}
            onLike={onLike}
            onAddComment={onAddComment}
            liking={likingPoemId === poem._id}
            commenting={commentingPoemId === poem._id}
            commentError={commentingPoemId === poem._id ? commentError : ''}
          />
        ))}
      </section>
    </main>
  );
}

export default HomePage;
