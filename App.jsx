import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [formData, setFormData] = useState({ nome: '', data: '', hora: '', link: '' });
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAulas();
  }, []);

  const fetchAulas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('aulas')
      .select('*')
      .order('data', { ascending: true });
    if (!error) setAulas(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('aulas').insert([formData]);
    if (!error) {
      setFormData({ nome: '', data: '', hora: '', link: '' });
      fetchAulas();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Agendamento de Aulas</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Nome</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Data</label>
          <input type="date" name="data" value={formData.data} onChange={handleChange} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Hora</label>
          <input type="time" name="hora" value={formData.hora} onChange={handleChange} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Link da Aula</label>
          <input type="url" name="link" value={formData.link} onChange={handleChange} placeholder="https://..." className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Agendar Aula</button>
      </form>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <div className="w-full max-w-2xl">
          {aulas.length === 0 ? (
            <p className="text-gray-500 text-center">Nenhuma aula agendada.</p>
          ) : (
            <div className="space-y-4">
              {aulas.map((aula) => (
                <div key={aula.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{aula.nome}</h3>
                    <p className="text-gray-500">{aula.data} às {aula.hora}</p>
                    {aula.link && (
                      <a href={aula.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline text-sm">Link da aula</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
