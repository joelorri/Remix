import React from 'react';
import ProfileItem from './ProfileItem';

interface ProfileListProps {
  profiles: any[];
  onSelect: (profile: any) => void;
}

const ProfileList: React.FC<ProfileListProps> = ({ profiles, onSelect }) => {
  if (!profiles || profiles.length === 0) {
    return <p>No profiles found.</p>;
  }

  return (
    <ul>
      {profiles.map(profile => (
        <ProfileItem key={profile.id} profile={profile} onSelect={onSelect} />
      ))}
    </ul>
  );
};

export default ProfileList;
