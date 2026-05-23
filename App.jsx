import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: '', date: '', hour: '', link: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  async function fetchClasses() {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('date', { ascending: true });
    if (error) console.error(error);
    else setClasses(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('classes').insert([
      { name: form.name, date: form.date, hour: form.hour, link: form.link },
    ]);
    if (error) {
      console.error(error);
      alert('Erro ao agendar aula.');
    } else {
      setForm({ name: '', date: '', hour: '', link: '' });
      fetchClasses();
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Agendamento de Aulas</h1>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nome do Aluno
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Data da Aula
            </label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hour">
              Horário
            </label>
            <input
              id="hour"
              type="time"
              value={form.hour}
              onChange={(e) => setForm({ ...form, hour: e.target.value })}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="link">
              Link da Aula
            </label>
            <input
              id="link"
              type="url"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? 'Aguardando...' : 'Agendar Aula'}
            </button>
          </div>
        </form>

        <h2 className="text-2xl font-bold mb-4">Aulas Agendadas</h2>
        <div className="space-y-4">
          {classes.length === 0 && (
            <p className="text-gray-500">Nenhuma aula agendada.</p>
          )}
          {classes.map((aula) => (
            <div key={aula.id} className="bg-white shadow-md rounded px-6 py-4">
              <h3 className="text-lg font-semibold">{aula.name}</h3>
              <p className="text-gray-600">
                {aula.date} às {aula.hour}
              </p>
              <a
                href={aula.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Link da Aula
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
