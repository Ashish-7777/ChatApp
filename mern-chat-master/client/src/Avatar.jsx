export default function Avatar({ userId, username, online }) {
  const colors = ['bg-sky-400', 'bg-indigo-400',
                  'bg-emerald-400', 'bg-amber-400',
                  'bg-rose-400', 'bg-violet-400',
                  'bg-lime-400', 'bg-cyan-400', 
                  'bg-fuchsia-400', 'bg-orange-400'];
  const userIdBase10 = parseInt(userId.substring(10), 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <div className={`w-8 h-8 relative rounded-full flex items-center justify-center ${color} border-2 border-white`}>
      <div className="text-center w-full text-white font-bold">{username[0]}</div>
      {online && (
        <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white"></div>
      )}
      {!online && (
        <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border border-white"></div>
      )}
    </div>
  );
}
