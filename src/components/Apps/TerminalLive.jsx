import React, { useRef, useState, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';

// ============================================================
// MONEY HEIST CHARACTERS
// ============================================================
const CHARACTERS = [
  {
    id: 'tokyo',
    name: 'TOKYO',
    color: '#ef4444',
    ascii: `
  ████████╗ ██████╗ ██╗  ██╗██╗   ██╗ ██████╗ 
  ╚══██╔══╝██╔═══██╗██║ ██╔╝╚██╗ ██╔╝██╔═══██╗
     ██║   ██║   ██║█████╔╝  ╚████╔╝ ██║   ██║
     ██║   ██║   ██║██╔═██╗   ╚██╔╝  ██║   ██║
     ██║   ╚██████╔╝██║  ██╗   ██║   ╚██████╔╝
     ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝ `,
    welcome: 'Impulsive. Fearless. Unstoppable.',
    quote: '"I was born for chaos."',
  },
  {
    id: 'berlin',
    name: 'BERLIN',
    color: '#a78bfa',
    ascii: `
  ██████╗ ███████╗██████╗ ██╗     ██╗███╗   ██╗
  ██╔══██╗██╔════╝██╔══██╗██║     ██║████╗  ██║
  ██████╔╝█████╗  ██████╔╝██║     ██║██╔██╗ ██║
  ██╔══██╗██╔══╝  ██╔══██╗██║     ██║██║╚██╗██║
  ██████╔╝███████╗██║  ██║███████╗██║██║ ╚████║
  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝`,
    welcome: 'Ruthless. Elegant. In control.',
    quote: '"Patience is the weapon of the intelligent."',
  },
  {
    id: 'rio',
    name: 'RIO',
    color: '#34d399',
    ascii: `
  ██████╗ ██╗ ██████╗ 
  ██╔══██╗██║██╔═══██╗
  ██████╔╝██║██║   ██║
  ██╔══██╗██║██║   ██║
  ██║  ██║██║╚██████╔╝
  ╚═╝  ╚═╝╚═╝ ╚═════╝ `,
    welcome: 'The youngest. The sharpest hacker.',
    quote: '"Code is the only language that matters."',
  },
  {
    id: 'denver',
    name: 'DENVER',
    color: '#fbbf24',
    ascii: `
  ██████╗ ███████╗███╗   ██╗██╗   ██╗███████╗██████╗ 
  ██╔══██╗██╔════╝████╗  ██║██║   ██║██╔════╝██╔══██╗
  ██║  ██║█████╗  ██╔██╗ ██║██║   ██║█████╗  ██████╔╝
  ██║  ██║██╔══╝  ██║╚██╗██║╚██╗ ██╔╝██╔══╝  ██╔══██╗
  ██████╔╝███████╗██║ ╚████║ ╚████╔╝ ███████╗██║  ██║
  ╚═════╝ ╚══════╝╚═╝  ╚═══╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝`,
    welcome: 'Big heart. Bigger laugh. Loyal to the end.',
    quote: '"Hahaha... wait, are you serious?"',
  },
  {
    id: 'moscow',
    name: 'MOSCOW',
    color: '#60a5fa',
    ascii: `
  ███╗   ███╗ ██████╗ ███████╗ ██████╗ ██████╗ ██╗    ██╗
  ████╗ ████║██╔═══██╗██╔════╝██╔════╝██╔═══██╗██║    ██║
  ██╔████╔██║██║   ██║███████╗██║     ██║   ██║██║ █╗ ██║
  ██║╚██╔╝██║██║   ██║╚════██║██║     ██║   ██║██║███╗██║
  ██║ ╚═╝ ██║╚██████╔╝███████║╚██████╗╚██████╔╝╚███╔███╔╝
  ╚═╝     ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝  ╚══╝╚══╝`,
    welcome: 'The old guard. The heart of the heist.',
    quote: '"A father does what he must."',
  },
  {
    id: 'nairobi',
    name: 'NAIROBI',
    color: '#f97316',
    ascii: `
  ███╗   ██╗ █████╗ ██╗██████╗  ██████╗ ██████╗ ██╗
  ████╗  ██║██╔══██╗██║██╔══██╗██╔═══██╗██╔══██╗██║
  ██╔██╗ ██║███████║██║██████╔╝██║   ██║██████╔╝██║
  ██║╚██╗██║██╔══██║██║██╔══██╗██║   ██║██╔══██╗██║
  ██║ ╚████║██║  ██║██║██║  ██║╚██████╔╝██████╔╝██║
  ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝`,
    welcome: 'The boss of the mint. Queen of the heist.',
    quote: '"Get back to work!"',
  },
];

// ============================================================
// ROOKIE HINTS — tiered hints that appear after inactivity
// ============================================================
const ROOKIE_HINTS = [
  { delay: 20000, msg: '💡 Coba ketik  ls  untuk lihat isi direktori saat ini.' },
  { delay: 45000, msg: '💡 Ada file tersembunyi di /home/he1st — coba  ls -la  untuk lihat semuanya.' },
  { delay: 80000, msg: '💡 Sudah baca semua file di /home/he1st dan subdirektorinya? Gunakan  cat <filename>.' },
  { delay: 120000, msg: '💡 Hint terakhir: password ada hubungannya dengan nama — cek file .hidden.' },
];

// ============================================================
// FILESYSTEM
// ============================================================
const FS = {
  '/': ['home', 'etc', 'var', 'secret'],
  '/home': ['guest', 'he1st'],
  '/home/guest': ['readme.txt'],
  // .hidden is NOT listed here — only visible via ls -la
  '/home/he1st': ['projects', 'notes.txt'],
  '/home/he1st/projects': ['portfolio.md', 'ctf.log'],
  '/home/he1st/.hidden': ['.password_hint'],
  '/etc': ['hosts', 'motd'],
  '/var': ['logs'],
  '/var/logs': ['access.log'],
  '/secret': ['ACCESS_DENIED'],
};

// For ls -la — includes hidden entries
const FS_ALL = {
  ...FS,
  '/home/he1st': ['projects', 'notes.txt', '.hidden'],
};

const FILES = {
  '/home/guest/readme.txt': `Welcome to he1st-server.
This is a public access terminal.
Explore freely. But some doors require a key...

HINT: The AI that guards the contact form might know the password.
      Her name... is the key.

Type 'help' to see available commands.`,

  '/home/he1st/notes.txt': `Personal notes — he1st

- Portfolio built with React + Vite
- Specializing in Frontend & Cybersecurity
- IGnite bootcamp: JWT Token Forgery solved
- Remember: password is the chatbot's name (lowercase)

...wait, I shouldn't have written that here.`,

  '/home/he1st/projects/portfolio.md': `# he1st Portfolio

Tech Stack:
- React, Vite, TailwindCSS
- Cybersecurity (Web Exploitation, JWT, OSINT)
- UI/UX Design

Featured Projects:
[1] This portfolio — OS-themed personal site
[2] CTF Writeups — JWT Token Forgery
[3] Network Map — Interactive skill visualization

Source: github.com/he1st`,

  '/home/he1st/projects/ctf.log': `[2024] JWT Token Forgery — SOLVED
Event: IGnite Cybersecurity Bootcamp
Flag: FLAG{jwt_n0n3_alg_byp4ss_ftw}
Technique: Algorithm Confusion (alg: none)
Tools: jwt.io, Burp Suite, Python`,

  '/home/he1st/.hidden/.password_hint': `You found it. Nice work.

The password is the name of the AI assistant
embedded in this portfolio's contact section.

She was named after a flower that survives
even in the harshest conditions.

ssh he1st@he1st-server`,

  '/etc/hosts': `127.0.0.1   localhost
127.0.0.1   he1st-server
192.168.1.1  gateway
10.0.0.1    internal`,

  '/etc/motd': `=======================================
   he1st-server v2.0 — SECURE TERMINAL
   Unauthorized access is prohibited.
   All sessions are monitored & logged.
=======================================`,

  '/var/logs/access.log': `[2024-01-15 08:32:11] guest LOGIN from 192.168.1.105
[2024-01-15 08:45:23] guest READ /home/guest/readme.txt
[2024-01-15 09:01:44] UNKNOWN SSH ATTEMPT — BLOCKED
[2024-01-15 09:15:02] guest LOGOUT
[2025-03-20 14:22:55] guest LOGIN
[2025-03-20 14:23:01] guest READ /home/he1st/notes.txt — PERMISSION WARNING
[2025-04-01 00:00:01] SYSTEM MAINTENANCE — root`,

  '/secret/ACCESS_DENIED': `ACCESS DENIED.

This directory requires root privileges.
Use 'ssh he1st@he1st-server' to escalate.`,
};

// ============================================================
// COMMAND ENGINE
// ============================================================
function processCommand(input, state) {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  const flags = args.filter(a => a.startsWith('-'));
  const posArgs = args.filter(a => !a.startsWith('-'));

  const { cwd, username, authenticated } = state;

  const resolvePath = (p) => {
    if (!p) return cwd;
    if (p.startsWith('/')) return p;
    if (p === '..') {
      const segs = cwd.split('/').filter(Boolean);
      segs.pop();
      return '/' + segs.join('/') || '/';
    }
    if (p === '.') return cwd;
    return (cwd === '/' ? '' : cwd) + '/' + p;
  };

  switch (cmd) {
    case '': return { output: '', newCwd: cwd };

    case 'help':
      return {
        output: `Available commands:
  help           — show this help
  whoami         — display current user
  pwd            — print working directory
  ls [path]      — list directory contents
  ls -la [path]  — list ALL files including hidden
  cd <path>      — change directory
  cat <file>     — display file contents
  clear          — clear terminal
  nmap           — network scanner
  netcat / nc    — network utility
  hydra          — login cracker
  ssh <target>   — connect to remote
  history        — command history
  uname          — system info
  ps             — running processes
  ifconfig       — network interfaces
  ping <host>    — ping a host
  exit           — close terminal

  [HINT] Some commands unlock hidden content...`,
        newCwd: cwd,
      };

    case 'whoami':
      return { output: authenticated ? 'he1st' : username, newCwd: cwd };

    case 'pwd':
      return { output: cwd, newCwd: cwd };

    case 'uname':
      return { output: 'Linux he1st-server 6.1.0-kali #1 SMP PREEMPT_DYNAMIC Kali 6.1 x86_64 GNU/Linux', newCwd: cwd };

    case 'ls': {
      const showAll = flags.some(f => f.includes('a') || f === '-la' || f === '-al');
      const showLong = flags.some(f => f.includes('l') || f === '-la' || f === '-al');
      const target = resolvePath(posArgs[0]);
      const fsSource = showAll ? FS_ALL : FS;
      const contents = fsSource[target];
      if (!contents) return { output: `ls: cannot access '${posArgs[0] || target}': No such file or directory`, newCwd: cwd, isError: true };

      const items = contents.map(item => {
        const fullPath = (target === '/' ? '' : target) + '/' + item;
        const isDir = FS_ALL[fullPath] !== undefined;
        return { text: item, isDir };
      });

      if (showLong) {
        const longLines = items.map(item => {
          const perm = item.isDir ? 'drwxr-xr-x' : '-rw-r--r--';
          const owner = authenticated ? 'he1st he1st' : 'guest guest';
          const size = item.isDir ? '4096' : '512 ';
          return `${perm}  1 ${owner}  ${size}  May  7 18:36  ${item.text}`;
        });
        return { output: `total ${items.length * 8}\n` + longLines.join('\n'), newCwd: cwd };
      }

      return { output: items, type: 'ls', newCwd: cwd };
    }

    case 'cd': {
      if (!args[0]) return { output: '', newCwd: '/home/guest' };
      const target = resolvePath(args[0]);
      if (!FS_ALL[target]) return { output: `cd: no such file or directory: ${args[0]}`, newCwd: cwd, isError: true };
      return { output: '', newCwd: target };
    }

    case 'cat': {
      if (!args[0]) return { output: 'cat: missing operand', newCwd: cwd, isError: true };
      const target = resolvePath(args[0]);
      const content = FILES[target];
      if (!content) {
        if (FS_ALL[target]) return { output: `cat: ${args[0]}: Is a directory`, newCwd: cwd, isError: true };
        return { output: `cat: ${args[0]}: No such file or directory`, newCwd: cwd, isError: true };
      }
      return { output: content, newCwd: cwd };
    }

    case 'nmap':
      return {
        output: `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for he1st-server (127.0.0.1)
Host is up (0.00013s latency).

PORT     STATE    SERVICE
22/tcp   open     ssh
80/tcp   open     http
443/tcp  open     https
3000/tcp open     ppp
8080/tcp filtered http-proxy

Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds

[!] Port 22 open — SSH available. Try: ssh he1st@he1st-server`,
        newCwd: cwd,
      };

    case 'netcat':
    case 'nc':
      if (args.includes('he1st-server') || args.includes('127.0.0.1')) {
        return {
          output: `Connection to he1st-server 22 port [tcp/ssh] succeeded!
SSH-2.0-OpenSSH_9.3p1
Protocol mismatch.

[!] Use 'ssh he1st@he1st-server' for proper connection.`,
          newCwd: cwd,
        };
      }
      return { output: `nc: getaddrinfo for host "${args[0] || 'localhost'}" port ${args[1] || '80'}: Name or service not known`, newCwd: cwd, isError: true };

    case 'hydra':
      return {
        output: `Hydra v9.4 (c) 2022 by van Hauser/THC

[DATA] attacking ssh://he1st-server:22/
[DATA] 16 tasks, 1 server, 14344398 login tries
[STATUS] 512.00 tries/min, 512 tries in 00:01h
[ERROR] Too many failed attempts. Rate limited.

[HINT] Maybe you don't need to brute force it.
       Look around the filesystem... the password
       might already be somewhere you've been.`,
        newCwd: cwd,
      };

    case 'ssh': {
      const target = args[0];
      if (!target) return { output: 'usage: ssh [user@]hostname', newCwd: cwd, isError: true };
      if (target === 'he1st@he1st-server' || target === 'he1st') {
        return { output: '', newCwd: cwd, type: 'ssh_prompt' };
      }
      return { output: `ssh: Could not resolve hostname ${target}: Name or service not known`, newCwd: cwd, isError: true };
    }

    case 'ifconfig':
      return {
        output: `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.0.0.42  netmask 255.255.255.0  broadcast 10.0.0.255
        ether 02:42:ac:11:00:02  txqueuelen 0  (Ethernet)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0`,
        newCwd: cwd,
      };

    case 'ping':
      return {
        output: `PING ${args[0] || 'localhost'} (127.0.0.1) 56(84) bytes of data.
64 bytes from ${args[0] || 'localhost'} (127.0.0.1): icmp_seq=1 ttl=64 time=0.021 ms
64 bytes from ${args[0] || 'localhost'} (127.0.0.1): icmp_seq=2 ttl=64 time=0.019 ms
64 bytes from ${args[0] || 'localhost'} (127.0.0.1): icmp_seq=3 ttl=64 time=0.022 ms
^C
--- ${args[0] || 'localhost'} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss`,
        newCwd: cwd,
      };

    case 'ps':
      return {
        output: `  PID TTY          TIME CMD
    1 ?        00:00:01 systemd
  312 ?        00:00:00 sshd
  891 pts/0    00:00:00 bash
  892 pts/0    00:00:00 node (portfolio)
  901 pts/0    00:00:00 ps`,
        newCwd: cwd,
      };

    case 'history':
      return {
        output: `    1  ls
    2  cd /home/he1st
    3  ls -la
    4  cat notes.txt
    5  cd .hidden
    6  cat .password_hint
    7  ssh he1st@he1st-server
    8  history`,
        newCwd: cwd,
      };

    case 'clear':
      return { output: '', newCwd: cwd, type: 'clear' };

    case 'exit':
      return { output: 'logout\nConnection to he1st-server closed.', newCwd: cwd, type: 'exit' };

    default:
      return {
        output: `bash: ${cmd}: command not found\nType 'help' for available commands.`,
        newCwd: cwd,
        isError: true,
      };
  }
}

// ============================================================
// CERTIFICATE COMPONENT
// ============================================================
function Certificate({ character, onClose }) {
  const char = CHARACTERS.find(c => c.id === character) || CHARACTERS[0];
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#000000ee',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 999, animation: 'tl-fadein 0.5s ease',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0a, #111)',
        border: `2px solid ${char.color}`,
        borderRadius: 12, padding: '32px 40px', maxWidth: 500, width: '90%',
        boxShadow: `0 0 60px ${char.color}40, 0 0 120px ${char.color}20`,
        textAlign: 'center', fontFamily: 'monospace',
        position: 'relative',
      }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            position: 'absolute', width: 16, height: 16,
            borderTop: i < 2 ? `2px solid ${char.color}` : 'none',
            borderBottom: i >= 2 ? `2px solid ${char.color}` : 'none',
            borderLeft: i % 2 === 0 ? `2px solid ${char.color}` : 'none',
            borderRight: i % 2 === 1 ? `2px solid ${char.color}` : 'none',
            top: i < 2 ? 8 : 'auto', bottom: i >= 2 ? 8 : 'auto',
            left: i % 2 === 0 ? 8 : 'auto', right: i % 2 === 1 ? 8 : 'auto',
          }} />
        ))}

        <div style={{ fontSize: 9, color: char.color, letterSpacing: '0.3em', marginBottom: 8 }}>
          ◆ CERTIFICATE OF ACHIEVEMENT ◆
        </div>
        <div style={{ fontSize: 11, color: '#555', marginBottom: 20 }}>
          he1st-server :: UNAUTHORIZED ACCESS GRANTED
        </div>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🏆</div>
        <div style={{ fontSize: 14, color: '#fff', fontWeight: 'bold', marginBottom: 4 }}>
          THIS CERTIFIES THAT
        </div>
        <div style={{ fontSize: 22, color: char.color, fontWeight: 'bold', marginBottom: 4,
          textShadow: `0 0 20px ${char.color}` }}>
          {char.name}
        </div>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 20 }}>
          has successfully infiltrated he1st's portfolio server
        </div>
        <div style={{ background: '#ffffff05', border: `1px solid ${char.color}30`,
          borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: '#888', marginBottom: 6 }}>ACHIEVEMENT UNLOCKED</div>
          <div style={{ fontSize: 12, color: char.color }}>🚩 "Ghost in the Portfolio"</div>
          <div style={{ fontSize: 10, color: '#555', marginTop: 4 }}>
            Found the password. Escalated privileges. Left no traces.
          </div>
        </div>
        <div style={{ fontSize: 10, color: '#444', marginBottom: 4 }}>
          "Real hackers don't brute force — they READ."
        </div>
        <div style={{ fontSize: 9, color: '#333', marginBottom: 24 }}>
          Issued: {date} · he1st-server Security Division
        </div>
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onClose(); }}
          style={{
            padding: '8px 20px', background: char.color + '20',
            border: `1px solid ${char.color}60`, borderRadius: 6,
            color: char.color, fontSize: 11, cursor: 'pointer', fontFamily: 'monospace',
          }}
        >
          [ CLOSE ]
        </button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN TERMINAL — HEIST TERM
// ============================================================
export default function TerminalLive({ isMaximized, toggleMax, minimize, close, zIndex, onFocus }) {
  const nodeRef = useRef(null);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const [phase, setPhase] = useState('intro');   // 'intro' | 'mode' | 'select' | 'terminal'
  const [mode, setMode] = useState(null);        // 'rookie' | 'operative'
  const [character, setCharacter] = useState(null);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('/home/guest');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [authenticated, setAuthenticated] = useState(false);
  const [sshPending, setSshPending] = useState(false);
  const [sshInput, setSshInput] = useState('');
  const [showCert, setShowCert] = useState(false);
  const [rookieHint, setRookieHint] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const hintTimerRef = useRef(null);
  const hintIdxRef = useRef(0);

  const char = CHARACTERS.find(c => c.id === character);

  // Rookie hint system
  useEffect(() => {
    if (mode !== 'rookie' || phase !== 'terminal' || authenticated) return;
    hintIdxRef.current = 0;

    const scheduleNextHint = () => {
      const hint = ROOKIE_HINTS[hintIdxRef.current];
      if (!hint) return;
      hintTimerRef.current = setTimeout(() => {
        setRookieHint(hint.msg);
        setTimeout(() => setRookieHint(null), 8000);
        hintIdxRef.current++;
        scheduleNextHint();
      }, hint.delay);
    };

    scheduleNextHint();
    return () => clearTimeout(hintTimerRef.current);
  }, [mode, phase, authenticated]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    if (phase === 'terminal') setTimeout(() => inputRef.current?.focus(), 100);
  }, [phase]);

  const selectCharacter = (id) => {
    setCharacter(id);
    setPhase('terminal');
    const c = CHARACTERS.find(ch => ch.id === id);
    setHistory([
      { type: 'ascii', content: c.ascii, color: c.color },
      { type: 'welcome', name: c.name, tagline: c.welcome, quote: c.quote, color: c.color },
      { type: 'output', content: `Connected to he1st-server as ${c.name.toLowerCase()}\nMode: ${mode === 'rookie' ? 'ROOKIE 🟢' : 'OPERATIVE 🔴'}\nType 'help' to see available commands.\n` },
    ]);
    setCwd('/home/guest');
    setAuthenticated(false);
  };

  const addToHistory = (entry) => setHistory(prev => [...prev, entry]);

  const submitCommand = useCallback((cmd) => {
    setLastActivity(Date.now());
    if (!cmd.trim()) {
      addToHistory({ type: 'prompt', cmd: '', cwd, username: char?.name.toLowerCase() || 'guest', authenticated });
      return;
    }
    addToHistory({ type: 'prompt', cmd, cwd, username: char?.name.toLowerCase() || 'guest', authenticated });
    setCmdHistory(prev => [cmd, ...prev]);
    setHistoryIdx(-1);

    const result = processCommand(cmd, { cwd, username: char?.name.toLowerCase(), authenticated });

    if (result.type === 'clear') { setHistory([]); return; }

    if (result.type === 'ssh_prompt') {
      setSshPending(true);
      addToHistory({ type: 'output', content: `he1st@he1st-server's password: ` });
      return;
    }

    if (result.type === 'exit') {
      addToHistory({ type: 'output', content: result.output });
      setTimeout(() => setPhase('intro'), 1500);
      return;
    }

    if (result.newCwd !== cwd) setCwd(result.newCwd);

    if (result.output !== '') {
      if (result.type === 'ls') {
        addToHistory({ type: 'ls', items: result.output });
      } else {
        addToHistory({ type: result.isError ? 'error' : 'output', content: result.output });
      }
    }
  }, [cwd, char, authenticated]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (sshPending) {
        const pwd = sshInput;
        setSshInput('');
        setSshPending(false);
        addToHistory({ type: 'output', content: '' });
        if (pwd.toLowerCase() === 'edelweys') {
          setAuthenticated(true);
          setCwd('/home/he1st');
          addToHistory({
            type: 'output',
            content: `Welcome to he1st's private shell.
Last login: Thu May 7 18:36:01 2026

ACCESS GRANTED ✓
You have root privileges on this server.

Bella Ciao, ${char?.name || 'operative'}. You made it.`,
          });
          setTimeout(() => setShowCert(true), 2000);
        } else {
          addToHistory({ type: 'error', content: 'Permission denied, please try again.\nHint: Look around the filesystem...' });
        }
        return;
      }
      submitCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(newIdx);
      setInput(cmdHistory[newIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(newIdx);
      setInput(newIdx === -1 ? '' : cmdHistory[newIdx] || '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const cmds = ['help','whoami','pwd','ls','cd','cat','clear','nmap','netcat','nc','hydra','ssh','history','uname','ps','ifconfig','ping','exit'];
      const match = cmds.find(c => c.startsWith(input));
      if (match) setInput(match);
    }
  };

  const accentColor = char?.color || '#ef4444';

  const resetAll = () => {
    setPhase('intro');
    setMode(null);
    setCharacter(null);
    setAuthenticated(false);
    setHistory([]);
    setInput('');
    setCwd('/home/guest');
    setCmdHistory([]);
    setHistoryIdx(-1);
    setSshPending(false);
    setSshInput('');
    setShowCert(false);
    setRookieHint(null);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".tl-header"
      disabled={isMaximized || window.innerWidth < 768}
      position={isMaximized || window.innerWidth < 768 ? { x: 0, y: 0 } : null}
    >
      <div
        ref={nodeRef}
        onMouseDown={onFocus}
        onTouchStart={onFocus}
        style={{
          zIndex,
          background: '#080808',
          border: `1px solid ${accentColor}25`,
          fontFamily: '"Courier New", Courier, monospace',
          boxShadow: `0 0 40px ${accentColor}10`,
        }}
        className={`text-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300
          ${isMaximized
            ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none'
            : 'absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl max-h-[700px] rounded-xl'}`}
      >
        <style>{`
          @keyframes tl-fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
          @keyframes tl-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
          @keyframes tl-hint   { 0%{opacity:0;transform:translateY(4px)} 10%{opacity:1;transform:translateY(0)} 85%{opacity:1} 100%{opacity:0} }
          .tl-char-btn:hover   { transform: scale(1.03); }
          .tl-char-btn         { transition: all 0.2s ease; }
          .tl-mode-btn:hover   { filter: brightness(1.3); transform: translateY(-2px); }
          .tl-mode-btn         { transition: all 0.2s ease; }
        `}</style>

        {/* HEADER */}
        <div className="tl-header" style={{
          background: '#0a0a0a', borderBottom: `1px solid ${accentColor}20`,
          padding: '8px 16px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', cursor: 'move', userSelect: 'none', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: '#ef4444' }}>⬡</span>
            <span style={{ fontSize: 10, color: '#ef4444', letterSpacing: '0.2em', fontWeight: 'bold' }}>
              HEIST<span style={{ color: '#ffffff60' }}>:</span>TERM
            </span>
            <span style={{ fontSize: 9, color: '#333' }}>— he1st-server</span>
            {authenticated && (
              <span style={{ fontSize: 9, color: '#22c55e', background: '#22c55e15', padding: '1px 8px', borderRadius: 99, border: '1px solid #22c55e30' }}>
                ROOT ✓
              </span>
            )}
            {mode && (
              <span style={{ fontSize: 9, color: mode === 'rookie' ? '#22c55e' : '#ef4444', background: (mode === 'rookie' ? '#22c55e' : '#ef4444') + '15', padding: '1px 8px', borderRadius: 99 }}>
                {mode === 'rookie' ? '🟢 ROOKIE' : '🔴 OPERATIVE'}
              </span>
            )}
            {character && (
              <span style={{ fontSize: 9, color: accentColor, background: accentColor + '15', padding: '1px 8px', borderRadius: 99, border: `1px solid ${accentColor}30` }}>
                {char?.name}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); minimize(); }}
              style={{ width: 28, height: 28, background: 'none', border: 'none', color: '#444', cursor: 'pointer', borderRadius: 4, fontSize: 14 }}>—</button>
            <button onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); toggleMax(); }}
              style={{ width: 28, height: 28, background: 'none', border: 'none', color: '#444', cursor: 'pointer', borderRadius: 4, fontSize: 12 }}>❑</button>
            <button onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); close(); }}
              style={{ width: 28, height: 28, background: 'none', border: 'none', color: '#444', cursor: 'pointer', borderRadius: 4, fontSize: 14 }}
              onMouseEnter={e => e.currentTarget.style.background = '#7f1d1d'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>✕</button>
          </div>
        </div>

        {/* ── PHASE: INTRO ── */}
        {phase === 'intro' && (
          <div style={{ flex: 1, overflowY: 'auto', background: '#050505', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>

            {/* ASCII mask image */}
            <img
              src="/img/ascii-art2.png"
              alt="Money Heist Mask"
              style={{ width: 120, marginBottom: 16, imageRendering: 'pixelated', opacity: 0.9,
                filter: 'drop-shadow(0 0 18px #ef444480)' }}
              onError={e => { e.target.style.display = 'none'; }}
            />

            {/* Fallback ASCII mask if image fails */}
            <pre style={{
              display: 'none',
              color: '#cc2222', fontSize: 8, lineHeight: 1.2, fontFamily: 'monospace',
              textAlign: 'center', margin: '0 0 16px 0',
              textShadow: '0 0 18px #ef444480, 0 0 40px #ef444430',
            }}>{`      .   _________   .
    .  /  _______  \\  .
   .  /  / _____\\  \\  .
  .  |  | |  /\\ |  |  .
  .  |  | | ( ) |  |  .
  .  |  |  \\ V /   |  .
   .  \\  \\__ _ __/ /  .
    .   \\   ___   /   .
     .   |  ( )  |   .
      .  |_______|  .`}</pre>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 9, color: '#ef4444', letterSpacing: '0.4em', marginBottom: 6, textShadow: '0 0 12px #ef444460' }}>
                ◆ BELLA CIAO ◆
              </div>
              <div style={{ fontSize: 22, color: '#fff', fontWeight: 'bold', letterSpacing: '0.2em', fontFamily: 'monospace' }}>
                HEIST<span style={{ color: '#ef4444' }}>:TERM</span>
              </div>
              <div style={{ fontSize: 10, color: '#555', letterSpacing: '0.2em', marginTop: 4 }}>
                he1st-server // CAPTURE THE FLAG
              </div>
            </div>

            <div style={{
              background: '#0a0a0a', border: '1px solid #ef444425',
              borderRadius: 10, padding: '18px 24px',
              maxWidth: 500, width: '100%', marginBottom: 20,
            }}>
              <div style={{ fontSize: 9, color: '#ef4444', letterSpacing: '0.25em', marginBottom: 12 }}>
                📋 MISSION BRIEFING
              </div>
              <div style={{ fontSize: 11, color: '#888', lineHeight: 1.8, marginBottom: 12 }}>
                Selamat datang, operative. Kamu baru saja mendapatkan akses ke
                <span style={{ color: '#ef4444' }}> he1st-server</span> — server milik seorang
                developer yang menyembunyikan sesuatu di dalamnya.
              </div>
              <div style={{ fontSize: 11, color: '#888', lineHeight: 1.8, marginBottom: 14 }}>
                Tugasmu: <span style={{ color: '#fbbf24' }}>temukan password</span> dan gunakan
                untuk login sebagai <span style={{ color: '#60a5fa' }}>he1st</span>.
                Clue-nya tersebar di seluruh filesystem. Jelajahi semuanya.
              </div>
              <div style={{ borderTop: '1px solid #ffffff08', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ fontSize: 9, color: '#ef4444', letterSpacing: '0.2em', marginBottom: 4 }}>RULES:</div>
                {[
                  '01. Ketik  help  untuk melihat semua command',
                  '02. Gunakan  ls  dan  cat  untuk jelajahi filesystem',
                  '03. Ada file yang tersembunyi — tidak semua terlihat di  ls  biasa',
                  '04. Password tersembunyi — temukan sendiri, jangan tebak',
                  '05. Berhasil login?  Hadiah menanti kamu.',
                ].map((rule, i) => (
                  <div key={i} style={{ fontSize: 10, color: '#555' }}>
                    <span style={{ color: '#ef444450' }}>&gt; </span>{rule}
                  </div>
                ))}
              </div>
            </div>

            <button
              className="tl-mode-btn"
              onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); setPhase('mode'); }}
              style={{
                padding: '12px 40px',
                background: 'linear-gradient(135deg, #ef444420, #7f1d1d20)',
                border: '1px solid #ef444450', borderRadius: 8,
                color: '#ef4444', fontSize: 12, fontWeight: 'bold',
                letterSpacing: '0.2em', cursor: 'pointer', fontFamily: 'monospace',
                boxShadow: '0 0 20px #ef444420',
              }}
            >
              [ ACCEPT MISSION ]
            </button>

            <div style={{ fontSize: 9, color: '#333', marginTop: 12 }}>
              Bella Ciao, Bella Ciao, Bella Ciao Ciao Ciao...
            </div>
          </div>
        )}

        {/* ── PHASE: MODE SELECT ── */}
        {phase === 'mode' && (
          <div style={{ flex: 1, overflowY: 'auto', background: '#050505', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: '#ef4444', letterSpacing: '0.35em', marginBottom: 8 }}>◆ CHOOSE YOUR DIFFICULTY ◆</div>
              <div style={{ fontSize: 13, color: '#888' }}>Pilih mode sebelum operasi dimulai</div>
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 520, width: '100%' }}>
              {/* ROOKIE */}
              <button
                className="tl-mode-btn"
                onPointerDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); setMode('rookie'); setPhase('select'); }}
                style={{
                  flex: 1, minWidth: 200,
                  background: 'linear-gradient(135deg, #22c55e10, transparent)',
                  border: '1px solid #22c55e40', borderRadius: 12,
                  padding: '20px 24px', cursor: 'pointer', textAlign: 'left', color: '#fff',
                  fontFamily: 'monospace',
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 8 }}>🟢</div>
                <div style={{ fontSize: 14, color: '#22c55e', fontWeight: 'bold', marginBottom: 6 }}>ROOKIE</div>
                <div style={{ fontSize: 10, color: '#666', lineHeight: 1.7 }}>
                  Cocok untuk pemula.<br />
                  Ada hint yang muncul otomatis kalau kamu stuck terlalu lama.<br />
                  <span style={{ color: '#22c55e80' }}>No judgment. Just explore.</span>
                </div>
              </button>

              {/* OPERATIVE */}
              <button
                className="tl-mode-btn"
                onPointerDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); setMode('operative'); setPhase('select'); }}
                style={{
                  flex: 1, minWidth: 200,
                  background: 'linear-gradient(135deg, #ef444410, transparent)',
                  border: '1px solid #ef444440', borderRadius: 12,
                  padding: '20px 24px', cursor: 'pointer', textAlign: 'left', color: '#fff',
                  fontFamily: 'monospace',
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 8 }}>🔴</div>
                <div style={{ fontSize: 14, color: '#ef4444', fontWeight: 'bold', marginBottom: 6 }}>OPERATIVE</div>
                <div style={{ fontSize: 10, color: '#666', lineHeight: 1.7 }}>
                  Pure, no hints, no mercy.<br />
                  Temukan password sendiri dari awal.<br />
                  <span style={{ color: '#ef444480' }}>Real hackers read. Not guess.</span>
                </div>
              </button>
            </div>

            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); setPhase('intro'); }}
              style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 10, fontFamily: 'monospace' }}
            >
              ← back
            </button>
          </div>
        )}

        {/* ── PHASE: CHARACTER SELECT ── */}
        {phase === 'select' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: 24, background: '#050505' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 10, color: '#ef4444', letterSpacing: '0.3em', marginBottom: 8 }}>◆ IDENTITY SELECTION ◆</div>
              <div style={{ fontSize: 13, color: '#888' }}>Choose your operative for this session</div>
              <div style={{ fontSize: 10, color: '#444', marginTop: 4 }}>Bella Ciao.</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {CHARACTERS.map(c => (
                <button
                  key={c.id}
                  className="tl-char-btn"
                  onPointerDown={e => e.stopPropagation()}
                  onClick={e => { e.stopPropagation(); selectCharacter(c.id); }}
                  style={{
                    background: `linear-gradient(135deg, ${c.color}08, transparent)`,
                    border: `1px solid ${c.color}30`, borderRadius: 10,
                    padding: 16, cursor: 'pointer', textAlign: 'left', color: '#fff',
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 'bold', color: c.color, marginBottom: 4, fontFamily: 'monospace' }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: '#666', marginBottom: 6, fontFamily: 'monospace' }}>{c.welcome}</div>
                  <div style={{ fontSize: 9, color: c.color + '90', fontStyle: 'italic', fontFamily: 'monospace' }}>{c.quote}</div>
                </button>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); setPhase('mode'); }}
                style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 10, fontFamily: 'monospace' }}
              >
                ← back
              </button>
            </div>
          </div>
        )}

        {/* ── PHASE: TERMINAL ── */}
        {phase === 'terminal' && (
          <>
            <div
              style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', background: '#050505', cursor: 'text', position: 'relative' }}
              onClick={() => inputRef.current?.focus()}
            >
              {/* ROOKIE HINT TOAST */}
              {mode === 'rookie' && rookieHint && (
                <div style={{
                  position: 'sticky', top: 8, zIndex: 10,
                  background: '#22c55e18', border: '1px solid #22c55e40',
                  borderRadius: 8, padding: '8px 14px', marginBottom: 8,
                  fontSize: 10, color: '#22c55e', fontFamily: 'monospace',
                  animation: 'tl-hint 8s ease forwards',
                }}>
                  {rookieHint}
                </div>
              )}

              {history.map((entry, i) => (
                <div key={i} style={{ marginBottom: 4, animation: 'tl-fadein 0.2s ease' }}>

                  {entry.type === 'ascii' && (
                    <pre style={{ color: entry.color, fontSize: 9, lineHeight: 1.3, margin: '8px 0', overflow: 'hidden',
                      textShadow: `0 0 10px ${entry.color}80` }}>
                      {entry.content}
                    </pre>
                  )}

                  {entry.type === 'welcome' && (
                    <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${entry.color}20` }}>
                      <div style={{ fontSize: 11, color: entry.color, fontWeight: 'bold' }}>Welcome, {entry.name}.</div>
                      <div style={{ fontSize: 10, color: '#666' }}>{entry.tagline}</div>
                      <div style={{ fontSize: 10, color: entry.color + '80', fontStyle: 'italic', marginTop: 4 }}>{entry.quote}</div>
                    </div>
                  )}

                  {entry.type === 'prompt' && (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
                      <span style={{ color: accentColor, fontSize: 11, flexShrink: 0 }}>
                        {entry.authenticated ? 'he1st' : entry.username}@he1st-server
                      </span>
                      <span style={{ color: '#555', fontSize: 11 }}>:</span>
                      <span style={{ color: '#60a5fa', fontSize: 11 }}>{entry.cwd}</span>
                      <span style={{ color: '#555', fontSize: 11 }}>$</span>
                      <span style={{ color: '#ddd', fontSize: 11 }}>{entry.cmd}</span>
                    </div>
                  )}

                  {entry.type === 'output' && (
                    <pre style={{ color: '#9ca3af', fontSize: 11, whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.6 }}>
                      {entry.content}
                    </pre>
                  )}

                  {entry.type === 'error' && (
                    <pre style={{ color: '#f87171', fontSize: 11, whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.6 }}>
                      {entry.content}
                    </pre>
                  )}

                  {entry.type === 'ls' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', padding: '2px 0' }}>
                      {entry.items.map((item, j) => (
                        <span key={j} style={{
                          fontSize: 11,
                          color: item.isDir ? '#60a5fa' : item.text.startsWith('.') ? '#666' : '#9ca3af',
                          fontWeight: item.isDir ? 'bold' : 'normal',
                        }}>
                          {item.text}{item.isDir ? '/' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Input line */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginTop: 4 }}>
                {!sshPending ? (
                  <>
                    <span style={{ color: accentColor, fontSize: 11, flexShrink: 0 }}>
                      {authenticated ? 'he1st' : char?.name.toLowerCase() || 'guest'}@he1st-server
                    </span>
                    <span style={{ color: '#555', fontSize: 11 }}>:</span>
                    <span style={{ color: '#60a5fa', fontSize: 11 }}>{cwd}</span>
                    <span style={{ color: '#555', fontSize: 11 }}>$</span>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onPointerDown={e => e.stopPropagation()}
                      style={{ flex: 1, background: 'none', border: 'none', outline: 'none',
                        color: '#ddd', fontSize: 11, fontFamily: 'monospace', caretColor: accentColor }}
                      autoComplete="off" spellCheck={false}
                    />
                  </>
                ) : (
                  <input
                    ref={inputRef}
                    value={sshInput}
                    onChange={e => setSshInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPointerDown={e => e.stopPropagation()}
                    type="password"
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none',
                      color: 'transparent', fontSize: 11, fontFamily: 'monospace', caretColor: accentColor }}
                    autoComplete="off"
                  />
                )}
              </div>
              <div ref={bottomRef} />
            </div>

            {/* FOOTER */}
            <div style={{
              background: '#0a0a0a', borderTop: `1px solid ${accentColor}10`,
              padding: '4px 16px', display: 'flex', justifyContent: 'space-between',
              fontSize: 9, color: '#333', fontFamily: 'monospace', flexShrink: 0,
            }}>
              <span style={{ color: accentColor + '60' }}>HEIST:TERM</span>
              <span>TAB: autocomplete · ↑↓: history · type 'help'</span>
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); resetAll(); }}
                style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 9, fontFamily: 'monospace' }}
              >
                [restart]
              </button>
            </div>
          </>
        )}

        {showCert && <Certificate character={character} onClose={() => setShowCert(false)} />}
      </div>
    </Draggable>
  );
}