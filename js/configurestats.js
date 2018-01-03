function configureStats() {
    threeStats.domElement.removeAttribute('style');
    threeStats.domElement.style.position    = 'absolute';
    threeStats.domElement.style.cursor	    = 'pointer';
    threeStats.domElement.style.right	    = '12px';
    threeStats.domElement.style.bottom		= '12px';
    threeStats.domElement.style.opacity	    = '0.7';
    threeStats.showPanel(0);
    statsContainer.appendChild( threeStats.dom );
}
