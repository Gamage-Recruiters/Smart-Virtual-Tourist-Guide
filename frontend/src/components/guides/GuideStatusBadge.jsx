const toneByStatus = {
  'Request Open': 'bg-[#e6f8ef] text-[#18794e]',
  Available: 'bg-[#e6f8ef] text-[#18794e]',
  Confirmed: 'bg-[#e6f8ef] text-[#18794e]',
  'Bidding Closed': 'bg-[#fff4dc] text-[#946200]',
  'Guide Selected': 'bg-[#e9f4ff] text-[#176eae]',
  Cancelled: 'bg-[#feeceb] text-[#b42318]',
  Expired: 'bg-[#f1f3f5] text-[#5d6975]',
  Unavailable: 'bg-[#feeceb] text-[#b42318]',
}

export default function GuideStatusBadge({ status = 'Unknown' }) {
  return (
    <span className={`inline-flex self-start rounded-full px-3 py-1 text-xs font-bold ${toneByStatus[status] || 'bg-[#f1f3f5] text-[#5d6975]'}`}>
      <span className="sr-only">Status: </span>{status}
    </span>
  )
}
