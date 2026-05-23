import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function generateUUID() {
  return crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function LessonCard({ lesson, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{lesson.student_name}</h3>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(lesson)} className="text-blue-600 hover:text-blue-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button onClick={() => onDelete(lesson.id)} className="text-red-600 hover:text-red-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
      <div className="space-y-2 text-gray-600">
        <p className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {new Date(lesson.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
        </p>
        <p className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {lesson.time}
        </p>
        <p className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          <a href={lesson.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">{lesson.link}</a>
        </p>
      </div>
    </div>
  );
}

function App() {
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({ student_name: '', date: '', time: '', link: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLessons();
  }, []);

  async function fetchLessons() {
    setLoading(true);
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('date', { ascending: true });
    if (error) console.error(error);
    else setLessons(data);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (editingId) {
      const { error } = await supabase
        .from('lessons')
        .update(form)
        .eq('id', editingId);
      if (error) console.error(error);
    } else {
      const newLesson = { ...form, id: generateUUID() };
      const { error } = await supabase
        .from('lessons')
        .insert([newLesson]);
      if (error) console.error(error);
    }
    setForm({ student_name: '', date: '', time: '', link: '' });
    setEditingId(null);
    await fetchLessons();
    setLoading(false);
  }

  async function handleDelete(id) {
    setLoading(true);
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);
    if (error) console.error(error);
    else await fetchLessons();
    setLoading(false);
  }

  function handleEdit(lesson) {
    setForm({ student_name: lesson.student_name, date: lesson.date, time: lesson.time, link: lesson.link });
    setEditingId(lesson.id);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">📚 Agendamento de Aulas de Inglês</h1>
        
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">{editingId ? 'Editar Aula' : 'Nova Aula'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Nome do Aluno</label>
              <input type="text" name="student_name" value={form.student_name} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: João Silva" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Data</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Hora</label>
              <input type="time" name="time" value={form.time} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Link (Meet/Zoom)</label>
              <input type="url" name="link" value={form.link} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://meet.google.com/..." />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-4">
              {editingId && (
                <button type="button" onClick={() => { setForm({ student_name: '', date: '', time: '', link: '' }); setEditingId(null); }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancelar
                </button>
              )}
              <button type="submit" disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                {loading ? 'Salvando...' : (editingId ? 'Atualizar' : 'Agendar')}
              </button>
            </div>
          </form>
        </div>

        {/* Dashboard Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-700 mb-6">📅 Aulas Agendadas</h2>
          {loading && <p className="text-center text-gray-500">Carregando...</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map(lesson => (
              <LessonCard key={lesson.id} lesson={lesson} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
          {!loading && lessons.length === 0 && (
            <p className="text-center text-gray-500 mt-8">Nenhuma aula agendada. Crie uma nova aula acima.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
