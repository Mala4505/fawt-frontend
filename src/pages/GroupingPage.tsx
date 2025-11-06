import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
// import GroupCard from '../components/GroupCard';
import GroupForm from '../components/GroupForm';
import { User, Group } from '../types';

export default function GroupingPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [userRes, groupRes] = await Promise.all([
      axios.get('/api/users/?role=student'),
      axios.get('/api/group-list/')
    ]);
    setStudents(userRes.data);
    setGroups(groupRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGroupCreated = (newGroup: Group) => {
    setGroups(prev => [...prev, newGroup]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Student Grouping</h1>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-700">Ungrouped Students</h2>
              {students.map(s => (
                <div key={s.id} className="text-slate-600">
                  {s.name} ({s.trNumber})
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-700">Create New Group</h2>
              <GroupForm students={students} onCreated={handleGroupCreated} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-700">Existing Groups</h2>
              {/* {groups.map(group => (
                <GroupCard key={group.id} group={group} />
              ))} */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
