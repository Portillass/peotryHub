import { useState } from 'react';

const TOPICS = ['Love', 'Sad', 'Life', 'Nature', 'Hope'];

const initialForm = {
  author: '',
  title: '',
  content: '',
  topic: TOPICS[0],
};

function SubmitPage({ onSubmit, submitting, submitError, submitSuccess }) {
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const created = await onSubmit(formData);

    if (created) {
      setFormData(initialForm);
    }
  };

  return (
    <main className="page-content">
      <section className="intro">
        <h2>Submit a Poem</h2>
        <p>Share your lines with readers around the world.</p>
      </section>

      <form className="poem-form" onSubmit={handleSubmit}>
        <label htmlFor="author">Author (optional)</label>
        <input
          id="author"
          name="author"
          type="text"
          placeholder="Anonymous"
          value={formData.author}
          onChange={handleChange}
        />

        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="topic">Topic</label>
        <select
          id="topic"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
        >
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>

        <label htmlFor="content">Poem Content</label>
        <textarea
          id="content"
          name="content"
          rows="9"
          value={formData.content}
          onChange={handleChange}
          required
        />

        <button className="submit-button" type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Publish Poem'}
        </button>

        {submitError && <p className="state-message error">{submitError}</p>}
        {submitSuccess && <p className="state-message success">Poem published successfully.</p>}
      </form>
    </main>
  );
}

export default SubmitPage;
