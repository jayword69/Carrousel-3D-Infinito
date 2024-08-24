const carousel = document.getElementById('carousel');
const items = document.querySelectorAll('.carousel-item');
const angleStep = 360 / items.length;
const radius = 550;
let isPaused = false;
let expandedItem = null;

items.forEach((item, index) => {
    const angle = angleStep * index;
    
    item.dataset.originalTransform = `rotateY(${angle}deg) translateZ(${radius}px)`;
    item.style.transform = item.dataset.originalTransform;
    
    item.addEventListener('click', (event) => {
        event.stopPropagation();
        if (isPaused && expandedItem === item) {
            restoreItem(item);
        } else if (!isPaused) {
            expandItem(item);
        }
    });

    item.addEventListener('mouseover', () => {
        if (!isPaused) {
            item.style.opacity = '1';
            item.style.filter = 'brightness(1.2)';
        }
    });

    item.addEventListener('mouseout', () => {
        if (!isPaused) {
            item.style.opacity = '0.8';
            item.style.filter = 'brightness(1)';
        }
    });
});

function expandItem(item) {
    if (expandedItem) {
        restoreItem(expandedItem);
    }
    
    carousel.dataset.pausedRotation = carousel.style.transform;
    
    // Crear un clon de la imagen para expandirla
    const clone = item.cloneNode(true);
    clone.classList.add('expanded');
    clone.style.transition = 'none';
    clone.style.transform = 'translate(-50%, -50%) scale(0.1)';
    clone.style.opacity = '0';
    document.body.appendChild(clone);
    
    // Forzar un reflow
    void clone.offsetWidth;
    
    clone.style.transition = 'all 0.5s ease-in-out';
    clone.style.transform = 'translate(-50%, -50%) scale(1)';
    clone.style.opacity = '1';
    
    carousel.style.animationPlayState = 'paused';
    isPaused = true;
    expandedItem = clone;
    
    // Ocultar el carrusel original
    carousel.style.opacity = '0';
    
    // Añadir evento de clic al clon para colapsarlo
    clone.addEventListener('click', () => restoreItem(clone));
}

function restoreItem(item) {
    item.style.transition = 'all 0.5s ease-in-out';
    item.style.transform = 'translate(-50%, -50%) scale(0.1)';
    item.style.opacity = '0';
    
    setTimeout(() => {
        item.remove();
        carousel.style.opacity = '1';
        carousel.style.transform = carousel.dataset.pausedRotation;
        carousel.style.animationPlayState = 'running';
        isPaused = false;
        expandedItem = null;
        
        items.forEach(otherItem => {
            otherItem.style.opacity = '0.8';
            otherItem.style.pointerEvents = 'auto';
        });
    }, 500);
}

document.addEventListener('click', (event) => {
    if (isPaused && expandedItem && !expandedItem.contains(event.target)) {
        restoreItem(expandedItem);
    }
});

carousel.addEventListener('mouseover', () => {
    if (!isPaused) {
        carousel.style.animationPlayState = 'paused';
    }
});

carousel.addEventListener('mouseleave', () => {
    if (!isPaused) {
        carousel.style.animationPlayState = 'running';
    }
});
