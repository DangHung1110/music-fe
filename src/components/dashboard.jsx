import React from "react";

const Dashboard = () => {
  const featured = [
    { id: 1, title: "Deep Focus", subtitle: "Tập trung không xao nhãng" },
    { id: 2, title: "Chill Vibes", subtitle: "Thư giãn cuối ngày" },
    { id: 3, title: "Top Hits", subtitle: "BXH Việt Nam" },
    { id: 4, title: "Lo-Fi Beats", subtitle: "Học tập hiệu quả" },
  ];

  return (
    <div data-theme="music" className="music-dashboard">
      <div className="layout">
        <aside className="sidebar">
          <div className="brand">
            <div className="logo">♪</div>
            <span>Music.FE</span>
          </div>
          <nav className="nav">
            <a className="nav-item active" href="#home">🏠 Trang chủ</a>
            <a className="nav-item" href="#browse">🔎 Khám phá</a>
            <a className="nav-item" href="#library">📚 Thư viện</a>
          </nav>
        </aside>

        <main className="content">
          <header className="topbar">
            <div className="search">
              <input placeholder="Tìm bài hát, nghệ sĩ, album..." />
            </div>
            <div className="avatar">NT</div>
          </header>

          <section className="section">
            <h2>Nổi bật hôm nay</h2>
            <div className="cards">
              {featured.map((item) => (
                <button key={item.id} className="card" type="button">
                  <div className="cover" />
                  <div className="meta">
                    <div className="title">{item.title}</div>
                    <div className="subtitle">{item.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>

      <footer className="player">
        <div className="player-left">
          <div className="thumb" />
          <div className="track">
            <div className="song">Có Em</div>
            <div className="artist">Madihu ft. Low G</div>
          </div>
        </div>
        <div className="player-center">
          <button className="btn">⏮</button>
          <button className="btn primary">▶</button>
          <button className="btn">⏭</button>
        </div>
        <div className="player-right">
          <span className="muted">Vol</span>
          <div className="bar small"><div className="bar-fill" style={{ width: "60%" }} /></div>
        </div>
      </footer>

      <style>{`
        [data-theme="music"] {
          --bg: #0b0b0f; --panel: #111318; --panel-2: #151823; --text: #e5e7eb; --muted: #8b8e98; --accent: #1db954; --accent-2: #22d3ee; --card: #181b26; --border: #252836;
        }
        .music-dashboard { background: radial-gradient(900px 400px at 80% -10%, rgba(29,185,84,.12), transparent 60%), radial-gradient(700px 300px at 20% -10%, rgba(34,211,238,.10), transparent 60%), var(--bg); min-height: 100vh; color: var(--text); display: flex; flex-direction: column; }
        .layout { display: grid; grid-template-columns: 240px 1fr; gap: 16px; padding: 16px; padding-bottom: 96px; }
        .sidebar { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 16px; height: calc(100vh - 112px); position: sticky; top: 16px; display: flex; flex-direction: column; }
        .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .logo { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, var(--accent), var(--accent-2)); display: grid; place-items: center; color: #0b0b0f; font-weight: 800; }
        .nav { display: grid; gap: 6px; margin-top: 6px; }
        .nav-item { color: var(--muted); text-decoration: none; padding: 10px 12px; border-radius: 10px; border: 1px solid transparent; transition: .2s; }
        .nav-item:hover { color: var(--text); background: var(--panel-2); border-color: var(--border); transform: translateY(-1px); }
        .nav-item.active { color: var(--text); background: linear-gradient(180deg, rgba(29,185,84,.18), rgba(34,211,238,.08)); border-color: rgba(29,185,84,.25); }
        .content { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 16px; }
        .topbar { display: flex; gap: 12px; align-items: center; justify-content: space-between; }
        .search { flex: 1; background: var(--panel-2); border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; }
        .search input { width: 100%; background: transparent; border: none; outline: none; color: var(--text); }
        .avatar { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #22d3ee33, #1db95433); display: grid; place-items: center; border: 1px solid var(--border); }
        .section { margin-top: 18px; }
        .section h2 { font-size: 16px; margin-bottom: 10px; }
        .cards { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
        .card { text-align: left; background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 10px; transition: .2s; }
        .card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,.35); border-color: rgba(29,185,84,.35); }
        .cover { height: 110px; border-radius: 10px; background: linear-gradient(135deg, rgba(29,185,84,.35), rgba(34,211,238,.25)); border: 1px solid var(--border); }
        .meta { padding: 8px 4px 0; }
        .title { font-weight: 700; font-size: 14px; }
        .subtitle { color: var(--muted); font-size: 12px; margin-top: 4px; }
        .player { position: fixed; left: 16px; right: 16px; bottom: 16px; background: rgba(17,19,24,.9); backdrop-filter: blur(8px); border: 1px solid var(--border); border-radius: 14px; padding: 10px 12px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; }
        .player-left { display: flex; gap: 10px; align-items: center; }
        .player-left .thumb { width: 44px; height: 44px; border-radius: 8px; background: linear-gradient(135deg, rgba(34,211,238,.35), rgba(29,185,84,.35)); border: 1px solid var(--border); }
        .track .song { font-weight: 700; font-size: 14px; }
        .track .artist { color: var(--muted); font-size: 12px; }
        .player-center { display: flex; gap: 10px; justify-content: center; }
        .btn { width: 34px; height: 34px; border-radius: 50%; background: #1a1d28; border: 1px solid var(--border); color: var(--text); cursor: pointer; }
        .btn.primary { background: linear-gradient(135deg, rgba(29,185,84,.5), rgba(34,211,238,.4)); border-color: rgba(29,185,84,.45); }
        .player-right { display: flex; gap: 10px; align-items: center; justify-content: flex-end; color: var(--muted); }
        .bar { position: relative; width: 120px; height: 6px; background: #1a1d28; border: 1px solid var(--border); border-radius: 999px; overflow: hidden; }
        .bar-fill { position: absolute; inset: 0 auto 0 0; background: linear-gradient(90deg, var(--accent), var(--accent-2)); }
        @media (max-width: 960px) { .layout { grid-template-columns: 1fr; } .sidebar { position: relative; height: auto; } .cards { grid-template-columns: repeat(2, minmax(0,1fr)); } }
      `}</style>
    </div>
  );
};

export default Dashboard;
