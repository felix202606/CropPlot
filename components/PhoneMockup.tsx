const beds = [
  ["🍅", "🌿", "🍅", "🧅"],
  ["🥕", "🥬", "🥕", "🥬"],
  ["🫑", "🌿", "🫑", "🌼"],
];

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-72 rounded-[2.75rem] border-[10px] border-soil-900 bg-soil-50 shadow-2xl shadow-leaf-900/30">
      <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-soil-900" />
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs text-soil-900/60">Good morning 🌱</p>
          <p className="font-display text-xl font-semibold">Backyard Bed A</p>
        </div>

        <div className="rounded-2xl bg-sky-50 p-3 text-xs ring-1 ring-sky-200">
          <p className="font-semibold text-sky-900">❄️ Frost tonight: −1 °C</p>
          <p className="mt-1 text-sky-900/70">Cover tomatoes and peppers before 8 pm.</p>
        </div>

        <div className="grid grid-cols-4 gap-1.5 rounded-2xl bg-soil-100 p-2">
          {beds.flat().map((e, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-lg bg-[#7a5a3a]/15 text-xl"
            >
              {e}
            </div>
          ))}
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-soil-100">
            <span>💧 Water carrots</span>
            <span className="rounded-full bg-leaf-100 px-2 py-0.5 font-semibold text-leaf-700">Today</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-soil-100">
            <span>🥗 Saved this season</span>
            <span className="font-semibold text-leaf-700">$214.60</span>
          </div>
        </div>
      </div>
    </div>
  );
}
