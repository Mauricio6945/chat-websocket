import { useEffect, useRef, useState } from "react";
import { useChat } from "./useChat.js";

function Burbuja({ nombre, texto, hora, tipo, esMio }) {
  if (tipo === "sistema") return <p className="sistema">{texto} · {hora}</p>;
  return (
    <div className={esMio ? "burbuja mia" : "burbuja"}>
      {!esMio && <strong>{nombre}</strong>}
      <span>{texto}</span>
      <small>{hora}</small>
    </div>
  );
}

function Chat({ nombre }) {
  const { mensajes, usuarios, conectado, enviar } = useChat(nombre);
  const [texto, setTexto] = useState("");
  const fin = useRef(null);

  useEffect(() => {
    fin.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  function onSubmit(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    enviar(texto);
    setTexto("");
  }

  return (
    <div className="chat">
      <header>
        <h1>Chat TICS316</h1>
        <span className={conectado ? "estado ok" : "estado"}>
          {conectado ? "● conectado" : "○ reconectando…"}
        </span>
        <small>{usuarios.length} en línea: {usuarios.join(", ")}</small>
      </header>
      <main>
        {mensajes.map((m, i) => (
          <Burbuja key={i} {...m} esMio={m.nombre === nombre} />
        ))}
        <div ref={fin} />
      </main>
      <form onSubmit={onSubmit}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe un mensaje…"
          maxLength={300}
          autoFocus
        />
        <button disabled={!conectado}>Enviar</button>
      </form>
    </div>
  );
}

export default function App() {
  const [nombre, setNombre] = useState("");
  const [borrador, setBorrador] = useState("");

  if (!nombre) {
    return (
      <form
        className="entrada"
        onSubmit={(e) => {
          e.preventDefault();
          if (borrador.trim()) setNombre(borrador.trim());
        }}
      >
        <h1>Chat TICS316</h1>
        <input
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
          placeholder="Tu nombre"
          maxLength={20}
          autoFocus
        />
        <button>Entrar</button>
      </form>
    );
  }
  return <Chat nombre={nombre} />;
}
