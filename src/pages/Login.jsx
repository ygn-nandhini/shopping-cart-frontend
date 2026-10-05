import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();
  const { language } = useLanguage();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/login', {
        email,
        password
      });

      const { access_token, user_id, name } = response.data;

      login({
        access_token,
        user_id,
        name
      });

      navigate('/products');
    } catch (err) {
      setError(
        language === 'en'
          ? 'Login failed. Please check your email and password.'
          : 'உள்நுழைவு தோல்வியடைந்தது. உங்கள் மின்னஞ்சல் மற்றும் கடவுச்சொல்லை சரிபார்க்கவும்.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {language === 'en' ? 'Login' : 'உள்நுழைவு'}
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Email' : 'மின்னஞ்சல்'}
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={
                language === 'en'
                  ? 'Enter your email'
                  : 'உங்கள் மின்னஞ்சலை உள்ளிடவும்'
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Password' : 'கடவுச்சொல்'}
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={
                language === 'en'
                  ? 'Enter your password'
                  : 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்'
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg
                       font-medium hover:bg-blue-700 transition duration-200"
          >
            {language === 'en' ? 'Login' : 'உள்நுழைக'}
          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          {language === 'en'
            ? "Don't have an account?"
            : 'கணக்கு இல்லையா?'}{' '}

          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            {language === 'en' ? 'Register' : 'பதிவு செய்க'}
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;


