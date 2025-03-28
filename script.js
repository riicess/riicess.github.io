document.addEventListener('DOMContentLoaded', () => {
    // Get radio buttons for tab navigation
    const projectsRadio = document.getElementById('radio-3');
    const homeRadio = document.getElementById('radio-1');
    const aboutRadio = document.getElementById('radio-2');
    const skillsRadio = document.getElementById('radio-4');

    // Apply proper arrow styles to all arrows initially
    applyArrowStyles();

    // Set up arrow navigation
    const arrows = document.querySelectorAll('.arrow-down, .arrow-left, .arrow-right, .arrow-up');
    
    // Add click event to all arrows
    arrows.forEach(arrow => {
        arrow.addEventListener('click', (e) => {
            // Stop propagation to prevent card flipping when arrow is clicked
            e.stopPropagation();
            
            // Get target section and index from data attributes
            const targetSection = arrow.getAttribute('data-card-target');
            const targetIndex = parseInt(arrow.getAttribute('data-card-index'));
            
            // Handle section switching
            if ((targetSection === 'home' && targetIndex === 3) || 
                (targetSection === 'home' && arrow.classList.contains('arrow-right'))) {
                window.location.href = '/projects';
                return;
            } else if ((targetSection === 'about' && targetIndex === 3) || 
                       (targetSection === 'about' && arrow.classList.contains('arrow-right'))) {
                window.location.href = '/skills';
                return;
            } else if (targetSection === 'projects' && arrow.classList.contains('arrow-right')) {
                window.location.href = '/home';
                return;
            } else if (targetSection === 'skills' && arrow.classList.contains('arrow-left')) {
                window.location.href = '/about';
                return;
            }

            // Get all cards in the section
            const sectionCards = document.querySelectorAll(`#${targetSection}-content .card`);
            
            // Add exit animation to current active card
            sectionCards.forEach(card => {
                if (card.classList.contains('card-active')) {
                    card.classList.add('card-exit');
                    
                    // Remove the exit and active classes after animation completes
                    setTimeout(() => {
                        card.classList.remove('card-active');
                        card.classList.remove('card-exit');
                    }, 300);
                }
            });
            
            // Direction-specific animations for the target card
            let entranceClass = '';
            if (arrow.classList.contains('arrow-left')) {
                entranceClass = 'card-enter-from-right';
            } else if (arrow.classList.contains('arrow-right')) {
                entranceClass = 'card-enter-from-left';
            } else {
                entranceClass = 'card-enter-from-bottom';
            }
            
            // Add entrance animation to target card after a slight delay
            setTimeout(() => {
                // Add entrance class based on arrow direction
                sectionCards[targetIndex].classList.add(entranceClass);
                
                // Add active class to target card
                sectionCards[targetIndex].classList.add('card-active');
                
                // Remove entrance class after animation completes
                setTimeout(() => {
                    sectionCards[targetIndex].classList.remove(entranceClass);
                }, 300);
                
                // Update arrow direction based on which card is active
                updateArrows(targetSection, targetIndex);
                
                // Show delayed arrows if needed
                showDelayedArrow(targetSection, targetIndex);

                // Reset any flipped cards
                const cardInners = document.querySelectorAll('.card-inner');
                cardInners.forEach(inner => {
                    inner.style.transform = 'rotateY(0deg)';
                });

                // Reapply arrow styles after card change
                applyArrowStyles();
            }, 300);

            // Update arrow visibility based on section
            if (targetSection === 'about') {
                document.querySelector(`#${targetSection}-content .arrow-right`).style.display = 'none';
            } else if (targetSection === 'skills') {
                document.querySelector(`#${targetSection}-content .arrow-left`).style.display = 'none';
            }
        });
    });
    
    // Remove duplicate arrow event listeners
    const arrowClickHandler = (e) => {
        e.stopPropagation();
        const arrow = e.currentTarget;
        const targetSection = arrow.getAttribute('data-card-target');
        const targetIndex = parseInt(arrow.getAttribute('data-card-index'));
        
        const sectionCards = document.querySelectorAll(`#${targetSection}-content .card`);
        
        // Single animation sequence
        sectionCards.forEach(card => {
            if (card.classList.contains('card-active')) {
                card.classList.add('card-exit');
                card.classList.remove('card-active');
            }
        });

        setTimeout(() => {
            sectionCards.forEach(card => card.classList.remove('card-exit'));
            sectionCards[targetIndex].classList.add('card-active');
        }, 300);

        updateArrows(targetSection, targetIndex);
    };

    // Clean up and reattach arrow event listeners
    arrows.forEach(arrow => {
        const newArrow = arrow.cloneNode(true);
        arrow.parentNode.replaceChild(newArrow, arrow);
        newArrow.addEventListener('click', arrowClickHandler, { once: false });
    });

    // Fix for hover-related issues - Update to handle expand animation
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Remove any existing transitions
            card.style.transition = 'all 0.3s ease';
            card.classList.add('expanded');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('expanded');
        });
    });

    // Remove the old flip card event listeners
    const oldFlipCards = document.querySelectorAll('.flip-card-inner');
    oldFlipCards.forEach(card => {
        card.style.transform = 'none';
    });

    // Remove flip card related event listeners
    document.querySelectorAll('.expandable-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });

    // Add click handlers for expandable cards
    document.querySelectorAll('.expandable-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.title').textContent;
            const parentCard = card.closest('.fancy-card');
            const parentSection = parentCard.closest('.page-content').id;
            
            // Handle redirects based on section and card title
            if (title === 'Programming Languages') {
                window.location.href = '/skills';
                return;
            } else if (title === 'Tools') {
                window.location.href = '/tools';
                return;
            } else if (parentSection === 'projects-content' || title === 'Projects') {
                window.location.href = '/projects';
                return;
            }
        });
    });

    // Function to apply consistent styling to all arrows
    function applyArrowStyles() {
        // Select all arrows
        const allArrows = document.querySelectorAll('.arrow-down, .arrow-left, .arrow-right, .arrow-up');
        
        allArrows.forEach(arrow => {
            // First remove any position-specific inline styles that might interfere
            arrow.style.position = '';
            arrow.style.bottom = '';
            arrow.style.left = '';
            arrow.style.right = '';
            arrow.style.top = '';
            arrow.style.transform = '';
            
            // Make sure each arrow has the right icon
            const iconElement = arrow.querySelector('i');
            if (iconElement) {
                if (arrow.classList.contains('arrow-down')) {
                    iconElement.className = 'fas fa-chevron-down';
                } else if (arrow.classList.contains('arrow-up')) {
                    iconElement.className = 'fas fa-chevron-up';
                } else if (arrow.classList.contains('arrow-left')) {
                    iconElement.className = 'fas fa-chevron-left';
                } else if (arrow.classList.contains('arrow-right')) {
                    iconElement.className = 'fas fa-chevron-right';
                }
            }
        });
    }
    
    // Function to update arrow directions based on active card
    function updateArrows(section, activeIndex) {
        const sectionArrows = document.querySelectorAll(`#${section}-content .arrow-down, #${section}-content .arrow-left, #${section}-content .arrow-right, #${section}-content .arrow-up`);
        const maxIndex = document.querySelectorAll(`#${section}-content .card`).length - 1;
        
        // Reset all arrows - keep their original classes
        sectionArrows.forEach(arrow => {
            // Determine and maintain original direction class
            let originalDirection = '';
            if (arrow.classList.contains('arrow-down')) originalDirection = 'down';
            else if (arrow.classList.contains('arrow-up')) originalDirection = 'up';
            else if (arrow.classList.contains('arrow-left')) originalDirection = 'left';
            else if (arrow.classList.contains('arrow-right')) originalDirection = 'right';
            
            // Reset to original direction
            arrow.className = `arrow-${originalDirection}`;
            
            // Reset delayed-arrow class if it had one
            if (originalDirection === 'left' || originalDirection === 'right') {
                if (arrow.hasAttribute('data-delayed')) {
                    arrow.classList.add('delayed-arrow');
                }
            }
            
            // Set proper icon
            let iconClass = 'fas fa-chevron-';
            switch(originalDirection) {
                case 'down': iconClass += 'down'; break;
                case 'up': iconClass += 'up'; break;
                case 'left': iconClass += 'left'; break;
                case 'right': iconClass += 'right'; break;
            }
            
            // Update icon
            const iconElement = arrow.querySelector('i');
            if (iconElement) {
                iconElement.className = iconClass;
            }
        });
        
        // If we're at the last card, update arrow direction
        if (activeIndex === maxIndex) {
            const arrow = document.querySelector(`#${section}-content .card.card-active .arrow-down, 
                                                 #${section}-content .card.card-active .arrow-left,
                                                 #${section}-content .card.card-active .arrow-right`);
            if (arrow) {
                if (arrow.classList.contains('arrow-down')) {
                    arrow.classList.remove('arrow-down');
                    arrow.classList.add('arrow-up');
                    arrow.setAttribute('data-card-index', '0');
                    
                    const iconElement = arrow.querySelector('i');
                    if (iconElement) {
                        iconElement.className = 'fas fa-chevron-up';
                    }
                } else if (arrow.classList.contains('arrow-left')) {
                    arrow.classList.remove('arrow-left');
                    arrow.classList.add('arrow-right');
                    arrow.setAttribute('data-card-index', '0');
                    
                    const iconElement = arrow.querySelector('i');
                    if (iconElement) {
                        iconElement.className = 'fas fa-chevron-right';
                    }
                } else if (arrow.classList.contains('arrow-right')) {
                    arrow.classList.remove('arrow-right');
                    arrow.classList.add('arrow-left');
                    arrow.setAttribute('data-card-index', '0');
                    
                    const iconElement = arrow.querySelector('i');
                    if (iconElement) {
                        iconElement.className = 'fas fa-chevron-left';
                    }
                }
            }
        }
        
        // Reapply arrow styles after updating directions
        applyArrowStyles();
    }
    
    // Function to show delayed arrow
    function showDelayedArrow(targetSection, targetIndex) {
        const delayedArrow = document.querySelector(`#${targetSection}-content .delayed-arrow`);
        if (delayedArrow) {
            if (targetIndex === 2) {
                delayedArrow.classList.add('visible');
                delayedArrow.style.opacity = '1';
                delayedArrow.style.transform = 'translateY(0)';
            } else {
                delayedArrow.classList.remove('visible');
                delayedArrow.style.opacity = '0';
                delayedArrow.style.transform = 'translateY(20px)';
            }
        }
    }

    // Handle tab switching
    projectsRadio.addEventListener('change', () => {
        resetCardsToFirst('projects');
    });
    
    homeRadio.addEventListener('change', () => {
        resetCardsToFirst('home');
    });
    
    aboutRadio.addEventListener('change', () => {
        resetCardsToFirst('about');
    });
    
    skillsRadio.addEventListener('change', () => {
        resetCardsToFirst('skills');
    });
    
    // Function to reset cards to first card
    function resetCardsToFirst(section) {
        const sectionCards = document.querySelectorAll(`#${section}-content .card`);
        
        // Remove active class from all cards
        sectionCards.forEach(card => {
            card.classList.remove('card-active', 'card-exit', 'card-enter-from-left', 'card-enter-from-right', 'card-enter-from-bottom');
        });
        
        // Add active class to first card
        sectionCards[0].classList.add('card-active');
        
        // Update arrows
        updateArrows(section, 0);
        
        // Reset any flipped cards
        const cardInners = document.querySelectorAll('.card-inner');
        cardInners.forEach(inner => {
            inner.style.transform = 'rotateY(0deg)';
        });
        
        // Reset any delayed arrows
        const delayedArrows = document.querySelectorAll('.delayed-arrow');
        delayedArrows.forEach(arrow => {
            arrow.style.opacity = '0';
            arrow.style.transform = 'translateY(20px)';
        });
        
        // Reset any expanded cards
        const flipCards = document.querySelectorAll('.flip-card');
        flipCards.forEach(card => {
            card.classList.remove('expanded');
        });

        // Reset expanded cards
        const expandableCards = document.querySelectorAll('.expandable-card');
        expandableCards.forEach(card => {
            card.style.transform = 'scale(1)';
        });
        
        // Reapply arrow styles
        applyArrowStyles();
    }
    
    // Prevent arrow click events from triggering card flips
    const cardInnerArrows = document.querySelectorAll('.card-inner .arrow-down, .card-inner .arrow-left, .card-inner .arrow-right');
    cardInnerArrows.forEach(arrow => {
        arrow.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
    
    // Initial application of arrow styles
    applyArrowStyles();
    
    // Debug - log to console
    console.log("Enhanced script loaded with fixed card flip animations and consistent arrow styles");
});