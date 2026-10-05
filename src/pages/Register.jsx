import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/users', {
        name,
        email,
        password
      });

      navigate('/login');
    } catch (err) {
      setError(
        language === 'en'
          ? 'Email already registered'
          : 'இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {language === 'en' ? 'Register' : 'பதிவு செய்க'}
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Name' : 'பெயர்'}
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={
                language === 'en'
                  ? 'Enter your name'
                  : 'உங்கள் பெயரை உள்ளிடவும்'
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
            {language === 'en' ? 'Register' : 'பதிவு செய்க'}
          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          {language === 'en'
            ? 'Already have an account?'
            : 'ஏற்கனவே கணக்கு உள்ளதா?'}{' '}

          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            {language === 'en' ? 'Login' : 'உள்நுழைக'}
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;


