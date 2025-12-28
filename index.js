export default (context) => {
    console.log("[LiteLiquid] Iniciado.");
    
    // Inyectar estructura de capas
    const createLayers = () => {
        if (!document.getElementById('lite-bg-container')) {
            const c = document.createElement('div');
            c.id = 'lite-bg-container'; c.className = 'lite-bg-container';
            c.innerHTML = `<div class="lite-bg-black"></div><div class="lite-bg-image"></div><div class="lite-bg-gradient"></div>`;
            document.body.appendChild(c);
        }
    };
    
    // Buscar portada (usando selectores de Radiant Lyrics)
    const updateBg = () => {
        const img = document.querySelector('figure[class*="_albumImage"] img') || 
                    document.querySelector('[data-test="cover-image"]');
        if (img && img.src) {
            const src = img.src.replace(/\d+x\d+/, "1280x1280");
            const el = document.querySelector('.lite-bg-image');
            if (el) el.style.backgroundImage = `url(${src})`;
        }
    };
    
    const obs = new MutationObserver(updateBg);
    const init = () => {
        createLayers();
        const container = document.querySelector('[data-test="now-playing-page"]') || document.body;
        obs.observe(container, { childList: true, subtree: true });
        updateBg(); setInterval(updateBg, 2000);
    };
    init();
    return () => { obs.disconnect(); document.getElementById('lite-bg-container')?.remove(); };
};
