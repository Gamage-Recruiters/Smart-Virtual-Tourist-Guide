import { formatCurrency } from '../../utils/guideFormatters'

export default function BookingPriceSummary({ bid }) {
  return (
    <section className="rounded-2xl border border-[#d9e5ef] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]" aria-labelledby="price-summary-title">
      <h2 id="price-summary-title" className="text-lg font-extrabold">Price summary</h2>
      <div className="mt-5 flex items-center justify-between border-b border-[#edf2f6] pb-4 text-sm">
        <span className="text-[#627587]">Base guide fee</span>
        <span className="font-bold">{formatCurrency(bid?.amount, bid?.currency)}</span>
      </div>
      <div className="mt-4 flex items-center justify-between text-base font-extrabold">
        <span>Total</span>
        <span className="text-[#23669e]">{formatCurrency(bid?.amount, bid?.currency)}</span>
      </div>
      <p className="mt-4 rounded-lg bg-[#fff7e8] px-3 py-2 text-xs leading-5 text-[#77540e]">Payment integration pending. No payment has been processed.</p>
    </section>
  )
}
