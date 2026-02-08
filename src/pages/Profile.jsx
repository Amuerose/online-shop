import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Pencil, Trash, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AccountCard from '../components/AccountCard';
import UserAvatar from '../components/cookie/UserAvatar';
import { blogBackgroundStyle } from '../styles/blogBackground';

const TABS = {
  PROFILE: 'profile',
  ORDERS: 'orders',
  ADDRESSES: 'addresses',
  WISHLIST: 'wishlist',
  BONUSES: 'bonuses',
  NOTIFICATIONS: 'notifications',
  SECURITY: 'security',
};

function useTabLabeler() {
  const { t } = useTranslation();
  return (tab) => t(`profile.tabs.${tab}`);
}

export default function Profile() {
  const { user, logout, updateProfileName, updateProfileEmail, updateProfilePhoto } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const tabLabel = useTabLabeler();

  const [activeTab, setActiveTab] = useState(TABS.PROFILE);
  const [burgerOpen, setBurgerOpen] = useState(false);
  const menuRef = useRef(null);
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.displayName || ''
  );
  const [email, setEmail] = useState(user?.email || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.user_metadata?.picture ||
    user?.user_metadata?.avatar_url ||
    user?.photoURL || ''
  );
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Phone modal
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Для адресов
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [addressError, setAddressError] = useState('');
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  // Состояния для уведомлений
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      setAvatarPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [avatarFile]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (
        burgerOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !e.target.closest('.profile-burger-toggle')
      ) {
        setBurgerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [burgerOpen]);

  // Функция добавления адреса
  const handleAddAddress = () => {
    setAddressError('');
    const { label, street, city, postalCode, country } = newAddress;
    if (!label || !street || !city || !postalCode || !country) {
      setAddressError(t('profile.addresses.fillAll'));
      return;
    }
    setAddresses([...addresses, newAddress]);
    setNewAddress({ label: '', street: '', city: '', postalCode: '', country: '' });
    setAddressModalOpen(false);
  };

  // Helper to check for existing address labels
  const hasAddressLabel = (lbl) => !!addresses.find((a) => a.label.toLowerCase() === lbl.toLowerCase());

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      if (displayName !== user.displayName) {
        await updateProfileName(displayName);
      }
      if (email !== user.email) {
        await updateProfileEmail(email);
      }
      if (avatarFile) {
        await updateProfilePhoto(avatarFile);
      }
      setMessage(t('profile.updateSuccess'));
    } catch (e) {
      setError(t('profile.updateError'));
    }
    setLoading(false);
  };

  const handleSavePhone = () => {
    if (!newPhone) return;
    // TODO: call backend to save newPhone
    console.log('Saved phone:', newPhone);
    setPhoneModalOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.PROFILE:
        return (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <UserAvatar user={user} size={96} className="mx-auto sm:mx-0" showName={false} showEmail={false} />
            <div className="flex flex-col text-white gap-2 w-full">
              <p className="text-xl font-semibold break-words text-center sm:text-left">
                {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.displayName || t('common.user')}
              </p>
              <p className="text-sm opacity-80 text-center sm:text-left">{user?.email}</p>

              {/* Address row */}
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-80">{t('profile.address')}</span>
                {user?.address ? (
                  <span>{user.address}</span>
                ) : (
                  <button
                    onClick={() => setActiveTab(TABS.ADDRESSES)}
                    className="text-[#BDA47A] underline hover:no-underline"
                  >
                    {t('common.add')}
                  </button>
                )}
              </div>

              {/* Phone row */}
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-80">{t('profile.phone')}</span>
                {user?.phoneNumber ? (
                  <span>{user.phoneNumber}</span>
                ) : (
                  <button
                    onClick={() => setPhoneModalOpen(true)}
                    className="text-[#BDA47A] underline hover:no-underline"
                  >
                    {t('common.add')}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      case TABS.ORDERS:
        return (
          <div className="flex flex-col h-full text-white gap-6">
            {/* Heading at top */}
            <p className="text-lg opacity-80 text-center">{t('profile.ordersIntro')}</p>

            {/* Centered block for empty state */}
            <div className="flex flex-col items-center justify-center flex-1 gap-3">
              <p className="text-sm opacity-60 text-center">{t('profile.noOrders')}</p>
              <button
                onClick={() => navigate('/shop')}
                className="w-fit px-4 py-1.5 rounded-lg border border-white/20 bg-white/5 backdrop-blur-md text-[#BDA47A] text-sm font-semibold hover:bg-white/10 transition"
              >
                {t('profile.goToShop')}
              </button>
            </div>
          </div>
        );
      case TABS.ADDRESSES:
        const defaultLabels = [t('profile.addresses.home'), t('profile.addresses.work')];
        return (
          <div className="flex flex-col h-full text-white gap-4">
            {/* Heading */}
            <h3 className="text-lg font-semibold">{t('profile.addresses.title')}</h3>

            {/* Address rows */}
            <div className="flex-1 space-y-4 overflow-y-auto">
              {/* Дом и Работа блоки */}
              <div className="space-y-3">
                {defaultLabels.map((lbl) =>
                  hasAddressLabel(lbl) ? (
                    addresses
                      .filter((a) => a.label.toLowerCase() === lbl.toLowerCase())
                      .map((addr, idx) => (
                        <div
                          key={lbl + idx}
                          className="bg-white/5 p-3 rounded border border-white/20 flex flex-col gap-1 relative"
                        >
                          <p className="font-semibold text-sm">{addr.label}</p>
                          <p>{addr.street}</p>
                          <p>
                            {addr.city}, {addr.postalCode}
                          </p>
                          <p>{addr.country}</p>
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button className="hover:text-[#BDA47A]">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button className="hover:text-red-400">
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div key={lbl} className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">{lbl}</span>
                      <button
                        onClick={() => {
                          setNewAddress({ ...newAddress, label: lbl });
                          setAddressModalOpen(true);
                        }}
                        className="text-[#BDA47A] text-sm font-semibold"
                      >
                        {t('common.add')}
                      </button>
                    </div>
                  )
                )}
              </div>
              {/* Кнопка плюсик сразу под Дом и Работа */}
              <button
                onClick={() => {
                  setNewAddress({ label: '', street: '', city: '', postalCode: '', country: '' });
                  setAddressModalOpen(true);
                }}
                className="w-fit self-start mt-4 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[#BDA47A] text-sm font-bold hover:bg-white/10 transition"
              >
                {t('common.add')}
              </button>

              {/* Additional custom addresses */}
              {addresses
                .filter((a) => !defaultLabels.map((l) => l.toLowerCase()).includes(a.label.toLowerCase()))
                .map((addr, idx) => (
                  <div
                    key={'other' + idx}
                    className="bg-white/5 p-3 rounded border border-white/20 flex flex-col gap-1 relative"
                  >
                    <p className="font-semibold text-sm">{addr.label}</p>
                    <p>{addr.street}</p>
                    <p>
                      {addr.city}, {addr.postalCode}
                    </p>
                    <p>{addr.country}</p>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button className="hover:text-[#BDA47A]">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="hover:text-red-400">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );
      case TABS.NOTIFICATIONS:
        return (
          <div className="space-y-4 text-white">
            <h3 className="text-xl font-semibold mb-4">{t('profile.notifications.title')}</h3>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
                className="accent-[#BDA47A]"
              />
              {t('profile.notifications.email')}
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={smsNotifications}
                onChange={() => setSmsNotifications(!smsNotifications)}
                className="accent-[#BDA47A]"
              />
              {t('profile.notifications.sms')}
            </label>
          </div>
        );
      case TABS.SECURITY:
        return (
          <div className="space-y-4 text-white">
            <h3 className="text-xl font-semibold mb-4">{t('profile.security.title')}</h3>
            <p>{t('profile.security.sessionsPlaceholder')}</p>
            <button
              onClick={logout}
              className="w-full py-2 rounded bg-[#BDA47A]/10 border border-[#BDA47A]/40 text-[#BDA47A] hover:bg-[#BDA47A]/20 transition font-medium"
            >
              {t('profile.security.logout')}
            </button>
          </div>
        );
      case TABS.WISHLIST:
        return <p className="text-white">{t('profile.wishlist.placeholder')}</p>;
      case TABS.BONUSES:
        return <p className="text-white">{t('profile.bonuses.placeholder')}</p>;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Address modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white/5 border border-white/20 rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-semibold text-white mb-4">{t('profile.addresses.addAddress')}</h3>

            <div className="space-y-2">
              <input
                type="text"
                placeholder={t('profile.addresses.labelPlaceholder')}
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                className="w-full p-2 rounded bg-white/20 text-white"
              />
              <input
                type="text"
                placeholder={t('profile.addresses.street')}
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="w-full p-2 rounded bg-white/20 text-white"
              />
              <input
                type="text"
                placeholder={t('profile.addresses.city')}
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="w-full p-2 rounded bg-white/20 text-white"
              />
              <input
                type="text"
                placeholder={t('profile.addresses.postcode')}
                value={newAddress.postalCode}
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                className="w-full p-2 rounded bg-white/20 text-white"
              />
              <input
                type="text"
                placeholder={t('profile.addresses.country')}
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                className="w-full p-2 rounded bg-white/20 text-white"
              />
              {addressError && <p className="text-red-400 text-xs">{addressError}</p>}
            </div>

            <p className="text-xs text-white mt-4 mb-2">
              {t('profile.policy.prefix')}&nbsp;
              <span className="font-semibold">«{t('common.add')}»</span>,&nbsp;
              {t('profile.policy.suffix')}&nbsp;
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#BDA47A] hover:no-underline"
              >
                {t('privacyPolicy')}
              </a>
            </p>
            <p className="text-xs text-white mb-4">
              <strong>{t('dataControllerTitle')}</strong><br />
              {t('dataControllerLine1')}<br />
              {t('dataControllerLine2')}<br />
              {t('dataControllerLine3')} <a href="mailto:info.amuerose@gmail.com" className="underline">info.amuerose@gmail.com</a>
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setAddressModalOpen(false);
                  setAddressError('');
                  setNewAddress({ label: '', street: '', city: '', postcode: '', country: '' });
                }}
                className="px-3 py-1 text-xs rounded-lg border border-white/20 hover:bg-white/10"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleAddAddress}
                className="px-3 py-1 text-xs rounded-lg bg-[#BDA47A] text-black font-semibold"
              >
                {t('common.add')}
              </button>
            </div>
          </div>
        </div>
      )}
      {phoneModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-transparent p-0 w-[95vw] sm:w-[600px]">
            <div className="rounded-xl bg-white/5 border border-white/20 p-6 w-full">
              <h3 className="text-lg font-semibold text-white mb-4">{t('profile.phoneAddTitle')}</h3>
              <input
                type="tel"
                placeholder={t('profile.phonePlaceholder')}
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full p-2 mb-3 rounded bg-white/20 text-white"
              />
              <p className="text-xs text-white mb-4">
                {t('profile.policy.prefix')}&nbsp;
                <span className="font-semibold">«{t('common.add')}»</span>,&nbsp;
                {t('profile.policy.suffix')}&nbsp;
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#BDA47A] hover:no-underline"
              >
                {t('privacyPolicy')}
              </a>
            </p>
              <p className="text-xs text-white mb-4">
                <strong>{t('dataControllerTitle')}</strong><br />
                {t('dataControllerLine1')}<br />
                {t('dataControllerLine2')}<br />
                {t('dataControllerLine3')} <a href="mailto:info.amuerose@gmail.com" className="underline">info.amuerose@gmail.com</a>
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setPhoneModalOpen(false)}
                  className="px-3 py-1 text-xs rounded-lg border border-white/20 hover:bg-white/10"
                >
                  {t('common.cancel')}
                </button>
                <button
                  disabled={!newPhone}
                  onClick={handleSavePhone}
                  className="px-3 py-1 text-xs rounded-lg bg-[#BDA47A] text-black disabled:opacity-40"
                >
                  {t('common.add')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className="flex flex-col items-center justify-center min-h-[100dvh] pt-[100px] px-4 pb-[80px] sm:pb-[160px] overflow-y-auto"
        style={blogBackgroundStyle}
      >
        <div className="relative max-w-6xl mx-auto bg-[#2e1c12]/70 backdrop-blur-lg rounded-xl p-6 border border-white/10 shadow-xl text-white">

          <h1 className="text-3xl font-semibold text-[#BDA47A] mb-6 text-center">{t('profile.title')}</h1>
          <div className="mt-4 flex">
            <nav className="shrink-0 flex flex-col gap-2 mr-4">
              {Object.entries(TABS).map(([key, value]) => (
                <button
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className={`text-left px-4 py-2 rounded-lg transition ${
                    activeTab === value ? 'bg-white/10 text-[#BDA47A]' : 'hover:bg-white/5'
                  }`}
                >
                  {tabLabel(value)}
                </button>
              ))}
            </nav>
            <div className="flex-1">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
