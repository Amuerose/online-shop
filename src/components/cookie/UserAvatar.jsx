// src/components/cookie/UserAvatar.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Универсальный аватар + имя/почта.
 * Можно передать user пропсом, иначе возьмёт из AuthContext.
 */
export default function UserAvatar({
  user: userProp,
  size = 80,                 // px
  showName = true,
  showEmail = true,
  className = '',
}) {
  const { user: ctxUser } = useAuth();
  const user = userProp || ctxUser;

  // Имя: пробуем несколько полей из Supabase + OAuth
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    [user?.user_metadata?.given_name, user?.user_metadata?.family_name].filter(Boolean).join(' ') ||
    user?.user_metadata?.preferred_username ||
    (user?.email ? user.email.split('@')[0] : 'User');

  // Helper to resolve avatar from all known places (Google, Facebook, Supabase custom)
  const resolveAvatarUrl = (user) => {
    return (
      user?.user_metadata?.picture ||
      user?.user_metadata?.avatar_url ||
      user?.user_metadata?.photoURL ||
      user?.user_metadata?.avatar ||
      user?.identities?.find(i => i?.identity_data?.picture)?.identity_data?.picture ||
      null
    );
  };
  const providerAvatar = resolveAvatarUrl(user);

  const initials = displayName?.slice(0, 2).toUpperCase();

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {providerAvatar ? (
        <img
          src={providerAvatar}
          alt={displayName}
          width={size}
          height={size}
          className="rounded-full object-cover"
          style={{ width: size, height: size }}
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder.png"; }}
        />
      ) : (
        <div
          className="rounded-full grid place-items-center bg-neutral-700 text-neutral-200 font-semibold"
          style={{ width: size, height: size, fontSize: Math.max(14, size / 3) }}
          aria-label={displayName}
        >
          {initials}
        </div>
      )}

      <div className="min-w-0">
        {showName && <div className="text-lg font-medium truncate">{displayName}</div>}
        {showEmail && <div className="opacity-70 truncate">{user?.email || ''}</div>}
      </div>
    </div>
  );
}