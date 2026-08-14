export default function GuideAvatar({ image, name = 'Guide', className = '', rounded = 'rounded-full' }) {
  if (image) return <img src={image} alt={`${name}, tour guide`} className={`${rounded} bg-[#e9f6ff] object-cover ${className}`} />
  return <span role="img" aria-label={`${name}, tour guide`} className={`grid place-items-center bg-[#dcefff] font-extrabold text-[#285d87] ${rounded} ${className}`}>
    {name.trim().charAt(0).toUpperCase() || 'G'}
  </span>
}
