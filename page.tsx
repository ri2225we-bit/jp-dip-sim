'use client';

import { useEffect, useMemo, useState } from 'react';

type Dip = { symbol: string; pct: number; last: number; prevClose: number; };

export default function Home() {
  const [dips, setDips] = useState<Dip[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState<string>('');
  const [excluded, setExcluded] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch('/api/top-dips', { cache: 'no-store' });
      const rows: Dip[] = await res.json();

      // filter by news keywords
      try {
        const symbols = rows.map(r=>r.symbol);
        const nres = await fetch('/api/filter-news', { method:'POST', body: JSON.stringify({ symbols })});
        const njson = await nres.json();
        setExcluded(njson.exclude || []);
      } catch(e) {}

      setDips(rows);
      setLoading(false);
    })();
  }, []);

  const clean = useMemo(()=>dips.filter(d=>!excluded.includes(d.symbol)), [dips, excluded]);

  async function place(symbol: string, side: 'buy'|'sell') {
    const qty = 1;
    setPlacing(symbol + side);
    const r = await fetch('/api/order', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ symbol, qty, side })
    });
    const j = await r.json();
    alert(`注文: ${j.symbol} ${j.side} x${j.qty} -> ${j.status || 'OK'}`);
    setPlacing('');
  }

  return (
    <main>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">今日の過剰反応ランキング（紙トレ）</h1>
        <p className="text-sm text-gray-500">「落ちたけど壊れていない」候補を自動抽出。ニュースがネガ寄りの銘柄は除外。</p>
      </header>

      {loading ? <div>読み込み中...</div> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {clean.map(row => (
            <div key={row.symbol} className="border rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{row.symbol}</div>
                <div className={"text-sm font-bold " + (row.pct < 0 ? "text-red-600" : "text-green-600")}>
                  {row.pct.toFixed(2)}%
                </div>
              </div>
              <div className="text-sm text-gray-500">Last ${row.last.toFixed(2)} / Prev ${row.prevClose.toFixed(2)}</div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={()=>place(row.symbol, 'buy')}
                  disabled={placing === row.symbol+'buy'}
                  className="px-3 py-2 rounded-xl bg-black text-white text-sm disabled:opacity-50"
                >{placing === row.symbol+'buy' ? '発注中…' : '逆張りBUY（紙）'}</button>
                <button
                  onClick={()=>place(row.symbol, 'sell')}
                  disabled={placing === row.symbol+'sell'}
                  className="px-3 py-2 rounded-xl bg-gray-200 text-sm disabled:opacity-50"
                >{placing === row.symbol+'sell' ? '発注中…' : 'SELL（紙）'}</button>
              </div>
              <div className="mt-2 text-xs text-gray-500">{excluded.includes(row.symbol) ? 'ニュース要因：ネガ → 除外' : 'ニュース要因：軽微／不明'}</div>
            </div>
          ))}
        </div>
      )}
      <footer className="mt-8 text-xs text-gray-400">
        ※ Alpaca Paper API を利用したシミュレーターです。実売買ではありません。
      </footer>
    </main>
  );
}
