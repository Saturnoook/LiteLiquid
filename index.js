export default (context) => {
    console.log("[LiteLiquid] v2.0 - Radiant Engine");

    const updateBackground = () => {
        // MÉTODO DE RADIANT LYRICS PARA ENCONTRAR LA PORTADA
        // Intentamos encontrar la imagen de alta calidad donde ellos la buscan
        const img = document.querySelector('figure[class*="_albumImage"] img') || 
                    document.querySelector('[data-test="cover-image"]') ||
                    document.querySelector('img[src*="resources"]');
        
        let src = "";
        if (img) {
            src = img.src || img.currentSrc;
            // Truco de Radiant: Forzar alta resolución si es posible
            if(src) src = src.replace(/\d+x\d+/, "1280x1280"); 
        }

        if(src) {
            document.documentElement.style.setProperty('--lite-bg-img', `url(${src})`);
        }
    };

    // Observador optimizado
    const observer = new MutationObserver((mutations) => {
        updateBackground();
    });

    const init = () => {
        const mainContainer = document.querySelector('[data-test="now-playing-page"]') || document.body;
        // Observamos cambios en el árbol para atrapar cuando cambia la canción
        observer.observe(mainContainer, { childList: true, subtree: true });
        
        // Ejecución inicial y loop de seguridad (polling lento)
        updateBackground();
        setInterval(updateBackground, 1000); 
    };

    init();

    return () => {
        observer.disconnect();
    };
};
