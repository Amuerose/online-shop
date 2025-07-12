import React from 'react';
import { MdPhone, MdEmail, MdHome, MdCake, MdPerson } from 'react-icons/md';

export default function AccountCard({ user }) {
  return (
    <div className="bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_4px_20px_rgba(0,0,0,0.3)] p-6 rounded-xl text-white max-w-md mx-auto transition-all duration-300">
      <div className="flex items-center space-x-6 mb-6">
        <img
          src={user.photoURL || '/default-avatar.png'}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-[#BDA47A]"
        />
        <h2 className="text-3xl font-semibold">{user.displayName || '—'}</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 text-left text-white">
        {user.phoneNumber && (
          <div className="flex items-center space-x-3">
            <MdPhone className="text-[#BDA47A]" size={20} />
            <span>{user.phoneNumber}</span>
          </div>
        )}
        {user.address && (
          <div className="flex items-center space-x-3">
            <MdHome className="text-[#BDA47A]" size={20} />
            <span>{user.address}</span>
          </div>
        )}
        {user.birthday && (
          <div className="flex items-center space-x-3">
            <MdCake className="text-[#BDA47A]" size={20} />
            <span>{user.birthday}</span>
          </div>
        )}
        {user.gender && (
          <div className="flex items-center space-x-3">
            <MdPerson className="text-[#BDA47A]" size={20} />
            <span>{user.gender}</span>
          </div>
        )}
        <div className="flex items-center space-x-3">
          <MdEmail className="text-[#BDA47A]" size={20} />
          <span>{user.email}</span>
        </div>
      </div>
    </div>
  );
}