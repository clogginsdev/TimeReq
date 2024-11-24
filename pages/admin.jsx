import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function Admin() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch meetings if authorized
    if (isAuthorized) {
      fetchMeetings();
    } else {
      setLoading(false);
    }
  }, [isAuthorized]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (data.authorized) {
        setIsAuthorized(true);
        setPassword('');
      } else {
        setError('Incorrect password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const fetchMeetings = async () => {
    try {
      const response = await fetch('/api/meetings');
      const data = await response.json();
      setMeetings(data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (meetingId, newStatus) => {
    try {
      const response = await fetch(`/api/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        fetchMeetings();
      }
    } catch (error) {
      console.error('Error updating meeting status:', error);
    }
  };

  const formatDateTime = (dateArray) => {
    const [year, month, day, time] = dateArray;
    return `${month}/${day}/${year} at ${time}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white p-8">
        <div className="animate-pulse text-neutral-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <Head>
          <title>Admin Login</title>
        </Head>

        <div className="max-w-md w-full mx-auto p-8">
          <div className="relative w-28 h-28 mx-auto mb-6">
            <Image
              className="rounded-full object-cover shadow-xl ring-2 ring-white/10"
              fill
              src='/images/chris.jpeg'
              alt="Chris Loggins profile image"
            />
          </div>
          
          <h1 className="text-3xl font-medium text-white text-center mb-8">
            Admin Access
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      <Head>
        <title>Admin Dashboard - Meeting Requests</title>
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative w-28 h-28 mx-auto mb-6">
          <Image
            className="rounded-full object-cover shadow-xl ring-2 ring-white/10 hover:ring-white/20 transition-all"
            fill
            src='/images/chris.jpeg'
            alt="Chris Loggins profile image"
          />
        </div>
        
        <h1 className="text-3xl font-medium text-white text-center mb-12">
          Meeting Requests
        </h1>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {meetings.map((meeting) => (
            <div 
              key={meeting._id} 
              className="bg-neutral-800 rounded-lg shadow-lg overflow-hidden hover:ring-2 hover:ring-white/10 transition-all"
            >
              <div className="p-6">
                <h2 className="text-xl font-medium text-white mb-4">{meeting.title}</h2>
                <div className="space-y-2 text-neutral-300">
                  <p className="text-sm">
                    <span className="text-neutral-400">Date: </span>
                    {formatDateTime(meeting.start)}
                  </p>
                  <p className="text-sm">
                    <span className="text-neutral-400">Duration: </span>
                    {meeting.duration.hours}h {meeting.duration.minutes}m
                  </p>
                  <p className="text-sm">
                    <span className="text-neutral-400">Attendee: </span>
                    {meeting.attendees[0].name}
                  </p>
                  <p className="text-sm">
                    <span className="text-neutral-400">Email: </span>
                    {meeting.attendees[0].email}
                  </p>
                  <p className="text-sm">
                    <span className="text-neutral-400">Description: </span>
                    {meeting.description}
                  </p>
                  <p className="text-sm">
                    <span className="text-neutral-400">Status: </span>
                    <span className={
                      meeting.status === 'approved' ? 'text-green-400' :
                      meeting.status === 'denied' ? 'text-red-400' :
                      'text-yellow-400'
                    }>
                      {meeting.status || 'pending'}
                    </span>
                  </p>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleStatusChange(meeting._id, 'approved')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                    disabled={meeting.status === 'approved'}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(meeting._id, 'denied')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                    disabled={meeting.status === 'denied'}
                  >
                    Deny
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
