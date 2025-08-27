// Loading Screen Animation
document.addEventListener('DOMContentLoaded', function() {
    const hellos = document.querySelectorAll('.hello');
    const dock = document.querySelector('.dock-container');
    let index = 0;

    // Initially hide the dock
    dock.style.opacity = '0';
    dock.style.transform = 'translate(-50%, 100%)';
    dock.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

    function showNextHello() {
        if (index > 0) {
            hellos[index - 1].style.opacity = '0';
        }
        if (index < hellos.length) {
            hellos[index].style.opacity = '1';
            index++;
            setTimeout(showNextHello, 400);
        } else {
            setTimeout(hideLoadingScreen, 300);
        }
    }

    function hideLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // Show home section by default
            document.getElementById('home').classList.add('active');
            // Show dock with animation
            showDock();
        }, 500);
    }
    showNextHello();

    function showDock() {
        // Small delay before showing dock
        setTimeout(() => {
            dock.style.opacity = '1';
            dock.style.transform = 'translate(-50%, 0)';
        }, 100);
    }


});