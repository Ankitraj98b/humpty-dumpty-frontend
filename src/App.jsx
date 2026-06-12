// frontend/src/App.jsx
import { useState, useEffect, createContext, useContext } from "react";

// ─── EDITOR CONTEXT ─────────────────────────────────────────────────────────
const EditorContext = createContext(null);
export const useEditor = () => useContext(EditorContext);

const API = "https://humpty-dumpty-api.onrender.com/api";

const DEFAULT_SETTINGS = {
  siteName: "Humpty Dumpty",
  tagline: "Jharia Ka Sabse Pyara Dhaba",
  heroTitle: "Ghar Jaisi\nRasoi, Yahan\nMilti Hai.",
  heroSubtitle: "Jharia, Dhanbad ke dil mein basa humara restaurant — fresh masaledaar khaana, warm service, aur yaadgaar swad jo aapko baar baar bulaye.",
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

// ─── UTILITY ────────────────────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n).toFixed(0)}`;

const MENU_ITEMS = [
  { _id:"1", name:"Masala Dosa", description:"Crispy rice crepe with spiced potato, sambar & chutneys", price:89, category:"breakfast", emoji:"🫓", badge:"Chef's Pick", isVeg:true },
  { _id:"2", name:"Poha Deluxe", description:"Flattened rice with mustard, curry leaves, peanuts & coriander", price:65, category:"breakfast", emoji:"🍚", isVeg:true },
  { _id:"3", name:"Chole Bhature", description:"Fluffy bhatura with spicy chole & pickled onions", price:120, category:"mains", emoji:"🫓", badge:"Bestseller", isVeg:true },
  { _id:"4", name:"Butter Chicken", description:"Tandoor chicken in rich creamy tomato-butter gravy", price:220, category:"mains", emoji:"🍛", badge:"Fan Fav" },
  { _id:"5", name:"Dal Makhani", description:"Slow-cooked kali dal in buttery gravy, best with naan", price:160, category:"mains", emoji:"🫕", isVeg:true },
  { _id:"6", name:"Jharia Special Biryani", description:"Fragrant basmati with slow-cooked mutton, fried onions & saffron", price:280, category:"biryani", emoji:"🍲", badge:"Must Try" },
  { _id:"7", name:"Veg Dum Biryani", description:"Mixed vegetables & paneer in aromatic dum biryani", price:180, category:"biryani", emoji:"🍲", isVeg:true },
  { _id:"8", name:"Gulab Jamun", description:"Soft milk dumplings in rose-cardamom sugar syrup", price:70, category:"desserts", emoji:"🍮", isVeg:true },
  { _id:"9", name:"Rasmalai", description:"Soft rasgullas in chilled saffron-cardamom rabdi", price:90, category:"desserts", emoji:"🥛", badge:"Fan Fav", isVeg:true },
  { _id:"10", name:"Mango Lassi", description:"Chilled lassi with Alphonso mango & cardamom", price:80, category:"drinks", emoji:"🥭", isVeg:true },
  { _id:"11", name:"Masala Chai", description:"Strong chai with ginger, cardamom & whole spices", price:35, category:"drinks", emoji:"☕", isVeg:true },
  { _id:"12", name:"Fresh Lime Soda", description:"Sweet ya salt, nimbu & kala namak ke saath", price:50, category:"drinks", emoji:"🍋", isVeg:true },
];

// ─── STYLES ─────────────────────────────────────────────────────────────────
const injectStyles = (settings) => {
  const s = { ...DEFAULT_SETTINGS, ...settings };
  document.documentElement.style.setProperty("--primary", s.primaryColor);
  document.documentElement.style.setProperty("--accent", s.accentColor);
  document.documentElement.style.setProperty("--dark", s.darkColor);
};

// ─── LIVE EDITOR PANEL ──────────────────────────────────────────────────────
function EditorPanel({ settings, onUpdate, onSave, onClose }) {
  const [local, setLocal] = useState(settings);
  const update = (key, val) => {
    const next = { ...local, [key]: val };
    setLocal(next);
    onUpdate(next);
  };
  const Field = ({ label, k, type = "text", rows }) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 4, textTransform: "uppercase" }}>{label}</label>
      {rows ? (
        <textarea rows={rows} value={local[k] || ""} onChange={e => update(k, e.target.value)}
          style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #e0e0e0", fontFamily: "inherit", fontSize: 13, resize: "vertical" }} />
      ) : (
        <input type={type} value={local[k] || ""} onChange={e => update(k, e.target.value)}
          style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #e0e0e0", fontFamily: "inherit", fontSize: 13 }} />
      )}
    </div>
  );
  return (
    <div style={{ position:"fixed", right:0, top:0, bottom:0, width:320, background:"#fff", boxShadow:"-4px 0 30px rgba(0,0,0,0.15)", zIndex:9999, overflowY:"auto", fontFamily:"system-ui,sans-serif" }}>
      <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid #f0f0f0", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#1A0A00", color:"#fff" }}>
        <div>
          <div style={{ fontSize:15, fontWeight:700 }}>✏️ Live Editor</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)", marginTop:2 }}>Edit & save instantly</div>
        </div>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:16 }}>✕</button>
      </div>
      <div style={{ padding:"20px" }}>
        <Section label="🏠 Branding">
          <Field label="Restaurant Name" k="siteName" />
          <Field label="Tagline (Hindi/English)" k="tagline" />
          <Field label="Hero Title" k="heroTitle" rows={3} />
          <Field label="Hero Subtitle" k="heroSubtitle" rows={3} />
        </Section>
        <Section label="🎨 Colors">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
            {[["Primary","primaryColor"],["Accent","accentColor"],["Dark","darkColor"]].map(([lbl,k]) => (
              <div key={k}>
                <div style={{ fontSize:10, color:"#888", marginBottom:4 }}>{lbl}</div>
                <input type="color" value={local[k]||"#000"} onChange={e => update(k, e.target.value)} style={{ width:"100%", height:40, borderRadius:8, border:"1.5px solid #e0e0e0", cursor:"pointer" }} />
              </div>
            ))}
          </div>
        </Section>
        <Section label="📞 Contact Info">
          <Field label="Phone" k="phone" />
          <Field label="Address" k="address" rows={2} />
          <Field label="Email" k="email" />
          <Field label="Opening Hours" k="openHours" />
        </Section>
        <Section label="💳 Payment">
          <Field label="UPI ID" k="upiId" />
          <Field label="GST Number" k="gstNo" />
        </Section>
        <button onClick={() => onSave(local)} style={{ width:"100%", padding:"14px", background:"#E8521A", color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:14, cursor:"pointer", marginTop:8 }}>
          💾 Save All Changes
        </button>
        <div style={{ fontSize:11, color:"#aaa", textAlign:"center", marginTop:8 }}>Changes save to MongoDB</div>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom:20 }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", textAlign:"left", background:"#f8f8f8", border:"none", borderRadius:8, padding:"8px 12px", fontWeight:600, fontSize:12, cursor:"pointer", color:"#333", marginBottom: open?12:0 }}>
        {open ? "▼" : "▶"} {label}
      </button>
      {open && children}
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({ settings, cartCount, onOrderClick }) {
  const { editorOpen, setEditorOpen } = useEditor();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{ position:"fixed", top:0, width:"100%", zIndex:500, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 48px", background: scrolled ? "rgba(26,10,0,0.96)" : "rgba(26,10,0,0.85)", backdropFilter:"blur(12px)", transition:"all 0.3s", boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.3)" : "none" }}>
      <div style={{ fontFamily:"'Georgia',serif", fontSize:"1.4rem", fontWeight:700, color:"#fff", letterSpacing:-0.5 }}>
        {settings.siteName}<span style={{ color: settings.accentColor }}>.</span>
      </div>
      <div style={{ display:"flex", gap:28, listStyle:"none" }}>
        {[["Menu","#menu"],["Biryani","#menu"],["Reservation","#reservation"],["Location","#location"]].map(([l,h]) => (
          <a key={l} href={h} style={{ color:"rgba(255,255,255,0.75)", textDecoration:"none", fontSize:"0.88rem", fontWeight:500, transition:"color 0.2s" }}
            onMouseOver={e => e.target.style.color="#fff"} onMouseOut={e => e.target.style.color="rgba(255,255,255,0.75)"}>{l}</a>
        ))}
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={() => setEditorOpen(true)} style={{ background:"rgba(255,255,255,0.1)", color:"#fff", border:"1px solid rgba(255,255,255,0.2)", padding:"8px 16px", borderRadius:50, fontSize:"0.82rem", cursor:"pointer" }}>
          ✏️ Edit Site
        </button>
        <button onClick={onOrderClick} style={{ background: settings.primaryColor, color:"#fff", border:"none", padding:"10px 22px", borderRadius:50, fontWeight:600, fontSize:"0.88rem", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
          🛒 {cartCount > 0 ? `Cart (${cartCount})` : "Order Karo"}
        </button>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ settings }) {
  const lines = settings.heroTitle.split("\n");
  return (
    <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", background:`linear-gradient(135deg, ${settings.darkColor} 0%, #3D1A0A 60%, #1A0A00 100%)`, padding:"120px 48px 80px", position:"relative", overflow:"hidden" }}>
      {/* Decorative circles */}
      <div style={{ position:"absolute", right:-100, top:"50%", transform:"translateY(-50%)", width:600, height:600, borderRadius:"50%", background:`radial-gradient(circle, ${settings.accentColor}22 0%, transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", left:-200, bottom:-200, width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle, ${settings.primaryColor}15 0%, transparent 70%)`, pointerEvents:"none" }} />

      <div style={{ maxWidth:640, position:"relative", zIndex:2 }}>
        <div style={{ fontFamily:"'Georgia',cursive", fontSize:"1.1rem", color: settings.accentColor, marginBottom:16, animation:"fadeUp 0.7s 0.2s both" }}>
          ✦ Jharia, Dhanbad · {settings.tagline}
        </div>
        <h1 style={{ fontFamily:"'Georgia',serif", fontSize:"clamp(3rem,6vw,5rem)", fontWeight:900, lineHeight:1.05, letterSpacing:-2, color:"#fff", margin:0, animation:"fadeUp 0.7s 0.4s both" }}>
          {lines.map((l,i) => <span key={i} style={{ display:"block", color: i===1 ? settings.accentColor : "#fff", fontStyle: i===1 ? "italic" : "normal" }}>{l}</span>)}
        </h1>
        <p style={{ marginTop:20, fontSize:"1.05rem", color:"rgba(255,255,255,0.65)", lineHeight:1.75, maxWidth:500, animation:"fadeUp 0.7s 0.6s both" }}>
          {settings.heroSubtitle}
        </p>
        <div style={{ display:"flex", gap:14, marginTop:36, animation:"fadeUp 0.7s 0.8s both" }}>
          <a href="#menu" style={{ background: settings.primaryColor, color:"#fff", padding:"14px 32px", borderRadius:50, fontWeight:600, fontSize:"0.95rem", textDecoration:"none", transition:"transform 0.2s" }}
            onMouseOver={e=>e.target.style.transform="translateY(-3px)"} onMouseOut={e=>e.target.style.transform=""}>
            Menu Dekho 🍽️
          </a>
          <a href="#reservation" style={{ background:"transparent", color:"#fff", padding:"14px 32px", borderRadius:50, fontWeight:600, fontSize:"0.95rem", textDecoration:"none", border:"2px solid rgba(255,255,255,0.3)", transition:"all 0.2s" }}
            onMouseOver={e=>{e.target.style.background="rgba(255,255,255,0.1)"}} onMouseOut={e=>{e.target.style.background="transparent"}}>
            Table Book Karo
          </a>
        </div>
        <div style={{ display:"flex", gap:36, marginTop:52, animation:"fadeUp 0.7s 1s both" }}>
          {[["4.9★","Rating"],["15K+","Khush Grahak"],["12 Saal","Seva"],["Roz Taaza","Ingredients"]].map(([n,l]) => (
            <div key={l}>
              <div style={{ fontFamily:"'Georgia',serif", fontSize:"1.6rem", fontWeight:900, color:"#fff" }}>{n}</div>
              <div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.5)", letterSpacing:0.5 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position:"absolute", right:80, top:"50%", transform:"translateY(-50%)", fontSize:160, animation:"wobble 4s ease-in-out infinite", filter:`drop-shadow(0 20px 40px ${settings.accentColor}44)` }}>🍛</div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes wobble { 0%,100%{transform:translateY(-50%) rotate(-4deg)} 50%{transform:translateY(-54%) rotate(4deg)} }
      `}</style>
    </section>
  );
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────
function Marquee({ settings }) {
  const items = ["🍛 Butter Chicken","🫓 Masala Dosa","🍲 Dum Biryani","🥭 Mango Lassi","🍮 Gulab Jamun","☕ Masala Chai","🫕 Dal Makhani","🍋 Nimbu Soda"];
  const text = [...items,...items].map((t,i) => <span key={i} style={{ margin:"0 28px" }}>{t}</span>);
  return (
    <div style={{ background: settings.primaryColor, padding:"13px 0", overflow:"hidden", whiteSpace:"nowrap" }}>
      <div style={{ display:"inline-block", animation:"marquee 22s linear infinite", fontFamily:"'Georgia',serif", fontSize:"0.95rem", color:"#fff", letterSpacing:0.5 }}>
        {text}
      </div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

// ─── MENU ─────────────────────────────────────────────────────────────────────
function MenuSection({ settings, onAddToCart }) {
  const [activeTab, setActiveTab] = useState("all");
  const tabs = [["all","Sab Kuch"],["breakfast","Nashta"],["mains","Main Course"],["biryani","Biryani"],["desserts","Meetha"],["drinks","Drinks"]];
  const items = activeTab === "all" ? MENU_ITEMS : MENU_ITEMS.filter(i => i.category === activeTab);

  return (
    <section id="menu" style={{ padding:"90px 48px", background:"#FFF8F4" }}>
      <div style={{ textAlign:"center", marginBottom:50 }}>
        <div style={{ fontFamily:"cursive", fontSize:"1.1rem", color: settings.accentColor, marginBottom:8 }}>Humara Menu</div>
        <h2 style={{ fontFamily:"'Georgia',serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:900, letterSpacing:-1, margin:0 }}>Aaj Kya Khana Hai?</h2>
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:10, marginBottom:44, flexWrap:"wrap" }}>
        {tabs.map(([val,lbl]) => (
          <button key={val} onClick={() => setActiveTab(val)} style={{ padding:"9px 22px", borderRadius:50, border:`2px solid ${activeTab===val ? settings.darkColor : "transparent"}`, background: activeTab===val ? settings.darkColor : "rgba(0,0,0,0.06)", color: activeTab===val ? "#fff" : "#555", fontWeight:500, fontSize:"0.88rem", cursor:"pointer", transition:"all 0.2s" }}>
            {lbl}
          </button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:24, maxWidth:1200, margin:"0 auto" }}>
        {items.map(item => <MenuCard key={item._id} item={item} settings={settings} onAdd={onAddToCart} />)}
      </div>
    </section>
  );
}

function MenuCard({ item, settings, onAdd }) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    onAdd(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };
  return (
    <div style={{ background:"#fff", borderRadius:20, overflow:"hidden", border:"1px solid rgba(0,0,0,0.07)", transition:"transform 0.3s,box-shadow 0.3s", cursor:"pointer" }}
      onMouseOver={e=>{e.currentTarget.style.transform="translateY(-7px)";e.currentTarget.style.boxShadow="0 20px 50px rgba(0,0,0,0.1)"}}
      onMouseOut={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
      <div style={{ height:160, display:"flex", alignItems:"center", justifyContent:"center", background:`linear-gradient(135deg, ${settings.accentColor}20, ${settings.primaryColor}15)`, fontSize:70, position:"relative" }}>
        {item.emoji}
        <div style={{ position:"absolute", top:0, right:0, display:"flex", gap:6, padding:10 }}>
          {item.isVeg && <span style={{ background:"#2E7D32", color:"#fff", fontSize:"0.65rem", fontWeight:700, padding:"3px 8px", borderRadius:50 }}>VEG</span>}
          {item.badge && <span style={{ background: settings.primaryColor, color:"#fff", fontSize:"0.65rem", fontWeight:700, padding:"3px 8px", borderRadius:50 }}>{item.badge}</span>}
        </div>
      </div>
      <div style={{ padding:"18px 18px 20px" }}>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:"1.1rem", fontWeight:700, marginBottom:5 }}>{item.name}</div>
        <div style={{ fontSize:"0.82rem", color:"#888", lineHeight:1.5, marginBottom:14 }}>{item.description}</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"'Georgia',serif", fontSize:"1.25rem", fontWeight:900, color: settings.darkColor }}>{fmt(item.price)}</span>
          <button onClick={handleAdd} style={{ width:38, height:38, borderRadius:"50%", background: added ? "#2E7D32" : settings.accentColor, border:"none", color: added ? "#fff" : settings.darkColor, fontSize:"1.1rem", fontWeight:700, cursor:"pointer", transition:"all 0.2s", transform: added ? "scale(1.15)" : "scale(1)" }}>
            {added ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── RESERVATION ──────────────────────────────────────────────────────────────
function ReservationSection({ settings }) {
  const [form, setForm] = useState({ name:"", phone:"", email:"", date:"", time:"", guests:"2", message:"" });
  const [status, setStatus] = useState(null);
  const set = (k,v) => setForm(p => ({...p,[k]:v}));

  const submit = async () => {
    if (!form.name || !form.phone || !form.date || !form.time) { setStatus("error"); return; }
    setStatus("loading");
    try {
      const res = await fetch(`${API}/reservations`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      const data = await res.json();
      if (data.success) setStatus("success");
      else setStatus("error");
    } catch {
      // Demo mode — show success anyway
      setStatus("success");
    }
  };

  const Input = ({ label, k, type="text", opts }) => (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block", fontSize:"0.78rem", fontWeight:600, color:"#666", marginBottom:5, letterSpacing:0.3 }}>{label}</label>
      {opts ? (
        <select value={form[k]} onChange={e=>set(k,e.target.value)} style={inputStyle}>{opts.map(o=><option key={o} value={o}>{o} Log</option>)}</select>
      ) : (
        <input type={type} value={form[k]} onChange={e=>set(k,e.target.value)} style={inputStyle} />
      )}
    </div>
  );
  const inputStyle = { width:"100%", padding:"11px 14px", border:"1.5px solid #e0e0e0", borderRadius:10, fontFamily:"inherit", fontSize:"0.93rem", outline:"none", boxSizing:"border-box" };

  return (
    <section id="reservation" style={{ padding:"90px 48px", background: settings.darkColor }}>
      <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center" }}>
        <div>
          <div style={{ fontFamily:"cursive", fontSize:"1.1rem", color: settings.accentColor, marginBottom:10 }}>Table Book Karo</div>
          <h2 style={{ fontFamily:"'Georgia',serif", fontSize:"2.5rem", fontWeight:900, color:"#fff", lineHeight:1.15, letterSpacing:-1, margin:"0 0 16px" }}>Aapka Swagat<br/><em style={{ color: settings.accentColor, fontStyle:"italic" }}>Hamare Yahan</em></h2>
          <p style={{ color:"rgba(255,255,255,0.6)", lineHeight:1.75, marginBottom:28 }}>Apna table pehle se book karo aur bina wait ke aaiye. Special occasions ke liye bhi hum ready hain.</p>
          {[["📞 Phone", settings.phone],["📍 Pata", settings.address],["⏰ Timing", settings.openHours]].map(([icon,val]) => (
            <div key={icon} style={{ display:"flex", gap:12, marginBottom:14, alignItems:"flex-start" }}>
              <span style={{ color: settings.accentColor, fontSize:"1rem" }}>{icon.split(" ")[0]}</span>
              <div><div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.4)", marginBottom:2 }}>{icon.split(" ").slice(1).join(" ")}</div>
              <div style={{ color:"#fff", fontSize:"0.9rem" }}>{val}</div></div>
            </div>
          ))}
        </div>
        <div style={{ background:"#fff", borderRadius:24, padding:32 }}>
          {status === "success" ? (
            <div style={{ textAlign:"center", padding:20 }}>
              <div style={{ fontSize:60, marginBottom:12 }}>🎉</div>
              <h3 style={{ fontFamily:"'Georgia',serif", fontSize:"1.5rem", fontWeight:900, marginBottom:8 }}>Table Book Ho Gaya!</h3>
              <p style={{ color:"#888", lineHeight:1.6 }}>Hum aapka intezaar karenge. Confirmation SMS aapke phone par aa jayega.</p>
              <button onClick={() => {setStatus(null);setForm({name:"",phone:"",email:"",date:"",time:"",guests:"2",message:""})}} style={{ marginTop:16, background: settings.primaryColor, color:"#fff", border:"none", padding:"10px 24px", borderRadius:50, cursor:"pointer", fontWeight:600 }}>Dobara Book Karo</button>
            </div>
          ) : (
            <>
              <h3 style={{ fontFamily:"'Georgia',serif", fontSize:"1.3rem", fontWeight:900, marginBottom:20 }}>Reservation Form</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Input label="Aapka Naam *" k="name" />
                <Input label="Mobile Number *" k="phone" type="tel" />
              </div>
              <Input label="Email (Optional)" k="email" type="email" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Input label="Tarikh *" k="date" type="date" />
                <Input label="Samay *" k="time" type="time" />
              </div>
              <Input label="Kitne Log?" k="guests" opts={["1","2","3","4","5","6","7","8"]} />
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:"0.78rem", fontWeight:600, color:"#666", marginBottom:5 }}>Koi Khaas Baat?</label>
                <textarea rows={2} value={form.message} onChange={e=>set("message",e.target.value)} placeholder="Birthday, anniversary, ya koi allergy..." style={{ ...inputStyle, resize:"vertical" }} />
              </div>
              {status === "error" && <p style={{ color:"#c0392b", fontSize:"0.82rem", marginBottom:10 }}>Please fill all required fields.</p>}
              <button onClick={submit} style={{ width:"100%", padding:14, background: settings.primaryColor, color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:"0.95rem", cursor:"pointer" }}>
                {status==="loading" ? "⏳ Book Ho Raha Hai..." : "✅ Table Book Karo"}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── GOOGLE MAP ───────────────────────────────────────────────────────────────
function LocationSection({ settings }) {
  return (
    <section id="location" style={{ padding:"90px 48px", background:"#FFF8F4" }}>
      <div style={{ textAlign:"center", marginBottom:44 }}>
        <div style={{ fontFamily:"cursive", fontSize:"1.1rem", color: settings.accentColor, marginBottom:8 }}>Hamare Yahan Aaiye</div>
        <h2 style={{ fontFamily:"'Georgia',serif", fontSize:"clamp(2rem,4vw,2.8rem)", fontWeight:900, letterSpacing:-1, margin:0 }}>Hum Kahan Hain?</h2>
        <p style={{ color:"#888", marginTop:12, fontSize:"0.95rem" }}>{settings.address}</p>
      </div>
      <div style={{ maxWidth:1100, margin:"0 auto", borderRadius:24, overflow:"hidden", boxShadow:"0 12px 50px rgba(0,0,0,0.12)", border:"4px solid #fff" }}>
        {/* Google Maps embed for Jharia, Dhanbad, Jharkhand */}
        <iframe
          title="Humpty Dumpty Location"
          width="100%"
          height="420"
          style={{ border:0, display:"block" }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.874!2d86.4181!3d23.7589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f6a4c3a3b00001%3A0x1234567890abcdef!2sKoiry%20Bandh%2C%20Jharia%2C%20Dhanbad%2C%20Jharkhand!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
        />
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:24, flexWrap:"wrap" }}>
        <a href={`https://www.google.com/maps/dir/?api=1&destination=Koiry+Bandh+Jharia+Dhanbad+Jharkhand`} target="_blank" rel="noreferrer"
          style={{ background: settings.primaryColor, color:"#fff", padding:"12px 28px", borderRadius:50, textDecoration:"none", fontWeight:600, fontSize:"0.9rem" }}>
          📍 Google Maps Par Dekho
        </a>
        <a href={`tel:${settings.phone}`} style={{ background: settings.darkColor, color:"#fff", padding:"12px 28px", borderRadius:50, textDecoration:"none", fontWeight:600, fontSize:"0.9rem" }}>
          📞 Call Karo
        </a>
      </div>
    </section>
  );
}

// ─── CART / CHECKOUT MODAL ────────────────────────────────────────────────────
function CartModal({ cart, settings, onClose, onQtyChange }) {
  const [step, setStep] = useState("cart"); // cart → payment → success
  const [form, setForm] = useState({ name:"", phone:"", address:"", upi:"" });
  const [orderId, setOrderId] = useState("");
  const items = Object.values(cart).filter(i => i.qty > 0);
  const total = items.reduce((s,i) => s + i.qty * i.price, 0);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address) { alert("Naam, phone aur address fill karo"); return; }
    const oid = "HD-" + Math.floor(100000 + Math.random() * 900000);
    try {
      await fetch(`${API}/orders`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({
        orderId: oid, customer: form,
        items: items.map(i=>({name:i.name, price:i.price, qty:i.qty})),
        totalAmount: total, paymentMethod:"UPI"
      })});
    } catch {}
    setOrderId(oid);
    setStep("success");
  };

  const inputStyle = { width:"100%", padding:"10px 14px", border:"1.5px solid #e0e0e0", borderRadius:10, fontFamily:"inherit", fontSize:"0.9rem", outline:"none", boxSizing:"border-box", marginBottom:12 };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(26,10,0,0.7)", backdropFilter:"blur(6px)", zIndex:800, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#fff", borderRadius:24, width:"100%", maxWidth:480, maxHeight:"90vh", overflowY:"auto", padding:32, position:"relative", animation:"modalIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"#f0f0f0", border:"none", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:16 }}>✕</button>

        {step === "cart" && (
          <>
            <h2 style={{ fontFamily:"'Georgia',serif", fontSize:"1.6rem", fontWeight:900, marginBottom:4 }}>Aapka Order</h2>
            <p style={{ color:"#888", fontSize:"0.85rem", marginBottom:20 }}>Items review karo</p>
            {items.length === 0 ? (
              <p style={{ textAlign:"center", color:"#aaa", padding:"30px 0" }}>Cart khaali hai! Pehle kuch add karo 🍽️</p>
            ) : (
              <>
                {items.map(item => (
                  <div key={item._id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid #f0f0f0" }}>
                    <span style={{ fontSize:"0.9rem", fontWeight:500 }}>{item.emoji} {item.name}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <button onClick={() => onQtyChange(item._id, -1)} style={{ width:26, height:26, borderRadius:"50%", border:"1.5px solid #ddd", background:"#fff", cursor:"pointer" }}>−</button>
                      <span style={{ fontWeight:700, minWidth:20, textAlign:"center" }}>{item.qty}</span>
                      <button onClick={() => onQtyChange(item._id, 1)} style={{ width:26, height:26, borderRadius:"50%", border:"1.5px solid #ddd", background:"#fff", cursor:"pointer" }}>+</button>
                      <span style={{ fontWeight:700, minWidth:56, textAlign:"right", fontFamily:"'Georgia',serif" }}>{fmt(item.qty * item.price)}</span>
                    </div>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"space-between", padding:"16px 0", fontFamily:"'Georgia',serif", fontSize:"1.3rem", fontWeight:900, borderTop:"2px solid #1A0A00", marginTop:8 }}>
                  <span>Total</span><span>{fmt(total)}</span>
                </div>
                <button onClick={() => setStep("payment")} style={{ width:"100%", padding:14, background: settings.primaryColor, color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:"0.95rem", cursor:"pointer" }}>
                  Aage Badho →
                </button>
              </>
            )}
          </>
        )}

        {step === "payment" && (
          <>
            <h2 style={{ fontFamily:"'Georgia',serif", fontSize:"1.5rem", fontWeight:900, marginBottom:20 }}>Delivery & Payment</h2>
            <div style={{ fontSize:"0.78rem", fontWeight:700, color:"#888", letterSpacing:0.5, marginBottom:10 }}>📍 DELIVERY DETAILS</div>
            <input placeholder="Aapka Naam *" value={form.name} onChange={e=>set("name",e.target.value)} style={inputStyle} />
            <input placeholder="Mobile Number *" value={form.phone} onChange={e=>set("phone",e.target.value)} style={inputStyle} type="tel" />
            <input placeholder="Delivery Address *" value={form.address} onChange={e=>set("address",e.target.value)} style={inputStyle} />
            <div style={{ fontSize:"0.78rem", fontWeight:700, color:"#888", letterSpacing:0.5, margin:"8px 0 10px" }}>💳 UPI PAYMENT</div>
            <div style={{ background:"#FFF8F4", border:`1.5px solid ${settings.accentColor}44`, borderRadius:12, padding:16, marginBottom:12, textAlign:"center" }}>
              <div style={{ fontSize:"1.2rem", fontWeight:700, color: settings.primaryColor, marginBottom:4 }}>UPI ID: {settings.upiId}</div>
              <div style={{ fontSize:"0.8rem", color:"#888" }}>PhonePe / GPay / Paytm se pay karo</div>
              <div style={{ fontFamily:"'Georgia',serif", fontSize:"1.4rem", fontWeight:900, marginTop:8 }}>Total: {fmt(total)}</div>
            </div>
            <input placeholder="UTR/Transaction ID (optional)" value={form.upi} onChange={e=>set("upi",e.target.value)} style={inputStyle} />
            <button onClick={placeOrder} style={{ width:"100%", padding:14, background: settings.darkColor, color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:"0.95rem", cursor:"pointer" }}>
              ✅ Order Place Karo
            </button>
            <p style={{ textAlign:"center", fontSize:"0.75rem", color:"#aaa", marginTop:8 }}>🔒 Secure · GST: {settings.gstNo}</p>
          </>
        )}

        {step === "success" && (
          <div style={{ textAlign:"center", padding:16 }}>
            <div style={{ fontSize:70, marginBottom:12 }}>🎉</div>
            <h2 style={{ fontFamily:"'Georgia',serif", fontSize:"2rem", fontWeight:900, marginBottom:8 }}>Order Ho Gaya!</h2>
            <div style={{ background:"#FFF8F4", borderRadius:12, padding:14, margin:"16px 0", fontFamily:"'Georgia',serif", fontWeight:700, fontSize:"1.1rem", color: settings.primaryColor }}>
              Order #{orderId}
            </div>
            <p style={{ color:"#666", lineHeight:1.7 }}>Shukriya! Aapka khaana 30-40 minute mein pahunch jayega. 🛵</p>
            <button onClick={onClose} style={{ marginTop:20, background: settings.primaryColor, color:"#fff", border:"none", padding:"12px 28px", borderRadius:50, cursor:"pointer", fontWeight:700 }}>Menu Par Wapis Jao</button>
          </div>
        )}
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ settings }) {
  return (
    <footer style={{ background: settings.darkColor, color:"rgba(255,255,255,0.5)", padding:"40px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:20, borderTop:`1px solid ${settings.primaryColor}33` }}>
      <div>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:"1.3rem", color:"#fff", fontWeight:900, marginBottom:4 }}>{settings.siteName}<span style={{ color: settings.accentColor }}>.</span></div>
        <div style={{ fontSize:"0.8rem" }}>{settings.address}</div>
      </div>
      <div style={{ display:"flex", gap:24 }}>
        {["Menu","Reservation","Location","Contact"].map(l => (
          <a key={l} href="#" style={{ color:"rgba(255,255,255,0.5)", textDecoration:"none", fontSize:"0.85rem", transition:"color 0.2s" }}
            onMouseOver={e=>e.target.style.color=settings.accentColor} onMouseOut={e=>e.target.style.color="rgba(255,255,255,0.5)"}>{l}</a>
        ))}
      </div>
      <div style={{ fontSize:"0.78rem" }}>© 2024 {settings.siteName}. GST: {settings.gstNo}</div>
    </footer>
  );
}

// ─── CART BAR ─────────────────────────────────────────────────────────────────
function CartBar({ count, total, settings, onClick }) {
  if (count === 0) return null;
  return (
    <div style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", background: settings.darkColor, color:"#fff", padding:"14px 28px", borderRadius:60, display:"flex", alignItems:"center", gap:18, boxShadow:"0 10px 40px rgba(0,0,0,0.35)", zIndex:600, minWidth:280, animation:"slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
      <div style={{ background: settings.accentColor, color: settings.darkColor, width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"0.85rem" }}>{count}</div>
      <div style={{ flex:1, fontSize:"0.9rem" }}>items cart mein</div>
      <div style={{ fontFamily:"'Georgia',serif", fontWeight:900, fontSize:"1rem" }}>{fmt(total)}</div>
      <button onClick={onClick} style={{ background: settings.primaryColor, color:"#fff", border:"none", padding:"8px 18px", borderRadius:50, fontWeight:700, cursor:"pointer", fontSize:"0.85rem" }}>Checkout →</button>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translate(-50%,20px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [editorOpen, setEditorOpen] = useState(false);
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  // Load settings from API on mount
  useEffect(() => {
    fetch(`${API}/settings`).then(r=>r.json()).then(d => {
      if (d.success && Object.keys(d.data).length > 0) setSettings(s => ({...s, ...d.data}));
    }).catch(() => {});
  }, []);

  useEffect(() => { injectStyles(settings); }, [settings]);

  const saveSettings = async (s) => {
    try {
      await fetch(`${API}/settings/bulk/update`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify(s) });
      alert("✅ Saved to MongoDB!");
    } catch {
      alert("✅ Saved locally! (Start backend to save to MongoDB)");
    }
    setSettings(s);
    setEditorOpen(false);
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev[item._id] || { ...item, qty: 0 };
      return { ...prev, [item._id]: { ...existing, qty: existing.qty + 1 } };
    });
  };

  const changeQty = (id, delta) => {
    setCart(prev => {
      const item = prev[id];
      if (!item) return prev;
      const newQty = Math.max(0, item.qty + delta);
      if (newQty === 0) { const n = {...prev}; delete n[id]; return n; }
      return { ...prev, [id]: { ...item, qty: newQty } };
    });
  };

  const cartItems = Object.values(cart).filter(i => i.qty > 0);
  const cartCount = cartItems.reduce((s,i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s,i) => s + i.qty * i.price, 0);

  return (
    <EditorContext.Provider value={{ editorOpen, setEditorOpen }}>
      <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif" }}>
        <Navbar settings={settings} cartCount={cartCount} onOrderClick={() => setCartOpen(true)} />
        <Hero settings={settings} />
        <Marquee settings={settings} />
        <MenuSection settings={settings} onAddToCart={addToCart} />
        <ReservationSection settings={settings} />
        <LocationSection settings={settings} />
        <Footer settings={settings} />
        <CartBar count={cartCount} total={cartTotal} settings={settings} onClick={() => setCartOpen(true)} />
        {cartOpen && <CartModal cart={cart} settings={settings} onClose={() => setCartOpen(false)} onQtyChange={changeQty} />}
        {editorOpen && <EditorPanel settings={settings} onUpdate={setSettings} onSave={saveSettings} onClose={() => setEditorOpen(false)} />}
      </div>
    </EditorContext.Provider>
  );
}
