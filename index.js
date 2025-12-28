export default (context) => {
    const OBSERVER_CONFIG = { attributes: true, subtree: true, attributeFilter: ['class', 'data-active', 'style'] };
    
    // Selectores para Tidal Beta
    const LYRICS_CONTAINER_SELECTOR = '[class*="_lyricsColumn"]'; 
    
    let lyricsObserver = null;

    // Esta función solo corre cuando la letra cambia (Eficiencia Máxima)
    const handleMutations = (mutationsList) => {
        for (const mutation of mutationsList) {
            const target = mutation.target;
            if (!target || !target.classList) return;

            // Detectar si Tidal dice que esta línea es la activa
            // Buscamos: Clase 'active', atributo data-active, o color blanco
            const isActive = 
                target.classList.toString().toLowerCase().includes('active') || 
                target.getAttribute('data-active') === 'true' ||
                target.getAttribute('aria-current') === 'true' ||
                (target.style && (target.style.color === 'white' || target.style.color === 'rgb(255, 255, 255)'));

            if (isActive) {
                // Borrar brillo anterior
                document.querySelectorAll('.lite-glow').forEach(el => el.classList.remove('lite-glow'));
                // Poner brillo nuevo
                target.classList.add('lite-glow');
            }
        }
    };

    const init = () => {
        const lyricsContainer = document.querySelector(LYRICS_CONTAINER_SELECTOR);
        if (!lyricsContainer) {
            setTimeout(init, 1000); // Reintentar si aún no carga
            return;
        }

        console.log("[LiteLiquid] Optimización de GPU activada.");
        
        // Inyectar fondo estático para evitar repintado
        updateBackground();

        // Iniciar el vigilante
        lyricsObserver = new MutationObserver(handleMutations);
        lyricsObserver.observe(lyricsContainer, OBSERVER_CONFIG);
    };
    
    const updateBackground = () => {
        // Buscar la portada en alta calidad
        const img = document.querySelector('[data-test="cover-image"]') || document.querySelector('img[src*="resources"]');
        if(img) {
            document.documentElement.style.setProperty('--lite-bg-img', `url(${img.src})`);
        }
        setTimeout(updateBackground, 3000); // Revisar cada 3s por si cambia la canción
    };

    init(); // Arrancar

    return () => {
        if (lyricsObserver) lyricsObserver.disconnect();
    };
};
