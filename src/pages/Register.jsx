import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

function Register() {
  const { register, loginWithGoogle, loginWithFacebook } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError(t('register.errorEmailInvalid'));
      return;
    }
    if (password.length < 8) {
      setError(t('register.errorPasswordShort'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('register.errorPasswordMismatch'));
      return;
    }
    if (!agreePolicy) {
      setError(t('register.errorPolicy'));
      return;
    }

    try {
      await register(email, password, name);
      navigate('/');
    } catch (err) {
      setError(t('register.errorRegister'));
      console.error('Ошибка при регистрации:', err);
    }
  };

  return (
    <main
      className="h-[100dvh] flex items-center justify-center px-4 py-10"
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
      <div className="w-full max-w-md bg-white/10 backdrop-blur rounded-xl shadow border border-white/20 p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#BDA47A]">{t('register.title')}</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder={t('register.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-white/30 bg-white/10 text-white placeholder-white/50 px-4 py-2 rounded"
            required
          />
          <input
            type="email"
            placeholder={t('register.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-white/30 bg-white/10 text-white placeholder-white/50 px-4 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder={t('register.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-white/30 bg-white/10 text-white placeholder-white/50 px-4 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder={t('register.confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-white/30 bg-white/10 text-white placeholder-white/50 px-4 py-2 rounded"
            required
          />
          <label className="flex items-center gap-2 text-white text-sm">
            <input
              type="checkbox"
              checked={agreePolicy}
              onChange={() => setAgreePolicy(!agreePolicy)}
              required
            />
            <Trans i18nKey="register.agreePolicy">
              Я принимаю <a href="/privacy-policy" className="underline hover:text-[#BDA47A]">политику конфиденциальности</a>
            </Trans>
          </label>
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded-full bg-[#BDA47A]/10 border border-[#BDA47A]/40 text-[#BDA47A] hover:bg-[#BDA47A]/20 transition font-medium"
          >
            {t('register.registerButton')}
          </button>
        </form>
        <p className="text-white text-center mt-6 mb-2">{t('register.orRegisterWith')}</p>
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full px-4 py-2 rounded bg-white text-black hover:bg-gray-100 transition"
          >
            {t('register.google')}
          </button>
          <button
            type="button"
            onClick={loginWithFacebook}
            className="w-full px-4 py-2 rounded bg-[#1877F2] text-white hover:bg-[#165cbe] transition"
          >
            {t('register.facebook')}
          </button>
        </div>
      </div>
    </main>
  );
}

export default Register;