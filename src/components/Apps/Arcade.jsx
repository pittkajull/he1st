import { useState, useEffect, useCallback, useRef } from "react";
import Draggable from "react-draggable";

// ═══════════════════════════════════════════════════════════════
// SHARED UI HELPERS
// ═══════════════════════════════════════════════════════════════
function Panel({ label, children }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"10px 14px" }}>
      <div style={{ color:"#444", fontSize:9, letterSpacing:3, marginBottom:6, textTransform:"uppercase" }}>{label}</div>
      {children}
    </div>
  );
}
function btnStyle(color="#00f5ff", active=false) {
  return {
    background: active ? `rgba(0,245,255,0.12)` : "transparent",
    border:`1px solid ${active ? color : color+'44'}`,
    color, padding:"7px 14px", borderRadius:4, cursor:"pointer",
    fontFamily:"'Courier New', monospace", fontSize:11, letterSpacing:2,
    transition:"all 0.2s", textShadow: active ? `0 0 8px ${color}` : "none",
  };
}

// ═══════════════════════════════════════════════════════════════
// TETRIS
// ═══════════════════════════════════════════════════════════════
const COLS=10, ROWS=20, BLOCK=28;
const TETROMINOS={ I:{shape:[[1,1,1,1]],color:"#00f5ff"}, O:{shape:[[1,1],[1,1]],color:"#ffe600"}, T:{shape:[[0,1,0],[1,1,1]],color:"#bf00ff"}, S:{shape:[[0,1,1],[1,1,0]],color:"#00ff88"}, Z:{shape:[[1,1,0],[0,1,1]],color:"#ff3366"}, J:{shape:[[1,0,0],[1,1,1]],color:"#0066ff"}, L:{shape:[[0,0,1],[1,1,1]],color:"#ff8800"} };
const TKEYS=Object.keys(TETROMINOS);
function randTetro(){ const k=TKEYS[Math.floor(Math.random()*TKEYS.length)]; return {...TETROMINOS[k],key:k,x:3,y:0}; }
function rotateT(s){ return s[0].map((_,i)=>s.map(r=>r[i]).reverse()); }
function createBoard(){ return Array.from({length:ROWS},()=>Array(COLS).fill(null)); }
function isValidT(board,piece,ox=0,oy=0,shape=null){ const s=shape||piece.shape; for(let r=0;r<s.length;r++) for(let c=0;c<s[r].length;c++){ if(!s[r][c]) continue; const nx=piece.x+c+ox,ny=piece.y+r+oy; if(nx<0||nx>=COLS||ny>=ROWS) return false; if(ny>=0&&board[ny][nx]) return false; } return true; }
function placePiece(board,piece){ const b=board.map(r=>[...r]); piece.shape.forEach((row,r)=>row.forEach((v,c)=>{ if(v&&piece.y+r>=0) b[piece.y+r][piece.x+c]=piece.color; })); return b; }
function clearLines(board){ const cleared=board.filter(row=>row.some(v=>!v)); const n=ROWS-cleared.length; const newRows=Array.from({length:n},()=>Array(COLS).fill(null)); return{board:[...newRows,...cleared],linesCleared:n}; }

function Tetris({ onBack }) {
  const [board,setBoard]=useState(createBoard());
  const [piece,setPiece]=useState(()=>randTetro());
  const [next,setNext]=useState(()=>randTetro());
  const [score,setScore]=useState(0);
  const [lines,setLines]=useState(0);
  const [level,setLevel]=useState(1);
  const [gameOver,setGameOver]=useState(false);
  const [paused,setPaused]=useState(false);
  const [hs,setHs]=useState(()=>parseInt(localStorage.getItem("arc_tetris_hs")||"0"));
  const boardRef=useRef(board),pieceRef=useRef(piece),nextRef=useRef(next),levelRef=useRef(level),hsRef=useRef(hs);
  boardRef.current=board; pieceRef.current=piece; nextRef.current=next; levelRef.current=level; hsRef.current=hs;

  const lockPiece=useCallback((b,p)=>{
    const placed=placePiece(b,p);
    const{board:nb,linesCleared:lc}=clearLines(placed);
    const pts=[0,100,300,500,800][lc]||0;
    const lv=levelRef.current;
    setScore(prev=>{ const ns=prev+pts*lv; if(ns>hsRef.current){setHs(ns);localStorage.setItem("arc_tetris_hs",ns);} return ns; });
    setLines(prev=>{ const nl=prev+lc; setLevel(Math.floor(nl/10)+1); return nl; });
    const np=nextRef.current, nn=randTetro();
    if(!isValidT(nb,np)){setBoard(nb);setGameOver(true);return;}
    setBoard(nb);setPiece(np);setNext(nn);
  },[]);

  useEffect(()=>{ if(gameOver||paused) return; const speed=Math.max(100,500-(level-1)*40); const id=setInterval(()=>{ const b=boardRef.current,p=pieceRef.current; if(isValidT(b,p,0,1)) setPiece(prev=>({...prev,y:prev.y+1})); else lockPiece(b,p); },speed); return()=>clearInterval(id); },[gameOver,paused,level,lockPiece]);

  useEffect(()=>{ const h=e=>{ if(gameOver||paused) return; const b=boardRef.current,p=pieceRef.current; if(e.key==="ArrowLeft"&&isValidT(b,p,-1,0)) setPiece(prev=>({...prev,x:prev.x-1})); else if(e.key==="ArrowRight"&&isValidT(b,p,1,0)) setPiece(prev=>({...prev,x:prev.x+1})); else if(e.key==="ArrowDown"&&isValidT(b,p,0,1)) setPiece(prev=>({...prev,y:prev.y+1})); else if(e.key==="ArrowUp"){const r=rotateT(p.shape);if(isValidT(b,p,0,0,r))setPiece(prev=>({...prev,shape:r}));} else if(e.key===" "){e.preventDefault();let ny=p.y;while(isValidT(b,{...p,y:ny+1},0,0))ny++;lockPiece(b,{...p,y:ny});} }; window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h); },[gameOver,paused,lockPiece]);

  const restart=()=>{setBoard(createBoard());setPiece(randTetro());setNext(randTetro());setScore(0);setLines(0);setLevel(1);setGameOver(false);setPaused(false);};
  const ghost=()=>{ let gy=piece.y; while(isValidT(board,{...piece,y:gy+1},0,0))gy++; return{...piece,y:gy}; };
  const g=ghost(), display=placePiece(board,piece);
  const nc=Array.from({length:4},()=>Array(4).fill(null));
  next.shape.forEach((row,r)=>row.forEach((v,c)=>{if(v)nc[r][c]=next.color;}));

  return(
    <div style={{display:"flex",gap:20,alignItems:"flex-start",justifyContent:"center",padding:16,fontFamily:"'Courier New', monospace"}}>
      <div style={{position:"relative"}}>
        <div style={{display:"grid",gridTemplateColumns:`repeat(${COLS},${BLOCK}px)`,gridTemplateRows:`repeat(${ROWS},${BLOCK}px)`,border:"1px solid rgba(0,245,255,0.3)",boxShadow:"0 0 20px rgba(0,245,255,0.15)"}}>
          {display.map((row,r)=>row.map((color,c)=>{
            const isGhost=!color&&g.shape[r-g.y]?.[c-g.x];
            return(<div key={`${r}-${c}`} style={{width:BLOCK,height:BLOCK,background:color?color:isGhost?"rgba(0,245,255,0.08)":"rgba(255,255,255,0.02)",border:color?"1px solid rgba(255,255,255,0.25)":isGhost?"1px solid rgba(0,245,255,0.2)":"1px solid rgba(255,255,255,0.04)",boxSizing:"border-box",boxShadow:color?`inset 0 0 8px rgba(255,255,255,0.2),0 0 6px ${color}66`:"none"}}/>);
          }))}
          {(gameOver||paused)&&(<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
            <div style={{color:gameOver?"#ff3366":"#00f5ff",fontSize:22,fontWeight:"bold",letterSpacing:4}}>{gameOver?"SYSTEM CRASH":"PAUSED"}</div>
            <button onClick={gameOver?restart:()=>setPaused(false)} style={btnStyle("#00f5ff")}>{gameOver?"RESTART":"RESUME"}</button>
            {!gameOver&&<button onClick={restart} style={btnStyle("#ff3366")}>RESTART</button>}
            <button onClick={onBack} style={btnStyle("#888")}>← MENU</button>
          </div>)}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:16,minWidth:120}}>
        <Panel label="NEXT"><div style={{display:"grid",gridTemplateColumns:"repeat(4,18px)",gridTemplateRows:"repeat(4,18px)"}}>{nc.map((row,r)=>row.map((color,c)=>(<div key={`${r}-${c}`} style={{width:18,height:18,background:color||"transparent",border:color?"1px solid rgba(255,255,255,0.2)":"none",boxShadow:color?`0 0 5px ${color}88`:"none"}}/>)))}</div></Panel>
        <Panel label="SCORE"><span style={{color:"#00f5ff",fontSize:20,fontWeight:"bold"}}>{score}</span></Panel>
        <Panel label="BEST"><span style={{color:"#ffe600",fontSize:16}}>{hs}</span></Panel>
        <Panel label="LINES"><span style={{color:"#00ff88"}}>{lines}</span></Panel>
        <Panel label="LEVEL"><span style={{color:"#bf00ff",fontSize:18,fontWeight:"bold"}}>{level}</span></Panel>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
          <button onClick={()=>setPaused(p=>!p)} style={btnStyle("#00f5ff")} disabled={gameOver}>{paused?"RESUME":"PAUSE"}</button>
          <button onClick={restart} style={btnStyle("#ff3366")}>RESTART</button>
          <button onClick={onBack} style={btnStyle("#888")}>← MENU</button>
        </div>
        <div style={{color:"#444",fontSize:10,lineHeight:1.8}}>← → MOVE<br/>↑ ROTATE<br/>↓ SOFT DROP<br/>SPACE HARD DROP</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SNAKE
// ═══════════════════════════════════════════════════════════════
const SGRID=20,SCELL=22;
function randFood(snake){ let p; do{p={x:Math.floor(Math.random()*SGRID),y:Math.floor(Math.random()*SGRID)};}while(snake.some(s=>s.x===p.x&&s.y===p.y)); return p; }

function Snake({ onBack }) {
  const init=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];
  const [snake,setSnake]=useState(init);
  const [dir,setDir]=useState({x:1,y:0});
  const [food,setFood]=useState(()=>randFood(init));
  const [score,setScore]=useState(0);
  const [gameOver,setGameOver]=useState(false);
  const [paused,setPaused]=useState(false);
  const [hs,setHs]=useState(()=>parseInt(localStorage.getItem("arc_snake_hs")||"0"));
  const [speed,setSpeed]=useState(130);
  const dirRef=useRef(dir),snakeRef=useRef(snake),foodRef=useRef(food),scoreRef=useRef(score),hsRef=useRef(hs);
  dirRef.current=dir;snakeRef.current=snake;foodRef.current=food;scoreRef.current=score;hsRef.current=hs;

  useEffect(()=>{ if(gameOver||paused) return; const id=setInterval(()=>{ const s=snakeRef.current,d=dirRef.current,f=foodRef.current; const head={x:s[0].x+d.x,y:s[0].y+d.y}; if(head.x<0||head.x>=SGRID||head.y<0||head.y>=SGRID||s.some(seg=>seg.x===head.x&&seg.y===head.y)){setGameOver(true);return;} const ate=head.x===f.x&&head.y===f.y; const ns=ate?[head,...s]:[head,...s.slice(0,-1)]; if(ate){const sc=scoreRef.current+10;setScore(sc);if(sc>hsRef.current){setHs(sc);localStorage.setItem("arc_snake_hs",sc);}setFood(randFood(ns));setSpeed(p=>Math.max(60,p-2));} setSnake(ns); },speed); return()=>clearInterval(id); },[gameOver,paused,speed]);

  useEffect(()=>{ const h=e=>{ if(gameOver) return; const map={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},w:{x:0,y:-1},s:{x:0,y:1},a:{x:-1,y:0},d:{x:1,y:0}}; if(map[e.key]){const nd=map[e.key],cur=dirRef.current;if(nd.x!==-cur.x||nd.y!==-cur.y)setDir(nd);if(e.key.startsWith("Arrow"))e.preventDefault();} }; window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h); },[gameOver]);

  const restart=()=>{setSnake(init);setDir({x:1,y:0});setFood(randFood(init));setScore(0);setGameOver(false);setPaused(false);setSpeed(130);};
  const W=SGRID*SCELL;

  return(
    <div style={{display:"flex",gap:20,alignItems:"flex-start",justifyContent:"center",padding:16,fontFamily:"'Courier New', monospace"}}>
      <div style={{position:"relative",width:W,height:W,flexShrink:0,border:"1px solid rgba(0,255,136,0.2)"}}>
        <svg style={{position:"absolute",inset:0}} width={W} height={W}>{Array.from({length:SGRID+1},(_,i)=>(<g key={i}><line x1={i*SCELL} y1={0} x2={i*SCELL} y2={W} stroke="rgba(0,255,136,0.05)" strokeWidth="1"/><line x1={0} y1={i*SCELL} x2={W} y2={i*SCELL} stroke="rgba(0,255,136,0.05)" strokeWidth="1"/></g>))}</svg>
        <div style={{position:"absolute",left:food.x*SCELL+2,top:food.y*SCELL+2,width:SCELL-4,height:SCELL-4,background:"#00ff88",borderRadius:3,boxShadow:"0 0 12px #00ff88"}}/>
        {snake.map((seg,i)=>{ const t=1-i/snake.length,isH=i===0; return(<div key={i} style={{position:"absolute",left:seg.x*SCELL+1,top:seg.y*SCELL+1,width:SCELL-2,height:SCELL-2,background:isH?"#00f5ff":`rgba(0,${Math.round(200*t+55)},${Math.round(200*t)},${0.5+t*0.5})`,borderRadius:isH?5:3,boxShadow:isH?"0 0 10px #00f5ff":"none"}}/>); })}
        {(gameOver||paused)&&(<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
          <div style={{color:gameOver?"#ff3366":"#00f5ff",fontSize:20,fontWeight:"bold",letterSpacing:4}}>{gameOver?"CONNECTION LOST":"PAUSED"}</div>
          <button onClick={gameOver?restart:()=>setPaused(false)} style={btnStyle("#00ff88")}>{gameOver?"RECONNECT":"RESUME"}</button>
          {!gameOver&&<button onClick={restart} style={btnStyle("#ff3366")}>RESTART</button>}
          <button onClick={onBack} style={btnStyle("#888")}>← MENU</button>
        </div>)}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:16,minWidth:120}}>
        <Panel label="SCORE"><span style={{color:"#00ff88",fontSize:20,fontWeight:"bold"}}>{score}</span></Panel>
        <Panel label="BEST"><span style={{color:"#ffe600",fontSize:16}}>{hs}</span></Panel>
        <Panel label="LENGTH"><span style={{color:"#00f5ff"}}>{snake.length}</span></Panel>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
          <button onClick={()=>setPaused(p=>!p)} style={btnStyle("#00ff88")} disabled={gameOver}>{paused?"RESUME":"PAUSE"}</button>
          <button onClick={restart} style={btnStyle("#ff3366")}>RESTART</button>
          <button onClick={onBack} style={btnStyle("#888")}>← MENU</button>
        </div>
        <div style={{color:"#444",fontSize:10,lineHeight:1.8}}>↑↓←→ MOVE<br/>WASD MOVE</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHESS — FIXED
// ═══════════════════════════════════════════════════════════════
const CPIECES={wK:'♔',wQ:'♕',wR:'♖',wB:'♗',wN:'♘',wP:'♙',bK:'♚',bQ:'♛',bR:'♜',bB:'♝',bN:'♞',bP:'♟'};
const INIT_BOARD=[['bR','bN','bB','bQ','bK','bB','bN','bR'],['bP','bP','bP','bP','bP','bP','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],['wP','wP','wP','wP','wP','wP','wP','wP'],['wR','wN','wB','wQ','wK','wB','wN','wR']];
const PVALS={P:100,N:320,B:330,R:500,Q:900,K:20000};

const col=p=>p?p[0]:null;
const tp=p=>p?p[1]:null;
const opp=c=>c==='w'?'b':'w';
const inB=(r,c)=>r>=0&&r<8&&c>=0&&c<8;
function cloneB(b){return b.map(r=>[...r]);}

function getRaw(board,r,c,lm){
  const piece=board[r][c]; if(!piece) return [];
  const cl=col(piece),t=tp(piece),moves=[];
  const slide=(dr,dc)=>{ let nr=r+dr,nc=c+dc; while(inB(nr,nc)){if(!board[nr][nc]){moves.push([nr,nc]);}else{if(col(board[nr][nc])!==cl)moves.push([nr,nc]);break;} nr+=dr;nc+=dc; }};
  const jump=(dr,dc)=>{ const nr=r+dr,nc=c+dc; if(inB(nr,nc)&&col(board[nr][nc])!==cl)moves.push([nr,nc]); };
  if(t==='R')[[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc])=>slide(dr,dc));
  else if(t==='B')[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc])=>slide(dr,dc));
  else if(t==='Q')[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc])=>slide(dr,dc));
  else if(t==='N')[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>jump(dr,dc));
  else if(t==='K'){
    [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,dc])=>jump(dr,dc));
    // Castling
    const homeRow=cl==='w'?7:0;
    if(r===homeRow&&c===4){
      // Kingside
      if(board[homeRow][5]===null&&board[homeRow][6]===null&&board[homeRow][7]===cl+'R'){
        if(!isAttacked(board,homeRow,4,opp(cl))&&!isAttacked(board,homeRow,5,opp(cl))&&!isAttacked(board,homeRow,6,opp(cl)))
          moves.push([homeRow,6]);
      }
      // Queenside
      if(board[homeRow][3]===null&&board[homeRow][2]===null&&board[homeRow][1]===null&&board[homeRow][0]===cl+'R'){
        if(!isAttacked(board,homeRow,4,opp(cl))&&!isAttacked(board,homeRow,3,opp(cl))&&!isAttacked(board,homeRow,2,opp(cl)))
          moves.push([homeRow,2]);
      }
    }
  }
  else if(t==='P'){
    const dir=cl==='w'?-1:1,sr=cl==='w'?6:1;
    if(inB(r+dir,c)&&!board[r+dir][c]){moves.push([r+dir,c]);if(r===sr&&!board[r+2*dir][c])moves.push([r+2*dir,c]);}
    [-1,1].forEach(dc=>{ const nr=r+dir,nc=c+dc; if(inB(nr,nc)&&board[nr][nc]&&col(board[nr][nc])!==cl)moves.push([nr,nc]); if(lm&&inB(nr,nc)){const{from:f,to:tt,piece:lp}=lm;if(tp(lp)==='P'&&Math.abs(f[0]-tt[0])===2&&tt[0]===r&&tt[1]===nc)moves.push([nr,nc]);} });
  }
  return moves;
}

function findKing(board,cl){ for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(board[r][c]===cl+'K') return[r,c]; return null; }

function isAttacked(board,r,c,by){
  for(let fr=0;fr<8;fr++) for(let fc=0;fc<8;fc++)
    if(col(board[fr][fc])===by && getRaw(board,fr,fc,null).some(([mr,mc])=>mr===r&&mc===c)) return true;
  return false;
}

function isCheck(board,cl){ const k=findKing(board,cl); return k?isAttacked(board,k[0],k[1],opp(cl)):false; }

function applyMove(board,from,to,promo='Q'){
  const b=cloneB(board),piece=b[from[0]][from[1]],t=tp(piece),cl=col(piece);
  // En passant capture
  if(t==='P'&&from[1]!==to[1]&&!b[to[0]][to[1]])b[from[0]][to[1]]=null;
  // Castling — move rook too
  if(t==='K'&&Math.abs(to[1]-from[1])===2){
    const row=from[0];
    if(to[1]===6){b[row][5]=b[row][7];b[row][7]=null;} // kingside
    else{b[row][3]=b[row][0];b[row][0]=null;}           // queenside
  }
  b[to[0]][to[1]]=piece;b[from[0]][from[1]]=null;
  // Promotion
  if(t==='P'&&(to[0]===0||to[0]===7))b[to[0]][to[1]]=cl+promo;
  return b;
}

function getLegal(board,r,c,lm){
  const piece=board[r][c]; if(!piece) return [];
  const cl=col(piece);
  return getRaw(board,r,c,lm).filter(([tr,tc])=>!isCheck(applyMove(board,[r,c],[tr,tc]),cl));
}

function getAllLegal(board,cl,lm){
  const moves=[];
  for(let r=0;r<8;r++) for(let c=0;c<8;c++)
    if(col(board[r][c])===cl) getLegal(board,r,c,lm).forEach(to=>moves.push({from:[r,c],to}));
  return moves;
}

function isMate(board,cl,lm){ return isCheck(board,cl)&&getAllLegal(board,cl,lm).length===0; }
function isStale(board,cl,lm){ return !isCheck(board,cl)&&getAllLegal(board,cl,lm).length===0; }

// Piece-square tables for better bot play
const PST={
  P:[[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]],
  N:[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]],
  B:[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],[-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]],
  R:[[0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]],
  Q:[[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],[-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]],
  K:[[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],[20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]]
};

function evalBoard(board,cl){
  let score=0;
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const p=board[r][c]; if(!p) continue;
    const pc=col(p),pt=tp(p);
    const val=PVALS[pt]||0;
    const pstRow=pc==='w'?r:7-r;
    const pst=(PST[pt]?PST[pt][pstRow][c]:0);
    score+=(pc===cl?1:-1)*(val+pst);
  }
  return score;
}

function minimax(board,depth,alpha,beta,isMax,cl,lm){
  if(depth===0) return evalBoard(board,cl);
  const cur=isMax?cl:opp(cl);
  const moves=getAllLegal(board,cur,lm);
  if(moves.length===0) return isCheck(board,cur)?( isMax?-99999:99999):0;
  if(isMax){
    let best=-Infinity;
    for(const{from,to}of moves){
      const nb=applyMove(board,from,to);
      const v=minimax(nb,depth-1,alpha,beta,false,cl,{from,to,piece:board[from[0]][from[1]]});
      best=Math.max(best,v); alpha=Math.max(alpha,v);
      if(beta<=alpha) break;
    }
    return best;
  } else {
    let best=Infinity;
    for(const{from,to}of moves){
      const nb=applyMove(board,from,to);
      const v=minimax(nb,depth-1,alpha,beta,true,cl,{from,to,piece:board[from[0]][from[1]]});
      best=Math.min(best,v); beta=Math.min(beta,v);
      if(beta<=alpha) break;
    }
    return best;
  }
}

function getBotMove(board,cl,diff,lm){
  const moves=getAllLegal(board,cl,lm);
  if(!moves.length) return null;
  if(diff==='easy'){
    const caps=moves.filter(({to})=>board[to[0]][to[1]]);
    return caps.length&&Math.random()>0.5
      ? caps[Math.floor(Math.random()*caps.length)]
      : moves[Math.floor(Math.random()*moves.length)];
  }
  const depth={medium:2,hard:3,extreme:4}[diff]||2;
  const shuffled=[...moves].sort(()=>Math.random()-0.5);
  let best=null,bestVal=-Infinity;
  for(const{from,to}of shuffled){
    const nb=applyMove(board,from,to);
    const v=minimax(nb,depth-1,-Infinity,Infinity,false,cl,{from,to,piece:board[from[0]][from[1]]});
    if(v>bestVal){bestVal=v;best={from,to};}
  }
  return best||moves[0];
}

function ChessBoard({board,selected,legalSquares,lastMove,check,onSquareClick,playerColor}){
  // playerColor='w' -> white at bottom: render rows 0..7 top-to-bottom = black top, white bottom ✓
  // playerColor='b' -> black at bottom: render rows 7..0 top-to-bottom = white top, black bottom ✓
  const flipped=playerColor==='b';
  const displayRows=flipped?[7,6,5,4,3,2,1,0]:[0,1,2,3,4,5,6,7];
  const displayCols=flipped?[7,6,5,4,3,2,1,0]:[0,1,2,3,4,5,6,7];
  const files=['a','b','c','d','e','f','g','h'];
  const ranks=['1','2','3','4','5','6','7','8'];
  return(
    <div style={{display:'inline-block',border:'2px solid rgba(0,245,255,0.3)',boxShadow:'0 0 30px rgba(0,245,255,0.1)'}}>
      {displayRows.map((r,ri)=>(
        <div key={r} style={{display:'flex'}}>
          <div style={{width:18,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'#3a5a3a',fontFamily:'monospace'}}>{ranks[r]}</div>
          {displayCols.map((c,ci)=>{
            const piece=board[r][c];
            const isDark=(r+c)%2===1;
            const isSel=selected&&selected[0]===r&&selected[1]===c;
            const isLeg=legalSquares.some(([lr,lc])=>lr===r&&lc===c);
            const isLF=lastMove&&lastMove.from[0]===r&&lastMove.from[1]===c;
            const isLT=lastMove&&lastMove.to[0]===r&&lastMove.to[1]===c;
            const isCk=check&&piece&&tp(piece)==='K'&&col(piece)===check;
            const isCap=isLeg&&board[r][c];
            let bg=isDark?'#1a2a1a':'#0d1a0d';
            if(isSel)bg='rgba(0,245,255,0.35)';
            else if(isLF||isLT)bg='rgba(255,230,0,0.15)';
            if(isCk)bg='rgba(255,50,50,0.5)';
            return(
              <div key={c} onClick={()=>onSquareClick(r,c)}
                style={{width:46,height:46,background:bg,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',cursor:piece||isLeg?'pointer':'default',border:isSel?'1px solid rgba(0,245,255,0.6)':'1px solid transparent',boxSizing:'border-box'}}>
                {isLeg&&!isCap&&<div style={{position:'absolute',width:12,height:12,borderRadius:'50%',background:'rgba(0,245,255,0.4)',boxShadow:'0 0 8px rgba(0,245,255,0.6)'}}/>}
                {isCap&&<div style={{position:'absolute',inset:2,border:'2px solid rgba(0,245,255,0.5)',borderRadius:2}}/>}
                {piece&&<span style={{fontSize:28,lineHeight:1,userSelect:'none',filter:col(piece)==='w'?'drop-shadow(0 0 4px rgba(0,245,255,0.8))':'drop-shadow(0 0 4px rgba(255,50,100,0.8))',transform:isSel?'scale(1.2)':'scale(1)',zIndex:1}}>{CPIECES[piece]}</span>}
                {ri===displayRows.length-1&&<div style={{position:'absolute',bottom:1,right:2,fontSize:8,color:'#2a4a2a',fontFamily:'monospace'}}>{files[flipped?7-ci:ci]}</div>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Chess Setup
function ChessSetup({ onStart, onBack }) {
  const [mode,setMode]=useState('bot');
  const [diff,setDiff]=useState('medium');
  const [pcol,setPcol]=useState('w');
  const [tl,setTl]=useState(0);
  return(
    <div style={{padding:24,fontFamily:"'Courier New', monospace",color:'#eee',minWidth:400}}>
      <p style={{color:'#00f5ff',fontSize:13,letterSpacing:3,marginBottom:20}}>♟ CHESS.EXE — SETUP</p>

      {/* MODE */}
      <div style={{marginBottom:16}}>
        <p style={{color:'#444',fontSize:9,letterSpacing:3,marginBottom:8}}>MODE</p>
        <div style={{display:'flex',gap:8}}>
          {[['bot','🤖 VS BOT'],['local','👥 VS PLAYER']].map(([m,l])=>(<button key={m} onClick={()=>setMode(m)} style={btnStyle('#00f5ff',mode===m)}>{l}</button>))}
        </div>
      </div>

      {/* BOT OPTIONS */}
      {mode==='bot'&&(<>
        <div style={{marginBottom:16}}>
          <p style={{color:'#444',fontSize:9,letterSpacing:3,marginBottom:8}}>DIFFICULTY</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {[['easy','EASY','#00ff88'],['medium','MEDIUM','#00f5ff'],['hard','HARD','#f59e0b'],['extreme','EXTREME','#ff3366']].map(([d,l,c])=>(
              <button key={d} onClick={()=>setDiff(d)} style={btnStyle(c,diff===d)}>{l}</button>
            ))}
          </div>
        </div>

        {/* CHOOSE SIDE */}
        <div style={{marginBottom:16}}>
          <p style={{color:'#444',fontSize:9,letterSpacing:3,marginBottom:8}}>PLAY AS</p>
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>setPcol('w')} style={{
              ...btnStyle('#00f5ff', pcol==='w'),
              display:'flex',alignItems:'center',gap:8,padding:'10px 20px',
              background: pcol==='w'?'rgba(0,245,255,0.15)':'rgba(255,255,255,0.04)',
            }}>
              <span style={{fontSize:22}}>♔</span>
              <div style={{textAlign:'left'}}>
                <div style={{fontSize:11,fontWeight:'bold'}}>WHITE</div>
                <div style={{fontSize:9,color:'#666',marginTop:2}}>Moves first · Bot plays Black</div>
              </div>
              {pcol==='w'&&<span style={{color:'#00f5ff',marginLeft:4}}>✓</span>}
            </button>
            <button onClick={()=>setPcol('b')} style={{
              ...btnStyle('#bf5fff', pcol==='b'),
              display:'flex',alignItems:'center',gap:8,padding:'10px 20px',
              background: pcol==='b'?'rgba(191,95,255,0.15)':'rgba(255,255,255,0.04)',
            }}>
              <span style={{fontSize:22}}>♚</span>
              <div style={{textAlign:'left'}}>
                <div style={{fontSize:11,fontWeight:'bold'}}>BLACK</div>
                <div style={{fontSize:9,color:'#666',marginTop:2}}>Bot moves first · You play Black</div>
              </div>
              {pcol==='b'&&<span style={{color:'#bf5fff',marginLeft:4}}>✓</span>}
            </button>
          </div>
          <div style={{fontSize:9,color:'#333',marginTop:6,fontFamily:'monospace'}}>
            {pcol==='w'?'▸ Your pieces (♔♕♖♗♘♙) will be at the BOTTOM':'▸ Your pieces (♚♛♜♝♞♟) will be at the BOTTOM'}
          </div>
        </div>
      </>)}

      {/* TIMER */}
      <div style={{marginBottom:20}}>
        <p style={{color:'#444',fontSize:9,letterSpacing:3,marginBottom:8}}>TIMER PER TURN</p>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {[[0,'∞ OFF'],[60,'1 MIN'],[180,'3 MIN'],[300,'5 MIN']].map(([t,l])=>(<button key={t} onClick={()=>setTl(t)} style={btnStyle('#00f5ff',tl===t)}>{l}</button>))}
        </div>
      </div>

      <button onClick={()=>onStart({mode,difficulty:diff,playerColor:mode==='bot'?pcol:'w',timerLimit:tl})}
        style={{...btnStyle('#00f5ff',true),width:'100%',padding:'12px',fontSize:13,letterSpacing:3}}>
        ▶ LAUNCH GAME
      </button>
      <button onClick={onBack} style={{...btnStyle('#888'),width:'100%',padding:'8px',marginTop:8}}>← BACK</button>
    </div>
  );
}

function Chess({ onBack }) {
  const [phase,setPhase]=useState('setup');
  const [config,setConfig]=useState(null);
  const [board,setBoard]=useState(INIT_BOARD.map(r=>[...r]));
  const [turn,setTurn]=useState('w');
  const [selected,setSelected]=useState(null);
  const [legal,setLegal]=useState([]);
  const [lastMove,setLastMove]=useState(null);
  const [status,setStatus]=useState(null); // null | 'checkmate' | 'stalemate' | 'timeout'
  const [winner,setWinner]=useState(null);
  const [promo,setPromo]=useState(null);
  const [capW,setCapW]=useState([]);
  const [capB,setCapB]=useState([]);
  const [history,setHistory]=useState([]);
  const [botBusy,setBotBusy]=useState(false);
  const [check,setCheck]=useState(null);
  const [timer,setTimer]=useState(0);
  const timerRef=useRef(null);
  const botBusyRef=useRef(false);
  botBusyRef.current=botBusy;

  // Check detection
  useEffect(()=>{
    if(isCheck(board,'w')) setCheck('w');
    else if(isCheck(board,'b')) setCheck('b');
    else setCheck(null);
  },[board]);

  const startTimer=useCallback((limit)=>{
    clearInterval(timerRef.current);
    if(!limit){setTimer(0);return;}
    setTimer(limit);
    timerRef.current=setInterval(()=>setTimer(t=>{
      if(t<=1){clearInterval(timerRef.current);return 0;}
      return t-1;
    }),1000);
  },[]);

  // Timer timeout
  useEffect(()=>{
    if(config?.timerLimit&&timer===0&&phase==='game'&&!status){
      setStatus('timeout');
      setWinner(opp(turn));
      clearInterval(timerRef.current);
    }
  },[timer,phase,status,turn,config]);

  const startGame=(cfg)=>{
    setConfig(cfg);setPhase('game');
    setBoard(INIT_BOARD.map(r=>[...r]));
    setTurn('w');setSelected(null);setLegal([]);setLastMove(null);
    setStatus(null);setWinner(null);setPromo(null);
    setCapW([]);setCapB([]);setHistory([]);setBotBusy(false);
    startTimer(cfg.timerLimit);
  };

  const doMove=useCallback((b,from,to,cl,prom)=>{
    const piece=b[from[0]][from[1]];
    const isPP=tp(piece)==='P'&&(to[0]===0||to[0]===7);
    if(isPP&&!prom){setPromo({from,to,cl,board:b});return;}
    const nb=applyMove(b,from,to,prom||'Q');
    const lm={from,to,piece};
    const cap=b[to[0]][to[1]];
    if(cap){if(col(cap)==='w')setCapW(p=>[...p,cap]);else setCapB(p=>[...p,cap]);}
    const files='abcdefgh';const ranks='12345678';
    setHistory(p=>[...p,`${tp(piece)}${files[from[1]]}${ranks[from[0]]}→${files[to[1]]}${ranks[to[0]]}`]);
    const next=opp(cl);
    setBoard(nb);setLastMove(lm);setSelected(null);setLegal([]);
    if(isMate(nb,next,lm)){setStatus('checkmate');setWinner(cl);clearInterval(timerRef.current);}
    else if(isStale(nb,next,lm)){setStatus('stalemate');clearInterval(timerRef.current);}
    else{setTurn(next);if(config?.timerLimit)startTimer(config.timerLimit);}
  },[config,startTimer]);

  // Bot move — fixed: use ref to avoid stale closure, run in timeout
  const boardRef=useRef(board);
  const lastMoveRef=useRef(lastMove);
  const configRef=useRef(config);
  boardRef.current=board;
  lastMoveRef.current=lastMove;
  configRef.current=config;

  useEffect(()=>{
    if(!config||phase!=='game'||status) return;
    if(config.mode!=='bot') return;
    if(turn===config.playerColor) return; // it's player's turn, skip
    if(botBusyRef.current) return;
    setBotBusy(true);
    const delay={easy:400,medium:600,hard:900,extreme:1400}[config.difficulty]||600;
    const t=setTimeout(()=>{
      const b=boardRef.current;
      const lm=lastMoveRef.current;
      const cfg=configRef.current;
      if(!cfg) return;
      const botColor=opp(cfg.playerColor);
      const move=getBotMove(b,botColor,cfg.difficulty,lm);
      if(!move){
        setStatus(isCheck(b,botColor)?'checkmate':'stalemate');
        setWinner(isCheck(b,botColor)?cfg.playerColor:null);
        setBotBusy(false);return;
      }
      doMove(b,move.from,move.to,botColor,null);
      setBotBusy(false);
    },delay);
    return()=>clearTimeout(t);
  },[turn,phase,status,doMove]);

  const handleClick=useCallback((r,c)=>{
    if(status||botBusy) return;
    if(config?.mode==='bot'&&turn!==config.playerColor) return;
    if(selected){
      if(legal.some(([lr,lc])=>lr===r&&lc===c)){doMove(board,selected,[r,c],turn,null);}
      else if(board[r][c]&&col(board[r][c])===turn){setSelected([r,c]);setLegal(getLegal(board,r,c,lastMove));}
      else{setSelected(null);setLegal([]);}
    } else {
      if(board[r][c]&&col(board[r][c])===turn){setSelected([r,c]);setLegal(getLegal(board,r,c,lastMove));}
    }
  },[selected,legal,board,turn,status,botBusy,config,lastMove,doMove]);

  const handlePromo=(p)=>{ const{from,to,cl,board:b}=promo;setPromo(null);doMove(b,from,to,cl,p); };
  const restart=()=>startGame(config);
  const flipped=config?.mode==='bot'&&config?.playerColor==='b';
  const fmt=s=>s===0?'∞':`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  if(phase==='setup') return <ChessSetup onStart={startGame} onBack={onBack}/>;

  return(
    <div style={{display:'flex',gap:12,padding:12,fontFamily:"'Courier New', monospace",alignItems:'flex-start',justifyContent:'center',flexWrap:'wrap'}}>
      <div style={{position:'relative'}}>
        <ChessBoard board={board} selected={selected} legalSquares={legal} lastMove={lastMove} check={check} onSquareClick={handleClick} playerColor={config?.playerColor||'w'}/>
        {promo&&(
          <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
            <div style={{background:'#0d1a0d',border:'1px solid rgba(0,245,255,0.3)',borderRadius:8,padding:20,textAlign:'center'}}>
              <p style={{color:'#00f5ff',fontFamily:'monospace',fontSize:11,letterSpacing:3,marginBottom:12}}>PROMOTE PAWN</p>
              <div style={{display:'flex',gap:8}}>
                {['Q','R','B','N'].map(p=>(<button key={p} onClick={()=>handlePromo(p)} style={{width:46,height:46,background:'rgba(0,245,255,0.05)',border:'1px solid rgba(0,245,255,0.2)',borderRadius:4,cursor:'pointer',fontSize:26}}><span>{CPIECES[promo.cl+p]}</span></button>))}
              </div>
            </div>
          </div>
        )}
        {status&&(
          <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.88)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14}}>
            <div style={{color:'#00f5ff',fontSize:20,fontWeight:'bold',letterSpacing:4}}>{status==='checkmate'?'CHECKMATE':status==='stalemate'?'STALEMATE':'TIME OUT'}</div>
            {winner&&<div style={{color:'#888',fontSize:12,letterSpacing:2}}>{config?.mode==='bot'?(winner===config.playerColor?'YOU WIN':'BOT WINS'):(winner==='w'?'WHITE WINS':'BLACK WINS')}</div>}
            <button onClick={restart} style={btnStyle('#00f5ff')}>PLAY AGAIN</button>
            <button onClick={()=>setPhase('setup')} style={btnStyle('#888')}>← SETUP</button>
            <button onClick={onBack} style={btnStyle('#666')}>← MENU</button>
          </div>
        )}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:10,minWidth:130}}>
        <Panel label="STATUS">
          <div style={{color:botBusy?'#ffe600':check&&!status?'#ff3366':'#00f5ff',fontSize:10,fontWeight:'bold'}}>
            {botBusy?'● BOT THINKING':status?'● GAME OVER':config?.mode==='bot'?(turn===config.playerColor?'● YOUR TURN':'● BOT TURN'):(turn==='w'?'● WHITE TURN':'● BLACK TURN')}
          </div>
          {check&&!status&&<div style={{color:'#ff3366',fontSize:9,marginTop:4}}>⚠ CHECK!</div>}
        </Panel>
        {config?.timerLimit>0&&<Panel label="TIMER"><div style={{color:timer<10?'#ff3366':'#00f5ff',fontSize:18,fontWeight:'bold'}}>{fmt(timer)}</div></Panel>}
        <Panel label="CAPTURED">
          <div style={{fontSize:12,marginBottom:2}}>{capB.map((p,i)=><span key={i}>{CPIECES[p]}</span>)}</div>
          <div style={{fontSize:12}}>{capW.map((p,i)=><span key={i}>{CPIECES[p]}</span>)}</div>
        </Panel>
        <Panel label="MOVES"><div style={{maxHeight:80,overflowY:'auto'}}>{history.slice(-8).map((m,i)=><div key={i} style={{color:'rgba(0,245,255,0.5)',fontSize:9,lineHeight:1.7}}>{m}</div>)}</div></Panel>
        <button onClick={restart} style={{...btnStyle('#00f5ff'),width:'100%'}}>RESTART</button>
        <button onClick={()=>setPhase('setup')} style={{...btnStyle('#888'),width:'100%'}}>SETUP</button>
        <button onClick={onBack} style={{...btnStyle('#666'),width:'100%'}}>← MENU</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN MENU — 3 games
// ═══════════════════════════════════════════════════════════════
function Menu({ onSelect }) {
  const [hovered,setHovered]=useState(null);
  const [bootLines,setBootLines]=useState([]);
  const [bootDone,setBootDone]=useState(false);
  const lines=["ARCADE.EXE v3.1.0","Initializing game engine...","Loading 3 games...","System ready.","","SELECT GAME:"];

  useEffect(()=>{
    let i=0;
    const id=setInterval(()=>{
      if(i<lines.length){setBootLines(p=>[...p,lines[i]]);i++;}
      else{clearInterval(id);setTimeout(()=>setBootDone(true),200);}
    },120);
    return()=>clearInterval(id);
  },[]);

  const games=[
    {id:"tetris",label:"TETRIS.EXE",desc:"Classic block stacking. Clear lines, survive.",color:"#00f5ff",icon:"🟦"},
    {id:"snake", label:"SNAKE.EXE", desc:"Data stream navigation. Eat packets, grow.",  color:"#00ff88",icon:"🟩"},
    {id:"chess", label:"CHESS.EXE", desc:"Strategic warfare. VS bot or local PvP. Castling supported.", color:"#bf00ff",icon:"♟"},
  ];
  const hs={tetris:localStorage.getItem("arc_tetris_hs")||"---",snake:localStorage.getItem("arc_snake_hs")||"---"};

  return(
    <div style={{padding:24,fontFamily:"'Courier New', monospace",display:"flex",flexDirection:"column",gap:20,minWidth:400}}>
      <div style={{background:"rgba(0,0,0,0.5)",border:"1px solid rgba(0,245,255,0.1)",borderRadius:6,padding:"12px 16px",minHeight:80}}>
        {bootLines.map((l,i)=>(
          <div key={i} style={{color:i===0?"#00f5ff":i===bootLines.length-1&&bootDone?"#ffe600":"#00ff8866",fontSize:11,lineHeight:1.7,letterSpacing:1}}>
            {i>0&&i<bootLines.length-1?"> ":""}{l}
          </div>
        ))}
      </div>
      {bootDone&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {games.map(g=>(
            <button key={g.id}
              onMouseEnter={()=>setHovered(g.id)} onMouseLeave={()=>setHovered(null)}
              onClick={()=>onSelect(g.id)}
              style={{background:hovered===g.id?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.02)",border:`1px solid ${hovered===g.id?g.color:"rgba(255,255,255,0.08)"}`,borderRadius:8,padding:"14px 18px",cursor:"pointer",textAlign:"left",transition:"all 0.2s",boxShadow:hovered===g.id?`0 0 20px ${g.color}22`:"none",display:"flex",alignItems:"center",gap:16}}>
              <span style={{fontSize:24,flexShrink:0}}>{g.icon}</span>
              <div style={{flex:1}}>
                <div style={{color:g.color,fontSize:12,fontWeight:"bold",letterSpacing:2,textShadow:hovered===g.id?`0 0 12px ${g.color}`:"none"}}>{g.label}</div>
                <div style={{color:"#555",fontSize:10,marginTop:3}}>{g.desc}</div>
                {(g.id==='tetris'||g.id==='snake')&&<div style={{color:"#333",fontSize:9,marginTop:4}}>BEST: {hs[g.id]}</div>}
              </div>
              {hovered===g.id&&<span style={{color:g.color,fontSize:11,letterSpacing:2}}>LAUNCH →</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT ARCADE APP
// ═══════════════════════════════════════════════════════════════
export default function Arcade({ isMaximized, toggleMax, minimize, close, zIndex, onFocus }) {
  const nodeRef=useRef(null);
  const [game,setGame]=useState(null);
  const isMobile=typeof window!=="undefined"&&window.innerWidth<768;

  return(
    <Draggable nodeRef={nodeRef} handle=".arcade-header" disabled={isMaximized||isMobile} position={isMaximized||isMobile?{x:0,y:0}:undefined}>
      <div ref={nodeRef} onMouseDown={onFocus} onTouchStart={onFocus}
        style={{zIndex,transform:(isMaximized||isMobile)?"none":undefined,background:"linear-gradient(135deg,#080810 0%,#0a0a1a 50%,#080810 100%)",minWidth:isMaximized?undefined:"fit-content"}}
        className={`shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isMaximized?"fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none":"absolute top-4 left-1/2 -translate-x-1/2 rounded-xl border border-white/10"}`}
      >
        <div className="arcade-header select-none cursor-move"
          style={{background:"rgba(0,0,0,0.6)",borderBottom:"1px solid rgba(0,245,255,0.1)",padding:"8px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:14}}>🎮</span>
            <div>
              <p style={{color:"#00f5ff",fontSize:12,fontWeight:"bold",fontFamily:"'Courier New', monospace",letterSpacing:2,margin:0}}>ARCADE.EXE</p>
              <p style={{color:"#444",fontSize:9,fontFamily:"'Courier New', monospace",letterSpacing:1,margin:0}}>{game?game.toUpperCase()+".EXE":"SELECT GAME"}</p>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onPointerDown={e=>e.stopPropagation()} onClick={(e)=>{e.stopPropagation();minimize();}} className="w-10 h-10 md:w-3.5 md:h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:brightness-110 transition"/>
            <button onPointerDown={e=>e.stopPropagation()} onClick={(e)=>{e.stopPropagation();toggleMax();}} className="hidden md:flex w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] hover:brightness-110 transition items-center justify-center text-[6px] font-bold text-black/40">{isMaximized?"❐":"❑"}</button>
            <button onPointerDown={e=>e.stopPropagation()} onClick={(e)=>{e.stopPropagation();close();}} className="w-10 h-10 md:w-3.5 md:h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:brightness-110 transition flex items-center justify-center text-black/40 font-bold text-xs md:text-[8px]">✕</button>
          </div>
        </div>
        <div style={{flex:1,overflow:"auto",color:"#eee"}}>
          {!game&&<Menu onSelect={setGame}/>}
          {game==="tetris"&&<Tetris onBack={()=>setGame(null)}/>}
          {game==="snake"&&<Snake onBack={()=>setGame(null)}/>}
          {game==="chess"&&<Chess onBack={()=>setGame(null)}/>}
        </div>
      </div>
    </Draggable>
  );
}