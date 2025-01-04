import React from 'react';

interface ProfileItemProps {
  profile: { name: string; email: string };
  onSelect: (profile: { name: string; email: string }) => void;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ profile, onSelect }) => {
  return (
    <li className="py-4 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{profile.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
      </div>
      <button
        onClick={() => onSelect(profile)}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition ease-in-out duration-200"
      >
        Selecciona
      </button>
    </li>
  );
};

export default ProfileItem;
