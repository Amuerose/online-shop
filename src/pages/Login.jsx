import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(t('login.errorInvalid'));
    }
  };

  const handleGoogleLogin = async () => {
    console.log('Google login clicked');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
      setError('Ошибка входа через Google');
    }
  };

  const handleFacebookLogin = async () => {
    console.log('Facebook login clicked');
    try {
      await loginWithFacebook();
      navigate('/');
    } catch (error) {
      console.error('Facebook login error:', error);
      setError('Ошибка входа через Facebook');
    }
  };

  return (
    <main
      className="h-[100dvh] flex items-start justify-center pt-[160px] px-4 pb-10"
      style={{
        backgroundImage: [
          'linear-gradient(180deg, #3b1f1d 0%, #8b4513 100%)',
          'linear-gradient(90deg, #3b1f1d 0%, rgba(75,46,43,0) 100%)',
          'linear-gradient(180deg, rgba(92,51,23,0.8) 0%, rgba(139,69,19,0.8) 100%)',
          'linear-gradient(180deg, rgba(75,46,43,0.6) 0%, rgba(210,105,30,0.6) 100%)',
          'linear-gradient(180deg, rgba(210,105,30,0.4) 0%, rgba(75,46,43,0.4) 100%)'
        ].join(', '),
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover',
      }}
    >
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-xl shadow border border-white/10 p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#BDA47A]">{t('login.title')}</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder={t('login.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-white/30 bg-white/10 text-white placeholder-white/50 px-4 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder={t('login.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-white/30 bg-white/10 text-white placeholder-white/50 px-4 py-2 rounded"
            required
          />
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded-full bg-[#BDA47A]/10 border border-[#BDA47A]/40 text-[#BDA47A] hover:bg-[#BDA47A]/20 transition font-medium"
          >
            {t('login.loginButton')}
          </button>
        </form>
        <p className="text-white text-center mt-6 mb-2">{t('login.orLoginWith')}</p>
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full px-4 py-2 rounded bg-white text-black hover:bg-gray-100 transition"
          >
            {t('login.google')}
          </button>
          <button
            type="button"
            onClick={handleFacebookLogin}
            className="w-full px-4 py-2 rounded bg-[#1877F2] text-white hover:bg-[#165cbe] transition"
          >
            {t('login.facebook')}
          </button>
        </div>
        <p className="text-center mt-6 text-[#BDA47A]">
          {t('login.noAccount')}{' '}
          <a href="/register" className="underline hover:text-white cursor-pointer">
            {t('login.registerLink')}
          </a>
        </p>
      </div>
    </main>
  );
}