import { useState, useEffect, createContext, useContext } from "react";

const EditorContext = createContext(null);
const useEditor = () => useContext(EditorContext);

const API = "https://humpty-dumpty-api.onrender.com/api"; //

const DEFAULT_SETTINGS = {
  siteName: "Humpty Dumpty",
  tagline: "Jharia Ka Sabse Pyara Dhaba",
  heroTitle: "Ghar Jaisi Rasoi,\nYahan Milti Hai.",
  heroSubtitle: "Jharia, Dhanbad ke dil mein basa humara restaurant — fresh masaledaar khaana, warm service, aur yaadgaar swad.",
  primaryColor: "#E8521A",
  accentColor: "#F5A623",
  darkColor: "#1A0A00",
  phone: "+91 98765 43210",
  address: "4 No. Koiry Bandh, Jharia, Dhanbad, Jharkhand - 828111",
  email: "info@humptydumpty.in",
  openHours: "Subah 7 baje se Raat 11 baje tak",
  gstNo: "20AAAAA0000A1Z5",
  upiId: "humptydumpty@upi",
};

const ADMIN_PASSWORD = "HumptyAdmin@2024";

const fmt = (n) => `₹${Number(n).toFixed(0)}`;

const MENU_ITEMS = [
  { _id:"1", name:"Masala Dosa", description:"Crispy rice crepe with spiced potato, sambar & chutneys", price:89, category:"breakfast", image:"https://ibb.co/bjt3WbZw", badge:"Chef's Pick", isVeg:true },
  { _id:"2", name:"Poha Deluxe", description:"Flattened rice with mustard, curry leaves, peanuts & coriander", price:65, category:"breakfast", emoji:"🍚", isVeg:true },
  { _id:"3", name:"Idli Sambar", description:"Steamed rice cakes with hot sambar & 3 chutneys", price:70, category:"breakfast", emoji:"🍥", isVeg:true },
  { _id:"4", name:"Chole Bhature", description:"Fluffy bhatura with spicy chole & pickled onions", price:120, category:"mains", emoji:"🫓", badge:"Bestseller", isVeg:true },
  { _id:"5", name:"Butter Chicken", description:"Tandoor chicken in rich creamy tomato-butter gravy", price:220, category:"mains", emoji:"🍛", badge:"Fan Fav" },
  { _id:"6", name:"Dal Makhani", description:"Slow-cooked kali dal in buttery gravy, best with naan", price:160, category:"mains", emoji:"🫕", isVeg:true },
  { _id:"7", name:"Paneer Butter Masala", description:"Soft paneer in rich mildly spiced tomato-cream gravy", price:190, category:"mains", emoji:"🍛", isVeg:true },
  { _id:"8", name:"Jharia Special Biryani", description:"Fragrant basmati with slow-cooked mutton, fried onions & saffron", price:280, category:"biryani", emoji:"🍲", badge:"Must Try" },
  { _id:"9", name:"Chicken Biryani", description:"Spiced chicken with basmati rice, served with raita", price:220, category:"biryani", emoji:"🍲", badge:"Bestseller" },
  { _id:"10", name:"Veg Dum Biryani", description:"Mixed vegetables & paneer in aromatic dum biryani", price:180, category:"biryani", emoji:"🍲", isVeg:true },
  { _id:"11", name:"Gulab Jamun", description:"Soft milk dumplings in rose-cardamom sugar syrup", price:70, category:"desserts", emoji:"🍮", isVeg:true },
  { _id:"12", name:"Rasmalai", description:"Soft rasgullas in chilled saffron-cardamom rabdi", price:90, category:"desserts", emoji:"🥛", badge:"Fan Fav", isVeg:true },
  { _id:"13", name:"Mango Lassi", description:"Chilled lassi with Alphonso mango & cardamom", price:80, category:"drinks", emoji:"🥭", isVeg:true },
  { _id:"14", name:"Masala Chai", description:"Strong chai with ginger, cardamom & whole spices", price:35, category:"drinks", emoji:"☕", isVeg:true },
  { _id:"15", name:"Fresh Lime Soda", description:"Sweet ya salt, nimbu & kala namak ke saath", price:50, category:"drinks", emoji:"🍋", isVeg:true },
];

// ── GLOBAL STYLES ─────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'DM Sans', system-ui, sans-serif; background: #FFF8F4; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: #E8521A; border-radius: 2px; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
    @keyframes wobble { 0%,100%{transform:translateY(-50%) rotate(-4deg)} 50%{transform:translateY(-54%) rotate(4deg)} }
    @keyframes wobbleMobile { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
    @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    @keyframes modalIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
    @keyframes slideUp { from{opacity:0;transform:translate(-50%,20px)} to{opacity:1;transform:translate(-50%,0)} }
    @keyframes floatBubble { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes spin { to{transform:rotate(360deg)} }

    /* Mobile navbar fix */
    @media (max-width: 768px) {
      .nav-links-desktop { display: none !important; }
      .hero-egg-desktop { display: none !important; }
      .about-grid { grid-template-columns: 1fr !important; }
      .reservation-grid { grid-template-columns: 1fr !important; }
      .footer-inner { flex-direction: column !important; text-align: center !important; gap: 16px !important; }
      .stats-row { gap: 20px !important; flex-wrap: wrap !important; }
      .form-row-2 { grid-template-columns: 1fr !important; }
    }
    @media (min-width: 769px) {
      .mobile-menu-btn { display: none !important; }
      .mobile-nav-drawer { display: none !important; }
    }
  `}</style>
);

// ── ADMIN LOGIN ───────────────────────────────────────
function EditorLogin({ onSuccess }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const check = () => {
    setLoading(true);
    setTimeout(() => {
      if (pwd === ADMIN_PASSWORD) { onSuccess(); }
      else { setError(true); setLoading(false); setTimeout(() => setError(false), 2000); }
    }, 600);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(26,10,0,0.9)", backdropFilter:"blur(8px)", zIndex:9998, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#fff", borderRadius:24, padding:"36px 28px", width:"100%", maxWidth:360, textAlign:"center", boxShadow:"0 24px 60px rgba(0,0,0,0.4)", animation:"modalIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div style={{ fontSize:52, marginBottom:12 }}>🔐</div>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:"1.4rem", fontWeight:900, marginBottom:6 }}>Admin Login</h2>
        <p style={{ color:"#888", fontSize:"0.83rem", marginBottom:24, lineHeight:1.5 }}>Sirf admin hi site edit kar sakta hai</p>
        <input
          type="password"
          placeholder="Password daalo..."
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          onKeyDown={e => e.key === "Enter" && check()}
          style={{ width:"100%", padding:"13px 16px", border:`2px solid ${error ? "#e74c3c" : "#e0e0e0"}`, borderRadius:12, fontSize:"1rem", outline:"none", marginBottom:10, fontFamily:"inherit", transition:"border 0.2s" }}
        />
        {error && <p style={{ color:"#e74c3c", fontSize:"0.8rem", marginBottom:10 }}>❌ Wrong password!</p>}
        <button onClick={check} disabled={loading} style={{ width:"100%", padding:14, background:"#E8521A", color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:"0.95rem", cursor:"pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "⏳ Checking..." : "Login Karo →"}
        </button>
      </div>
    </div>
  );
}

// ── EDITOR PANEL ──────────────────────────────────────
function EditorPanel({ settings, onUpdate, onSave, onClose }) {
  const [local, setLocal] = useState(settings);
  const [loggedIn, setLoggedIn] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!loggedIn) return <EditorLogin onSuccess={() => setLoggedIn(true)} />;

  const update = (key, val) => {
    const next = { ...local, [key]: val };
    setLocal(next);
    onUpdate(next);
  };

  const handleSave = () => {
    onSave(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Field = ({ label, k, type="text", rows }) => (
    <div style={{ marginBottom:12 }}>
      <label style={{ fontSize:10, fontWeight:700, color:"#999", letterSpacing:0.8, display:"block", marginBottom:5, textTransform:"uppercase" }}>{label}</label>
      {rows ? (
        <textarea rows={rows} value={local[k]||""} onChange={e=>update(k,e.target.value)}
          style={{ width:"100%", padding:"9px 11px", borderRadius:8, border:"1.5px solid #e8e8e8", fontFamily:"inherit", fontSize:13, resize:"vertical", outline:"none" }} />
      ) : (
        <input type={type} value={local[k]||""} onChange={e=>update(k,e.target.value)}
          style={{ width:"100%", padding:"9px 11px", borderRadius:8, border:"1.5px solid #e8e8e8", fontFamily:"inherit", fontSize:13, outline:"none" }} />
      )}
    </div>
  );

  const Section = ({ label, children }) => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ marginBottom:18 }}>
        <button onClick={()=>setOpen(!open)} style={{ width:"100%", textAlign:"left", background:"#f5f5f5", border:"none", borderRadius:8, padding:"8px 12px", fontWeight:700, fontSize:11, cursor:"pointer", color:"#444", marginBottom:open?10:0, letterSpacing:0.3 }}>
          {open?"▼":"▶"} {label}
        </button>
        {open && children}
      </div>
    );
  };

  return (
    <div style={{ position:"fixed", right:0, top:0, bottom:0, width:"min(320px, 100vw)", background:"#fff", boxShadow:"-4px 0 40px rgba(0,0,0,0.15)", zIndex:9999, overflowY:"auto", fontFamily:"system-ui,sans-serif" }}>
      <div style={{ padding:"18px 20px 14px", borderBottom:"1px solid #f0f0f0", background:"#1A0A00", color:"#fff", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:1 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:700 }}>✏️ Live Editor</div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", marginTop:1 }}>Changes save to MongoDB</div>
        </div>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", width:30, height:30, borderRadius:"50%", cursor:"pointer", fontSize:14 }}>✕</button>
      </div>
      <div style={{ padding:"16px 16px 80px" }}>
        <Section label="🏠 Branding">
          <Field label="Restaurant Name" k="siteName" />
          <Field label="Tagline" k="tagline" />
          <Field label="Hero Title" k="heroTitle" rows={3} />
          <Field label="Hero Subtitle" k="heroSubtitle" rows={3} />
        </Section>
        <Section label="🎨 Colors">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
            {[["Primary","primaryColor"],["Accent","accentColor"],["Dark","darkColor"]].map(([lbl,k]) => (
              <div key={k}>
                <div style={{ fontSize:9, color:"#999", marginBottom:4, fontWeight:700, textTransform:"uppercase" }}>{lbl}</div>
                <input type="color" value={local[k]||"#000"} onChange={e=>update(k,e.target.value)} style={{ width:"100%", height:38, borderRadius:8, border:"1.5px solid #e8e8e8", cursor:"pointer" }} />
              </div>
            ))}
          </div>
        </Section>
        <Section label="📞 Contact">
          <Field label="Phone" k="phone" />
          <Field label="Address" k="address" rows={2} />
          <Field label="Email" k="email" />
          <Field label="Opening Hours" k="openHours" />
        </Section>
        <Section label="💳 Payment">
          <Field label="UPI ID" k="upiId" />
          <Field label="GST Number" k="gstNo" />
        </Section>
      </div>
      <div style={{ position:"sticky", bottom:0, padding:"12px 16px", background:"#fff", borderTop:"1px solid #f0f0f0" }}>
        <button onClick={handleSave} style={{ width:"100%", padding:13, background: saved ? "#2E7D32" : "#E8521A", color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:14, cursor:"pointer", transition:"background 0.3s" }}>
          {saved ? "✅ Saved!" : "💾 Save All Changes"}
        </button>
      </div>
    </div>
  );
}

// ── NAVBAR ─────────────────────────────────────────────
function Navbar({ settings, cartCount, onOrderClick }) {
  const { setEditorOpen } = useEditor();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [["Menu","#menu"],["Biryani","#menu"],["Table Book","#reservation"],["Location","#location"]];

  return (
    <>
      <nav style={{ position:"fixed", top:0, width:"100%", zIndex:500, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px", background: scrolled ? "rgba(26,10,0,0.97)" : "rgba(26,10,0,0.88)", backdropFilter:"blur(12px)", transition:"all 0.3s", boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.3)" : "none" }}>
        <div style={{ fontFamily:"Georgia,serif", fontSize:"1.25rem", fontWeight:700, color:"#fff" }}>
          {settings.siteName}<span style={{ color:settings.accentColor }}>.</span>
        </div>

        {/* Desktop Links */}
        <div className="nav-links-desktop" style={{ display:"flex", gap:24 }}>
          {links.map(([l,h]) => (
            <a key={l} href={h} style={{ color:"rgba(255,255,255,0.75)", textDecoration:"none", fontSize:"0.86rem", fontWeight:500, transition:"color 0.2s" }}
              onMouseOver={e=>e.target.style.color="#fff"} onMouseOut={e=>e.target.style.color="rgba(255,255,255,0.75)"}>{l}</a>
          ))}
        </div>

        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {/* Edit button - desktop only */}
          <button onClick={()=>setEditorOpen(true)} className="nav-links-desktop" style={{ background:"rgba(255,255,255,0.1)", color:"#fff", border:"1px solid rgba(255,255,255,0.2)", padding:"7px 14px", borderRadius:50, fontSize:"0.78rem", cursor:"pointer" }}>
            ✏️ Edit
          </button>

          {/* Order button */}
          <button onClick={onOrderClick} style={{ background:settings.primaryColor, color:"#fff", border:"none", padding:"9px 16px", borderRadius:50, fontWeight:600, fontSize:"0.82rem", cursor:"pointer", display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
            🛒 {cartCount > 0 ? `(${cartCount})` : "Order"}
          </button>

          {/* Mobile hamburger */}
          <button className="mobile-menu-btn" onClick={()=>setMobileOpen(!mobileOpen)} style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"#fff", width:36, height:36, borderRadius:8, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mobile-nav-drawer" style={{ position:"fixed", top:56, left:0, right:0, background:"rgba(26,10,0,0.98)", zIndex:499, padding:"20px", display:"flex", flexDirection:"column", gap:4, borderBottom:`2px solid ${settings.primaryColor}` }}>
          {links.map(([l,h]) => (
            <a key={l} href={h} onClick={()=>setMobileOpen(false)} style={{ color:"#fff", textDecoration:"none", padding:"13px 16px", borderRadius:10, fontSize:"1rem", fontWeight:500, display:"block", background:"rgba(255,255,255,0.05)" }}>
              {l}
            </a>
          ))}
          <button onClick={()=>{setEditorOpen(true);setMobileOpen(false)}} style={{ background:settings.primaryColor, color:"#fff", border:"none", padding:"13px 16px", borderRadius:10, fontWeight:600, cursor:"pointer", fontSize:"1rem", marginTop:8, textAlign:"left" }}>
            ✏️ Edit Site (Admin)
          </button>
        </div>
      )}
    </>
  );
}

// ── HERO ───────────────────────────────────────────────
function Hero({ settings }) {
  const lines = settings.heroTitle.split("\n");
  return (
    <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", background:`linear-gradient(135deg, ${settings.darkColor} 0%, #3D1A0A 60%, #1A0A00 100%)`, padding:"100px 20px 60px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", right:-60, top:"50%", transform:"translateY(-50%)", width:"min(500px,80vw)", height:"min(500px,80vw)", borderRadius:"50%", background:`radial-gradient(circle, ${settings.accentColor}18 0%, transparent 70%)`, pointerEvents:"none" }} />

      <div style={{ maxWidth:640, position:"relative", zIndex:2, width:"100%" }}>
        <div style={{ fontFamily:"cursive", fontSize:"clamp(0.95rem,3vw,1.1rem)", color:settings.accentColor, marginBottom:14, animation:"fadeUp 0.7s 0.2s both" }}>
          ✦ Jharia, Dhanbad · {settings.tagline}
        </div>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(2.4rem,7vw,5rem)", fontWeight:900, lineHeight:1.05, letterSpacing:-1, color:"#fff", margin:0, animation:"fadeUp 0.7s 0.4s both" }}>
          {lines.map((l,i) => <span key={i} style={{ display:"block", color: i===1 ? settings.accentColor : "#fff", fontStyle: i===1 ? "italic" : "normal" }}>{l}</span>)}
        </h1>
        <p style={{ marginTop:16, fontSize:"clamp(0.9rem,2.5vw,1.05rem)", color:"rgba(255,255,255,0.65)", lineHeight:1.75, maxWidth:480, animation:"fadeUp 0.7s 0.6s both" }}>
          {settings.heroSubtitle}
        </p>

        {/* Mobile emoji */}
        <div style={{ fontSize:80, textAlign:"center", margin:"24px 0 8px", animation:"wobbleMobile 4s ease-in-out infinite" }} className="hero-egg-mobile">🍛</div>

        <div style={{ display:"flex", gap:12, marginTop:20, flexWrap:"wrap", animation:"fadeUp 0.7s 0.8s both" }}>
          <a href="#menu" style={{ background:settings.primaryColor, color:"#fff", padding:"13px 28px", borderRadius:50, fontWeight:600, fontSize:"clamp(0.85rem,2.5vw,0.95rem)", textDecoration:"none", flex:1, textAlign:"center", minWidth:140 }}>
            Menu Dekho 🍽️
          </a>
          <a href="#reservation" style={{ background:"transparent", color:"#fff", padding:"13px 28px", borderRadius:50, fontWeight:600, fontSize:"clamp(0.85rem,2.5vw,0.95rem)", textDecoration:"none", border:"2px solid rgba(255,255,255,0.35)", flex:1, textAlign:"center", minWidth:140 }}>
            Table Book Karo
          </a>
        </div>

        <div className="stats-row" style={{ display:"flex", gap:28, marginTop:40, animation:"fadeUp 0.7s 1s both" }}>
          {[["4.9★","Rating"],["15K+","Grahak"],["12 Saal","Seva"],["Roz Taaza","Khaana"]].map(([n,l]) => (
            <div key={l}>
              <div style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.2rem,4vw,1.6rem)", fontWeight:900, color:"#fff" }}>{n}</div>
              <div style={{ fontSize:"clamp(0.65rem,2vw,0.75rem)", color:"rgba(255,255,255,0.5)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop floating emoji */}
      <div className="hero-egg-desktop" style={{ position:"absolute", right:60, top:"50%", fontSize:140, animation:"wobble 4s ease-in-out infinite", filter:`drop-shadow(0 20px 40px ${settings.accentColor}44)` }}>🍛</div>

      <style>{`
        @media (min-width: 769px) { .hero-egg-mobile { display: none !important; } }
        @media (max-width: 768px) { .hero-egg-mobile { display: block !important; } }
      `}</style>
    </section>
  );
}

// ── MARQUEE ─────────────────────────────────────────────
function Marquee({ settings }) {
  const items = ["🍛 Butter Chicken","🫓 Masala Dosa","🍲 Dum Biryani","🥭 Mango Lassi","🍮 Gulab Jamun","☕ Masala Chai","🫕 Dal Makhani","🍋 Nimbu Soda"];
  const text = [...items,...items].map((t,i) => <span key={i} style={{ margin:"0 24px" }}>{t}</span>);
  return (
    <div style={{ background:settings.primaryColor, padding:"12px 0", overflow:"hidden", whiteSpace:"nowrap" }}>
      <div style={{ display:"inline-block", animation:"marquee 22s linear infinite", fontFamily:"Georgia,serif", fontSize:"0.9rem", color:"#fff" }}>{text}</div>
    </div>
  );
}

// ── MENU CARD ───────────────────────────────────────────
function MenuCard({ item, settings, onAdd }) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    onAdd(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };
  return (
    <div style={{ background:"#fff", borderRadius:18, overflow:"hidden", border:"1px solid rgba(0,0,0,0.07)", transition:"transform 0.3s,box-shadow 0.3s", cursor:"pointer" }}
      onMouseOver={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow="0 16px 40px rgba(0,0,0,0.1)"}}
      onMouseOut={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
      <div style={{ height:140, display:"flex", alignItems:"center", justifyContent:"center", background:`linear-gradient(135deg, ${settings.accentColor}20, ${settings.primaryColor}15)`, fontSize:60, position:"relative" }}>
        <span>{item.emoji}</span>
        <div style={{ position:"absolute", top:0, right:0, display:"flex", gap:5, padding:8 }}>
          {item.isVeg && <span style={{ background:"#2E7D32", color:"#fff", fontSize:"0.6rem", fontWeight:700, padding:"3px 7px", borderRadius:50 }}>VEG</span>}
          {item.badge && <span style={{ background:settings.primaryColor, color:"#fff", fontSize:"0.6rem", fontWeight:700, padding:"3px 7px", borderRadius:50 }}>{item.badge}</span>}
        </div>
      </div>
      <div style={{ padding:"14px 14px 16px" }}>
        <div style={{ fontFamily:"Georgia,serif", fontSize:"1rem", fontWeight:700, marginBottom:4 }}>{item.name}</div>
        <div style={{ fontSize:"0.78rem", color:"#888", lineHeight:1.5, marginBottom:12 }}>{item.description}</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"Georgia,serif", fontSize:"1.15rem", fontWeight:900 }}>{fmt(item.price)}</span>
          <button onClick={handleAdd} style={{ width:36, height:36, borderRadius:"50%", background: added ? "#2E7D32" : settings.accentColor, border:"none", color: added ? "#fff" : settings.darkColor, fontSize:"1.1rem", fontWeight:700, cursor:"pointer", transition:"all 0.2s", transform: added ? "scale(1.15)" : "scale(1)", minWidth:36 }}>
            {added ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MENU SECTION ────────────────────────────────────────
function MenuSection({ settings, onAddToCart }) {
  const [activeTab, setActiveTab] = useState("all");
  const tabs = [["all","Sab"],["breakfast","Nashta"],["mains","Main"],["biryani","Biryani"],["desserts","Meetha"],["drinks","Drinks"]];
  const items = activeTab === "all" ? MENU_ITEMS : MENU_ITEMS.filter(i => i.category === activeTab);

  return (
    <section id="menu" style={{ padding:"70px 16px", background:"#FFF8F4" }}>
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{ fontFamily:"cursive", fontSize:"1.05rem", color:settings.accentColor, marginBottom:6 }}>Humara Menu</div>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.8rem,5vw,3rem)", fontWeight:900, letterSpacing:-1 }}>Aaj Kya Khana Hai?</h2>
      </div>

      {/* Scrollable tabs on mobile */}
      <div style={{ display:"flex", gap:8, marginBottom:36, overflowX:"auto", paddingBottom:4, WebkitOverflowScrolling:"touch", scrollbarWidth:"none", justifyContent:"center", flexWrap:"wrap" }}>
        {tabs.map(([val,lbl]) => (
          <button key={val} onClick={()=>setActiveTab(val)} style={{ padding:"8px 18px", borderRadius:50, border:`2px solid ${activeTab===val ? settings.darkColor : "transparent"}`, background: activeTab===val ? settings.darkColor : "rgba(0,0,0,0.06)", color: activeTab===val ? "#fff" : "#555", fontWeight:500, fontSize:"0.84rem", cursor:"pointer", transition:"all 0.2s", whiteSpace:"nowrap", flexShrink:0 }}>
            {lbl}
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(260px,100%),1fr))", gap:20, maxWidth:1200, margin:"0 auto" }}>
        {items.map(item => <MenuCard key={item._id} item={item} settings={settings} onAdd={onAddToCart} />)}
      </div>
    </section>
  );
}

// ── RESERVATION ─────────────────────────────────────────
function ReservationSection({ settings }) {
  const [form, setForm] = useState({ name:"", phone:"", email:"", date:"", time:"", guests:"2", message:"" });
  const [status, setStatus] = useState(null);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const submit = async () => {
    if (!form.name || !form.phone || !form.date || !form.time) { setStatus("error"); return; }
    setStatus("loading");
    try {
      const res = await fetch(`${API}/reservations`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      const data = await res.json();
      setStatus(data.success ? "success" : "error");
    } catch { setStatus("success"); }
  };

  const inp = { width:"100%", padding:"11px 13px", border:"1.5px solid #e0e0e0", borderRadius:10, fontFamily:"inherit", fontSize:"0.9rem", outline:"none", boxSizing:"border-box" };

  return (
    <section id="reservation" style={{ padding:"70px 16px", background:settings.darkColor }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>
        <div className="reservation-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:50, alignItems:"center" }}>
          {/* Left info */}
          <div>
            <div style={{ fontFamily:"cursive", fontSize:"1.05rem", color:settings.accentColor, marginBottom:10 }}>Table Book Karo</div>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.8rem,5vw,2.5rem)", fontWeight:900, color:"#fff", lineHeight:1.15, letterSpacing:-1, margin:"0 0 14px" }}>
              Aapka Swagat<br/><em style={{ color:settings.accentColor }}>Hamare Yahan</em>
            </h2>
            <p style={{ color:"rgba(255,255,255,0.6)", lineHeight:1.75, marginBottom:24, fontSize:"0.9rem" }}>
              Apna table pehle se book karo aur bina wait ke aaiye.
            </p>
            {[["📞",settings.phone],["📍",settings.address],["⏰",settings.openHours]].map(([icon,val]) => (
              <div key={icon} style={{ display:"flex", gap:10, marginBottom:12, alignItems:"flex-start" }}>
                <span style={{ fontSize:"1rem", marginTop:1 }}>{icon}</span>
                <div style={{ color:"#fff", fontSize:"0.88rem", lineHeight:1.5 }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ background:"#fff", borderRadius:20, padding:"24px 20px" }}>
            {status === "success" ? (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ fontSize:56, marginBottom:10 }}>🎉</div>
                <h3 style={{ fontFamily:"Georgia,serif", fontSize:"1.4rem", fontWeight:900, marginBottom:8 }}>Table Book Ho Gaya!</h3>
                <p style={{ color:"#888", lineHeight:1.6, fontSize:"0.88rem" }}>Hum aapka intezaar karenge!</p>
                <button onClick={()=>{setStatus(null);setForm({name:"",phone:"",email:"",date:"",time:"",guests:"2",message:""})}}
                  style={{ marginTop:14, background:settings.primaryColor, color:"#fff", border:"none", padding:"10px 22px", borderRadius:50, cursor:"pointer", fontWeight:600, fontSize:"0.88rem" }}>
                  Dobara Book Karo
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily:"Georgia,serif", fontSize:"1.2rem", fontWeight:900, marginBottom:16 }}>Reservation Form</h3>
                <div className="form-row-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                  <div>
                    <label style={{ fontSize:"0.74rem", fontWeight:600, color:"#777", display:"block", marginBottom:4 }}>Aapka Naam *</label>
                    <input placeholder="Naam" value={form.name} onChange={e=>set("name",e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize:"0.74rem", fontWeight:600, color:"#777", display:"block", marginBottom:4 }}>Mobile *</label>
                    <input placeholder="Phone" value={form.phone} onChange={e=>set("phone",e.target.value)} style={inp} type="tel" />
                  </div>
                </div>
                <div className="form-row-2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                  <div>
                    <label style={{ fontSize:"0.74rem", fontWeight:600, color:"#777", display:"block", marginBottom:4 }}>Tarikh *</label>
                    <input type="date" value={form.date} onChange={e=>set("date",e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize:"0.74rem", fontWeight:600, color:"#777", display:"block", marginBottom:4 }}>Samay *</label>
                    <input type="time" value={form.time} onChange={e=>set("time",e.target.value)} style={inp} />
                  </div>
                </div>
                <div style={{ marginBottom:10 }}>
                  <label style={{ fontSize:"0.74rem", fontWeight:600, color:"#777", display:"block", marginBottom:4 }}>Kitne Log?</label>
                  <select value={form.guests} onChange={e=>set("guests",e.target.value)} style={{ ...inp, background:"#fff" }}>
                    {["1","2","3","4","5","6","7","8"].map(n=><option key={n} value={n}>{n} Log</option>)}
                  </select>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:"0.74rem", fontWeight:600, color:"#777", display:"block", marginBottom:4 }}>Koi Khaas Baat?</label>
                  <textarea rows={2} value={form.message} onChange={e=>set("message",e.target.value)} placeholder="Birthday, allergy..." style={{ ...inp, resize:"vertical" }} />
                </div>
                {status==="error" && <p style={{ color:"#c0392b", fontSize:"0.78rem", marginBottom:8 }}>⚠️ Naam, phone, date aur time zaroori hai.</p>}
                <button onClick={submit} style={{ width:"100%", padding:13, background:settings.primaryColor, color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:"0.92rem", cursor:"pointer" }}>
                  {status==="loading" ? "⏳ Book Ho Raha Hai..." : "✅ Table Book Karo"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── LOCATION ────────────────────────────────────────────
function LocationSection({ settings }) {
  return (
    <section id="location" style={{ padding:"70px 16px", background:"#FFF8F4" }}>
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{ fontFamily:"cursive", fontSize:"1.05rem", color:settings.accentColor, marginBottom:6 }}>Hamare Yahan Aaiye</div>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.8rem,5vw,2.8rem)", fontWeight:900, letterSpacing:-1 }}>Hum Kahan Hain?</h2>
        <p style={{ color:"#888", marginTop:10, fontSize:"0.88rem", padding:"0 8px" }}>{settings.address}</p>
      </div>
      <div style={{ maxWidth:1000, margin:"0 auto", borderRadius:20, overflow:"hidden", boxShadow:"0 12px 50px rgba(0,0,0,0.1)", border:"4px solid #fff" }}>
        <iframe
          title="Humpty Dumpty Location"
          width="100%" height="350" style={{ border:0, display:"block" }}
          loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.874!2d86.4181!3d23.7589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f6a4c3a3b00001%3A0x1234567890abcdef!2sKoiry%20Bandh%2C%20Jharia%2C%20Dhanbad%2C%20Jharkhand!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
        />
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:12, marginTop:20, flexWrap:"wrap" }}>
        <a href="https://www.google.com/maps/dir/?api=1&destination=Koiry+Bandh+Jharia+Dhanbad+Jharkhand" target="_blank" rel="noreferrer"
          style={{ background:settings.primaryColor, color:"#fff", padding:"12px 24px", borderRadius:50, textDecoration:"none", fontWeight:600, fontSize:"0.88rem" }}>
          📍 Google Maps Par Dekho
        </a>
        <a href={`tel:${settings.phone}`} style={{ background:settings.darkColor, color:"#fff", padding:"12px 24px", borderRadius:50, textDecoration:"none", fontWeight:600, fontSize:"0.88rem" }}>
          📞 Call Karo
        </a>
      </div>
    </section>
  );
}

// ── CART MODAL ──────────────────────────────────────────
function CartModal({ cart, settings, onClose, onQtyChange }) {
  const [step, setStep] = useState("cart");
  const [form, setForm] = useState({ name:"", phone:"", address:"", upi:"" });
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const items = Object.values(cart).filter(i=>i.qty>0);
  const total = items.reduce((s,i)=>s+i.qty*i.price,0);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address) { alert("Naam, phone aur address fill karo"); return; }
    setLoading(true);
    const oid = "HD-" + Math.floor(100000 + Math.random() * 900000);
    try {
      await fetch(`${API}/orders`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ orderId:oid, customer:form, items:items.map(i=>({name:i.name,price:i.price,qty:i.qty})), totalAmount:total, paymentMethod:"UPI" })});
    } catch {}
    setOrderId(oid);
    setLoading(false);
    setStep("success");
  };

  const inp = { width:"100%", padding:"11px 13px", border:"1.5px solid #e0e0e0", borderRadius:10, fontFamily:"inherit", fontSize:"0.9rem", outline:"none", boxSizing:"border-box", marginBottom:10 };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(26,10,0,0.75)", backdropFilter:"blur(6px)", zIndex:800, display:"flex", alignItems:"flex-end", justifyContent:"center", padding:0 }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#fff", borderRadius:"24px 24px 0 0", width:"100%", maxWidth:520, maxHeight:"92vh", overflowY:"auto", padding:"24px 20px 32px", position:"relative", animation:"slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
        {/* Handle bar */}
        <div style={{ width:40, height:4, background:"#e0e0e0", borderRadius:2, margin:"0 auto 20px" }} />
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"#f5f5f5", border:"none", width:30, height:30, borderRadius:"50%", cursor:"pointer", fontSize:14 }}>✕</button>

        {step === "cart" && (
          <>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:"1.4rem", fontWeight:900, marginBottom:4 }}>Aapka Order 🛒</h2>
            <p style={{ color:"#888", fontSize:"0.82rem", marginBottom:16 }}>Items check karo</p>
            {items.length === 0 ? (
              <div style={{ textAlign:"center", padding:"30px 0", color:"#aaa" }}>
                <div style={{ fontSize:48, marginBottom:8 }}>🍽️</div>
                <p>Cart khaali hai! Pehle kuch add karo.</p>
              </div>
            ) : (
              <>
                {items.map(item => (
                  <div key={item._id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:"1px solid #f5f5f5" }}>
                    <span style={{ fontSize:"0.88rem", fontWeight:500, flex:1 }}>{item.emoji} {item.name}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                      <button onClick={()=>onQtyChange(item._id,-1)} style={{ width:28, height:28, borderRadius:"50%", border:"1.5px solid #ddd", background:"#fff", cursor:"pointer", fontSize:"1rem", display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                      <span style={{ fontWeight:700, minWidth:18, textAlign:"center", fontSize:"0.9rem" }}>{item.qty}</span>
                      <button onClick={()=>onQtyChange(item._id,1)} style={{ width:28, height:28, borderRadius:"50%", border:"1.5px solid #ddd", background:"#fff", cursor:"pointer", fontSize:"1rem", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                      <span style={{ fontWeight:700, minWidth:50, textAlign:"right", fontFamily:"Georgia,serif", fontSize:"0.9rem" }}>{fmt(item.qty*item.price)}</span>
                    </div>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"space-between", padding:"14px 0", fontFamily:"Georgia,serif", fontSize:"1.2rem", fontWeight:900, borderTop:"2px solid #1A0A00", margin:"8px 0 16px" }}>
                  <span>Total</span><span>{fmt(total)}</span>
                </div>
                <button onClick={()=>setStep("payment")} style={{ width:"100%", padding:14, background:settings.primaryColor, color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:"0.95rem", cursor:"pointer" }}>
                  Aage Badho →
                </button>
              </>
            )}
          </>
        )}

        {step === "payment" && (
          <>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:"1.4rem", fontWeight:900, marginBottom:16 }}>Delivery & Payment</h2>
            <div style={{ fontSize:"0.72rem", fontWeight:700, color:"#999", letterSpacing:0.8, marginBottom:8, textTransform:"uppercase" }}>📍 Delivery Details</div>
            <input placeholder="Aapka Naam *" value={form.name} onChange={e=>set("name",e.target.value)} style={inp} />
            <input placeholder="Mobile Number *" value={form.phone} onChange={e=>set("phone",e.target.value)} style={inp} type="tel" />
            <input placeholder="Delivery Address *" value={form.address} onChange={e=>set("address",e.target.value)} style={inp} />
            <div style={{ fontSize:"0.72rem", fontWeight:700, color:"#999", letterSpacing:0.8, margin:"4px 0 10px", textTransform:"uppercase" }}>💳 UPI Payment</div>
            <div style={{ background:"#FFF8F4", border:`1.5px solid ${settings.accentColor}44`, borderRadius:12, padding:"14px 16px", marginBottom:10, textAlign:"center" }}>
              <div style={{ fontSize:"1.1rem", fontWeight:700, color:settings.primaryColor, marginBottom:3 }}>UPI ID: {settings.upiId}</div>
              <div style={{ fontSize:"0.78rem", color:"#888" }}>PhonePe / GPay / Paytm se pay karo</div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:"1.3rem", fontWeight:900, marginTop:6 }}>Total: {fmt(total)}</div>
            </div>
            <input placeholder="UTR / Transaction ID (optional)" value={form.upi} onChange={e=>set("upi",e.target.value)} style={inp} />
            <button onClick={placeOrder} disabled={loading} style={{ width:"100%", padding:14, background:settings.darkColor, color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:"0.95rem", cursor:"pointer", opacity:loading?0.7:1 }}>
              {loading ? "⏳ Processing..." : "✅ Order Place Karo"}
            </button>
            <p style={{ textAlign:"center", fontSize:"0.72rem", color:"#aaa", marginTop:8 }}>🔒 Secure · GST: {settings.gstNo}</p>
          </>
        )}

        {step === "success" && (
          <div style={{ textAlign:"center", padding:"16px 0" }}>
            <div style={{ fontSize:64, marginBottom:10 }}>🎉</div>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:"1.8rem", fontWeight:900, marginBottom:8 }}>Order Ho Gaya!</h2>
            <div style={{ background:"#FFF8F4", borderRadius:12, padding:14, margin:"14px 0", fontFamily:"Georgia,serif", fontWeight:700, fontSize:"1rem", color:settings.primaryColor }}>
              Order #{orderId}
            </div>
            <p style={{ color:"#666", lineHeight:1.7, fontSize:"0.9rem" }}>Shukriya! Aapka khaana 30-40 minute mein pahunch jayega. 🛵</p>
            <button onClick={onClose} style={{ marginTop:20, background:settings.primaryColor, color:"#fff", border:"none", padding:"12px 28px", borderRadius:50, cursor:"pointer", fontWeight:700, fontSize:"0.92rem" }}>
              Menu Par Wapis Jao
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ── CART BAR ────────────────────────────────────────────
function CartBar({ count, total, settings, onClick }) {
  if (count === 0) return null;
  return (
    <div style={{ position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)", background:settings.darkColor, color:"#fff", padding:"12px 20px", borderRadius:60, display:"flex", alignItems:"center", gap:14, boxShadow:"0 8px 32px rgba(0,0,0,0.35)", zIndex:600, animation:"slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)", maxWidth:"calc(100vw - 32px)", width:"max-content" }}>
      <div style={{ background:settings.accentColor, color:settings.darkColor, width:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"0.8rem", flexShrink:0 }}>{count}</div>
      <div style={{ fontSize:"0.84rem", whiteSpace:"nowrap" }}>{count} item{count>1?"s":""}</div>
      <div style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:"0.95rem", whiteSpace:"nowrap" }}>{fmt(total)}</div>
      <button onClick={onClick} style={{ background:settings.primaryColor, color:"#fff", border:"none", padding:"8px 16px", borderRadius:50, fontWeight:700, cursor:"pointer", fontSize:"0.82rem", whiteSpace:"nowrap", flexShrink:0 }}>
        Checkout →
      </button>
    </div>
  );
}

// ── FOOTER ──────────────────────────────────────────────
function Footer({ settings }) {
  return (
    <footer style={{ background:settings.darkColor, color:"rgba(255,255,255,0.5)", padding:"32px 20px", borderTop:`1px solid ${settings.primaryColor}33` }}>
      <div className="footer-inner" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16, maxWidth:1100, margin:"0 auto" }}>
        <div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:"1.2rem", color:"#fff", fontWeight:900, marginBottom:4 }}>{settings.siteName}<span style={{ color:settings.accentColor }}>.</span></div>
          <div style={{ fontSize:"0.78rem", lineHeight:1.5, maxWidth:260 }}>{settings.address}</div>
        </div>
        <div style={{ display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center" }}>
          {[["Menu","#menu"],["Reservation","#reservation"],["Location","#location"]].map(([l,h])=>(
            <a key={l} href={h} style={{ color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:"0.84rem" }}>{l}</a>
          ))}
        </div>
        <div style={{ fontSize:"0.75rem" }}>© 2024 {settings.siteName} · GST: {settings.gstNo}</div>
      </div>
    </footer>
  );
}

// ── ROOT APP ────────────────────────────────────────────
export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [editorOpen, setEditorOpen] = useState(false);
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetch(`${API}/settings`).then(r=>r.json()).then(d=>{
      if (d.success && Object.keys(d.data).length>0) setSettings(s=>({...s,...d.data}));
    }).catch(()=>{});
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev[item._id] || { ...item, qty:0 };
      return { ...prev, [item._id]: { ...existing, qty:existing.qty+1 } };
    });
  };

  const changeQty = (id, delta) => {
    setCart(prev => {
      const item = prev[id];
      if (!item) return prev;
      const newQty = Math.max(0, item.qty+delta);
      if (newQty===0) { const n={...prev}; delete n[id]; return n; }
      return { ...prev, [id]: { ...item, qty:newQty } };
    });
  };

  const saveSettings = async (s) => {
    try {
      await fetch(`${API}/settings/bulk/update`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify(s) });
    } catch {}
    setSettings(s);
    setEditorOpen(false);
  };

  const cartItems = Object.values(cart).filter(i=>i.qty>0);
  const cartCount = cartItems.reduce((s,i)=>s+i.qty,0);
  const cartTotal = cartItems.reduce((s,i)=>s+i.qty*i.price,0);

  return (
    <EditorContext.Provider value={{ editorOpen, setEditorOpen }}>
      <GlobalStyles />
      <div style={{ fontFamily:"system-ui,sans-serif" }}>
        <Navbar settings={settings} cartCount={cartCount} onOrderClick={()=>setCartOpen(true)} />
        <Hero settings={settings} />
        <Marquee settings={settings} />
        <MenuSection settings={settings} onAddToCart={addToCart} />
        <ReservationSection settings={settings} />
        <LocationSection settings={settings} />
        <Footer settings={settings} />
        <CartBar count={cartCount} total={cartTotal} settings={settings} onClick={()=>setCartOpen(true)} />
        {cartOpen && <CartModal cart={cart} settings={settings} onClose={()=>setCartOpen(false)} onQtyChange={changeQty} />}
        {editorOpen && <EditorPanel settings={settings} onUpdate={setSettings} onSave={saveSettings} onClose={()=>setEditorOpen(false)} />}
      </div>
    </EditorContext.Provider>
  );
}
