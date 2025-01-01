import React from 'react';

interface ProfileItemProps {
  profile: {
    id: number;
    name: string;
    email: string;
    role: string;
    image: string;
    created_at: string;
  };
  onSelect: (profile: any) => void;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ profile, onSelect }) => {
  return (
    <li>
      <div>
        <img
          src={`path-to-your-images/${profile.image}`}
          alt={profile.name}
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
        />
        <strong>{profile.name}</strong> - {profile.email}
        <p>Rol: {profile.role}</p>
        <p>Creado en: {new Date(profile.created_at).toLocaleString()}</p>
        <button onClick={() => onSelect(profile)}>Seleccionar DJ</button>
      </div>
    </li>
  );
};

export default ProfileItem;
