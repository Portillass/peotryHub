import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SubmitPage from './pages/SubmitPage';
import { addComment, getPoems, likePoem, submitPoem } from './services/poemApi';

function getApiErrorMessage(error, fallbackMessage) {
  const status = error?.response?.status;
  const backendMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.details;

  if (status && backendMessage) {
    return `${fallbackMessage} (${status}: ${backendMessage})`;
  }

  if (status) {
    return `${fallbackMessage} (status ${status})`;
  }

  if (error?.message) {
    return `${fallbackMessage} (${error.message})`;
  }

  return fallbackMessage;
}

function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [likingPoemId, setLikingPoemId] = useState('');
  const [commentingPoemId, setCommentingPoemId] = useState('');
  const [commentError, setCommentError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const loadPoems = async (topic = selectedTopic) => {
    setLoading(true);
    setError('');

    try {
      const data = await getPoems(topic);
      setPoems(data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not load poems. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPoems(selectedTopic);
  }, [selectedTopic]);

  const handleLike = async (id) => {
    setCommentError('');
    setLikingPoemId(id);

    try {
      const updatedPoem = await likePoem(id);
      setPoems((previousPoems) =>
        previousPoems.map((poem) =>
          poem._id === id ? { ...poem, likes: updatedPoem.likes } : poem
        )
      );
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not like this poem right now.'));
    } finally {
      setLikingPoemId('');
    }
  };

  const handleAddComment = async (id, formData) => {
    setCommentingPoemId(id);
    setCommentError('');

    try {
      const updatedPoem = await addComment(id, formData);

      setPoems((previousPoems) =>
        previousPoems.map((poem) => (poem._id === id ? updatedPoem : poem))
      );

      return true;
    } catch (requestError) {
      setCommentError(
        getApiErrorMessage(requestError, 'Could not add comment right now.')
      );
      return false;
    } finally {
      setCommentingPoemId('');
    }
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const payload = {
        author: formData.author,
        title: formData.title,
        content: formData.content,
        topic: formData.topic,
      };

      const createdPoem = await submitPoem(payload);

      setSubmitSuccess(true);
      if (selectedTopic === 'All' || selectedTopic === createdPoem.topic) {
        setPoems((previousPoems) => [createdPoem, ...previousPoems]);
      }

      return true;
    } catch (requestError) {
      setSubmitError(
        getApiErrorMessage(
          requestError,
          'Could not submit poem. Check your input and try again.'
        )
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <Navbar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      {activePage === 'home' ? (
        <HomePage
          poems={poems}
          loading={loading}
          error={error}
          selectedTopic={selectedTopic}
          onTopicChange={setSelectedTopic}
          onLike={handleLike}
          onAddComment={handleAddComment}
          likingPoemId={likingPoemId}
          commentingPoemId={commentingPoemId}
          commentError={commentError}
        />
      ) : (
        <SubmitPage
          onSubmit={handleSubmit}
          submitting={submitting}
          submitError={submitError}
          submitSuccess={submitSuccess}
        />
      )}
    </div>
  );
}

export default App;
