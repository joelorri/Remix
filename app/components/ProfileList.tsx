import React from 'react';
import ProfileItem from './ProfileItem';

interface ProfileListProps {
  profiles: any[];
  onSelect: (profile: any) => void;
}

const ProfileList: React.FC<ProfileListProps> = ({ profiles, onSelect }) => {
  if (!profiles || profiles.length === 0) {
    return <p className="text-center text-gray-600 dark:text-gray-400 mt-4">No s'han trobat perfils.</p>;
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {profiles.map((profile) => (
        <ProfileItem key={profile.id} profile={profile} onSelect={onSelect} />
      ))}
    </ul>
  );
};

export default ProfileList;
