/* === FINAL FIX V5: pindahkan hamburger ke card outlet, sebelah tombol edit === */
(function(){
  function moveKsMenuToOutlet(){
    try{
      const menuBtn = document.querySelector('.ks-menu-btn');
      const outlet = document.querySelector('.ks-outlet');
      if(!menuBtn || !outlet) return;

      let editBtn =
        outlet.querySelector('.ks-edit-btn') ||
        outlet.querySelector('.ks-outlet-edit') ||
        outlet.querySelector('button[onclick*="openOutlet"]') ||
        outlet.querySelector('button[onclick*="Setting"]') ||
        outlet.querySelector('button[onclick*="setting"]') ||
        outlet.querySelector('button:last-of-type');

      let actions = outlet.querySelector('.ks-outlet-actions');
      if(!actions){
        actions = document.createElement('div');
        actions.className = 'ks-outlet-actions';
        if(editBtn){
          outlet.insertBefore(actions, editBtn);
          actions.appendChild(menuBtn);
          actions.appendChild(editBtn);
        }else{
          outlet.appendChild(actions);
          actions.appendChild(menuBtn);
        }
      }else if(!actions.contains(menuBtn)){
        actions.insertBefore(menuBtn, actions.firstChild);
      }
    }catch(e){}
  }

  document.addEventListener('DOMContentLoaded', moveKsMenuToOutlet);
  setTimeout(moveKsMenuToOutlet, 80);
  setTimeout(moveKsMenuToOutlet, 350);
  setTimeout(moveKsMenuToOutlet, 1000);

  const oldGo = window.go;
  if(typeof oldGo === 'function'){
    window.go = function(){
      const r = oldGo.apply(this, arguments);
      setTimeout(moveKsMenuToOutlet, 80);
      return r;
    };
  }

  const oldRenderHome = window.renderHome;
  if(typeof oldRenderHome === 'function'){
    window.renderHome = function(){
      const r = oldRenderHome.apply(this, arguments);
      setTimeout(moveKsMenuToOutlet, 80);
      return r;
    };
  }
})();

/* === PULL TO REFRESH FEATURE === */
(function initPullToRefresh() {
  let ptrStart = 0;
  let ptrDist = 0;
  let ptrContainer = null;
  let isDragging = false;
  
  function getPtrElement() {
    if (!ptrContainer) {
      ptrContainer = document.createElement('div');
      ptrContainer.id = 'ptrSpinner';
      ptrContainer.innerHTML = '<i class="fas fa-rotate"></i>';
      Object.assign(ptrContainer.style, {
        position: 'fixed',
        top: '-50px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--surface, #ffffff)',
        color: 'var(--primary, #10b981)',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '999999', // super high
        transition: 'top 0.2s',
        fontSize: '20px'
      });
      document.body.appendChild(ptrContainer);
    }
    return ptrContainer;
  }

  document.addEventListener('touchstart', (e) => {
    // Only active at the very top of the page
    if (window.scrollY > 10) return;
    ptrStart = e.touches[0].clientY;
    isDragging = true;
    ptrDist = 0;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging || window.scrollY > 10) {
      isDragging = false;
      return;
    }
    let y = e.touches[0].clientY;
    if (y > ptrStart) {
      ptrDist = (y - ptrStart) * 0.6; // less resistance so it shows up faster
      if (ptrDist > 90) ptrDist = 90;
      
      const el = getPtrElement();
      el.style.transition = 'none';
      el.style.top = (ptrDist - 40) + 'px'; // -40 start, so 50px pull makes it visible (10)
      el.style.transform = `translateX(-50%) rotate(${ptrDist * 4}deg)`;
    } else {
      isDragging = false;
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const el = getPtrElement();
    el.style.transition = 'top 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.3s';
    
    if (ptrDist > 60) {
      el.style.top = '30px'; // stay on screen while loading
      el.querySelector('i').classList.add('fa-spin');
      
      if (typeof window.refreshFromHeader === 'function') {
        window.refreshFromHeader().finally(() => {
          setTimeout(() => {
            el.style.top = '-50px';
            el.querySelector('i').classList.remove('fa-spin');
          }, 300);
        });
      } else {
        setTimeout(() => {
          el.style.top = '-50px';
          el.querySelector('i').classList.remove('fa-spin');
        }, 1000);
      }
    } else {
      el.style.top = '-50px';
    }
  });
})();
