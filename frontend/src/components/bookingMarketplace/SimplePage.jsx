function SimplePage({ title }) {
  return (
    <div className="bg-white rounded-3xl h-[500px] flex items-center justify-center shadow-sm">
      <h2 className="text-4xl font-bold text-gray-400">{title}</h2>
    </div>
  );
}

export default SimplePage