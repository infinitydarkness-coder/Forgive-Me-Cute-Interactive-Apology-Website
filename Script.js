
  // elements
  const pages = {
    page1: document.getElementById('page1'),
    page2: document.getElementById('page2'),
    page3: document.getElementById('page3'),
    success: document.getElementById('successPage')
  };

  function show(id){
    Object.values(pages).forEach(el => el.classList.remove('active'));
    if(pages[id]) pages[id].classList.add('active');
  }

  // heart logic
  let heartsInterval = null;
  function createHeartOnce(){
    const h = document.createElement('div');
    h.className = 'heart';
    h.textContent = ['💖','💗','💕','💘'][Math.floor(Math.random()*4)];
    const size = 18 + Math.floor(Math.random()*36);
    h.style.fontSize = size + 'px';
    h.style.left = Math.random()*(window.innerWidth - size) + 'px';
    document.body.appendChild(h);
    // remove after animation
    setTimeout(()=> h.remove(), 3800);
  }
  function startHearts(){
    if(heartsInterval) return; // already running
    // spawn a few right away for immediate effect
    for(let i=0;i<6;i++) setTimeout(createHeartOnce, i*120);
    heartsInterval = setInterval(createHeartOnce, 260);
  }

  // attach page flows
  function wirePage(pageEl, nextPageId){
    const yes = pageEl.querySelector('.btn.yes');
    const no = pageEl.querySelector('.btn.no');

    yes.addEventListener('click', () => {
      show('success');
      // start continuous hearts
      startHearts();
    });

    if(nextPageId){
      no.addEventListener('click', () => show(nextPageId));
    }
  }

  wirePage(pages.page1, 'page2');
  wirePage(pages.page2, 'page3');
  // page3 yes wired by wirePage (nextPageId = undefined)
  wirePage(pages.page3, null);

  // Page 3 runaway "No" button behavior (mouse + touch friendly)
  const runBtn = document.getElementById('runBtn');
  function moveRunBtn(e){
    // keep within visible viewport margin
    const margin = 80;
    const w = Math.max(window.innerWidth - margin, 120);
    const h = Math.max(window.innerHeight - margin, 80);
    const x = Math.random() * w + 20;
    const y = Math.random() * h + 20;
    // switch to fixed so it moves relative to viewport
    runBtn.style.position = 'fixed';
    runBtn.style.left = x + 'px';
    runBtn.style.top = y + 'px';
  }
  // move on hover, pointer, or touchstart
  runBtn.addEventListener('pointerenter', moveRunBtn);
  runBtn.addEventListener('mouseover', moveRunBtn);
  runBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveRunBtn(); }, {passive:false});
  // also nudge it if user manages to click — keep it playful
  runBtn.addEventListener('click', (e) => { e.preventDefault(); moveRunBtn(); });

  // small nicety: clicking anywhere outside button on success page also spawns a handful of hearts
  pages.success.addEventListener('click', () => {
    for(let i=0;i<6;i++) setTimeout(createHeartOnce, i*80);
  });

  // ensure keyboard accessibility: Enter on any Yes triggers same behavior
  document.querySelectorAll('.btn.yes').forEach(b => b.addEventListener('keyup', (ev)=> {
    if(ev.key === 'Enter' || ev.key === ' ') b.click();
  }));
