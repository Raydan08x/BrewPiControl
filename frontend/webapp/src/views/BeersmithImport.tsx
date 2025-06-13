import React, { useState } from 'react';
import toast from 'react-hot-toast';

export function BeersmithImport() {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFilename(f.name);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    toast.loading('Subiendo archivo…');
    // TODO: Implementar subida al backend cuando esté disponible
    setTimeout(() => {
      toast.dismiss();
      toast.success('Archivo recibido (simulado)');
      setFile(null);
      setFilename('');
    }, 1200);
  };

  return (
    <div className="p-8 max-w-xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Importar base de datos BeerSmith</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Sube aquí tu archivo <b>.bsmx</b> o <b>.xml</b> exportado desde BeerSmith 3. Una vez subido, podré analizar y migrar tus recetas, ingredientes y perfiles.
      </p>
      <div className="flex flex-col gap-3">
        <input type="file" accept=".bsmx,.xml" onChange={handleFile} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-brewery-600 file:text-white" />
        {filename && <div className="text-sm text-gray-500">Archivo seleccionado: {filename}</div>}
        <button
          onClick={handleUpload}
          disabled={!file}
          className="mt-2 px-6 py-2 rounded-lg bg-brewery-600 text-white font-semibold disabled:bg-gray-300"
        >
          Subir archivo
        </button>
      </div>
    </div>
  );
}
