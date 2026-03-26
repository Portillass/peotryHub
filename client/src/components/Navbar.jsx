function Navbar({ activePage, onNavigate }) {
  return (
    <header className="navbar">
      <h1 className="brand">Open Poetry Library</h1>
      <nav className="nav-links" aria-label="Main navigation">
        <button
          className={`nav-button ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
          type="button"
        >
          Home
        </button>
        <button
          className={`nav-button ${activePage === 'submit' ? 'active' : ''}`}
          onClick={() => onNavigate('submit')}
          type="button"
        >
          Submit Poem
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
