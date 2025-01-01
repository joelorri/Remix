// components/TrackList.tsx

import React from 'react';
interface Track {
    id: string;
    name: string;
    artist: string;
    album: string;
  }
interface TrackListProps {
  tracks: Track[];
  selectedTracks: { [id: string]: string };
  setSelectedTracks: React.Dispatch<React.SetStateAction<{ [id: string]: string }>>;
  comments: { [id: string]: string };
  setComments: React.Dispatch<React.SetStateAction<{ [id: string]: string }>>;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  selectedTracks,
  setSelectedTracks,
  comments,
  setComments,
}) => {

  const handleTrackSelect = (trackId: string) => {
    setSelectedTracks(prev => {
      const newSelectedTracks = { ...prev };
      if (newSelectedTracks[trackId]) {
        delete newSelectedTracks[trackId];
      } else {
        newSelectedTracks[trackId] = trackId;
      }
      return newSelectedTracks;
    });
  };

  const handleCommentChange = (trackId: string, comment: string) => {
    setComments(prev => ({
      ...prev,
      [trackId]: comment,
    }));
  };

  return (
    <ul className="space-y-4">
      {tracks.map(track => (
        <li key={track.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span>
                <iframe
                  title={`Spotify track ${track.name} by ${track.artist}`}
                  src={`https://open.spotify.com/embed/track/${track.id}`}
                  width="100%"
                  height="80"
                  allow="encrypted-media"
                  className="rounded-md"
                ></iframe>
              </span>
              <input
                type="checkbox"
                checked={!!selectedTracks[track.id]}
                onChange={() => handleTrackSelect(track.id)}
              />
            </div>
            <textarea
              placeholder="Escriu un comentari..."
              value={comments[track.id] || ''}
              onChange={e => handleCommentChange(track.id, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TrackList;
