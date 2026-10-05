import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function Navbar() {
  const navigate = useNavigate();
  const { name, logout } = useAuth();
  const { language, setLanguage } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        padding: '12px 20px',
        borderBottom: '1px solid #ccc',
      }}
    >
      <Link to="/products">
        {language === 'en' ? 'Products' : 'பொருட்கள்'}
      </Link>

      <Link to="/cart">
        {language === 'en' ? 'Cart' : 'கார்ட்'}
      </Link>

      <Link to="/orders">
        {language === 'en' ? 'Orders' : 'ஆர்டர்கள்'}
      </Link>

      <span style={{ marginLeft: 'auto' }}>
        {language === 'en' ? 'Hi' : 'வணக்கம்'}, {name}
      </span>

      <button onClick={handleLogout}>
        {language === 'en' ? 'Logout' : 'வெளியேறு'}
      </button>

      <button
        onClick={() =>
          setLanguage(language === 'en' ? 'ta' : 'en')
        }
      >
        {language === 'en' ? 'தமிழ்' : 'English'}
      </button>
    </nav>
  );
}

export default Navbar;


