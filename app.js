document.addEventListener('DOMContentLoaded', () => {
  // --- INTRO PRELOADER ANIMATION ---
  const siteIntro = document.getElementById('site-intro');
  const progressFill = document.getElementById('intro-progress-fill');
  const typewriterEl = document.getElementById('intro-typewriter');
  
  if (siteIntro && progressFill) {
    let progress = 0;
    const intervalTime = 20; // ms
    const duration = 2000; // 2 seconds
    const increment = (100 / duration) * intervalTime;

    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    // --- TYPEWRITER EFFECT ---
    const typewriterWord = 'KANGRO';
    let charIndex = 0;
    let typewriterStarted = false;

    const startTypewriter = () => {
      if (typewriterStarted || !typewriterEl) return;
      typewriterStarted = true;
      const typeInterval = setInterval(() => {
        if (charIndex < typewriterWord.length) {
          typewriterEl.textContent += typewriterWord[charIndex];
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 90);
    };

    const loaderInterval = setInterval(() => {
      progress += increment;

      // Start typewriter when progress hits ~15%
      if (progress >= 15) startTypewriter();

      if (progress >= 100) {
        progress = 100;
        clearInterval(loaderInterval);
        
        setTimeout(() => {
          siteIntro.classList.add('fade-out');
          document.body.style.overflow = '';
          
          setTimeout(() => {
            siteIntro.remove();
          }, 800); // match transition duration
        }, 300);
      }
      progressFill.style.width = `${progress}%`;
    }, intervalTime);
  }

  // --- CAROUSEL FUNCTIONALITY ---
  const track = document.getElementById('carousel-track-container');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');

  if (track && prevBtn && nextBtn) {
    const getScrollAmount = () => {
      const firstCard = track.querySelector('.product-card');
      if (!firstCard) return 300;
      // Get width of card + gap (20px gap in CSS)
      return firstCard.getBoundingClientRect().width + 20;
    };

    prevBtn.addEventListener('click', () => {
      track.scrollBy({
        left: -getScrollAmount(),
        behavior: 'smooth'
      });
    });

    nextBtn.addEventListener('click', () => {
      track.scrollBy({
        left: getScrollAmount(),
        behavior: 'smooth'
      });
    });

    // Check scroll position to disable/enable buttons or styling
    const updateButtonStates = () => {
      const scrollLeft = track.scrollLeft;
      const maxScroll = track.scrollWidth - track.clientWidth;
      
      // We can add classes or opacity for visual feedback
      if (scrollLeft <= 5) {
        prevBtn.style.opacity = '0.5';
      } else {
        prevBtn.style.opacity = '1';
      }

      if (scrollLeft >= maxScroll - 5) {
        nextBtn.style.opacity = '0.5';
      } else {
        nextBtn.style.opacity = '1';
      }
    };

    track.addEventListener('scroll', updateButtonStates);
    window.addEventListener('resize', updateButtonStates);
    // Initial call
    setTimeout(updateButtonStates, 100);
  }

  // --- PRODUCT DATABASE & STATE ---
  const productsDB = {
    'trail-8': { id: 'trail-8', name: 'Kangro Trail 8', category: 'Trail Vest', price: 185, image: 'product_trail_8.png' },
    'race-5': { id: 'race-5', name: 'Kangro Race 5', category: 'Race Vest', price: 155, image: 'product_race_5.png' },
    'hydro-12': { id: 'hydro-12', name: 'Kangro Hydro 12', category: 'Hydration Pack', price: 210, image: 'product_hydro_12.png' },
    'sprint-3': { id: 'sprint-3', name: 'Kangro Sprint 3', category: 'Sprint Vest', price: 129, image: 'product_sprint_3.png' },
    'ultra-15': { id: 'ultra-15', name: 'Kangro Ultra 15', category: 'Hydration Pack', price: 245, image: 'product_ultra_15.png' },
    'speed-belt': { id: 'speed-belt', name: 'Kangro Speed Belt', category: 'Running Belt', price: 59, image: 'product_speed_belt.png' }
  };

  let cart = [];
  let wishlist = [];

  const cartBadge = document.getElementById('cart-badge');
  const wishlistBadge = document.getElementById('wishlist-badge');

  // Drawers Elements
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const cartCloseBtn = document.getElementById('cart-drawer-close');
  const cartToggle = document.getElementById('cart-toggle');
  const cartItemsContainer = document.getElementById('cart-drawer-items');
  const cartEmptyState = document.getElementById('cart-empty-state');
  const cartDrawerFooter = document.getElementById('cart-drawer-footer');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartCountEl = document.getElementById('cart-drawer-count');
  const cartContinueBtn = document.getElementById('cart-continue-shopping');

  const wishlistDrawer = document.getElementById('wishlist-drawer');
  const wishlistOverlay = document.getElementById('wishlist-drawer-overlay');
  const wishlistCloseBtn = document.getElementById('wishlist-drawer-close');
  const wishlistToggle = document.getElementById('wishlist-toggle');
  const wishlistItemsContainer = document.getElementById('wishlist-drawer-items');
  const wishlistEmptyState = document.getElementById('wishlist-empty-state');
  const wishlistCountEl = document.getElementById('wishlist-drawer-count');

  // Shipping Notice Elements
  const shippingNoticeText = document.getElementById('shipping-notice-text');
  const shippingProgressFill = document.getElementById('shipping-progress-fill');

  // Open/Close Drawer Functions
  const openCartDrawer = () => {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
      cartDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeWishlistDrawer();
    }
  };

  const closeCartDrawer = () => {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
      cartDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  const openWishlistDrawer = () => {
    if (wishlistDrawer && wishlistOverlay) {
      wishlistDrawer.classList.add('active');
      wishlistOverlay.classList.add('active');
      wishlistDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeCartDrawer();
    }
  };

  const closeWishlistDrawer = () => {
    if (wishlistDrawer && wishlistOverlay) {
      wishlistDrawer.classList.remove('active');
      wishlistOverlay.classList.remove('active');
      wishlistDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  // Drawers Toggle Listeners
  if (cartToggle) cartToggle.addEventListener('click', openCartDrawer);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);
  if (cartContinueBtn) cartContinueBtn.addEventListener('click', closeCartDrawer);

  if (wishlistToggle) wishlistToggle.addEventListener('click', openWishlistDrawer);
  if (wishlistCloseBtn) wishlistCloseBtn.addEventListener('click', closeWishlistDrawer);
  if (wishlistOverlay) wishlistOverlay.addEventListener('click', closeWishlistDrawer);

  // Close drawers on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeWishlistDrawer();
    }
  });

  // State Rendering Functions
  const renderCart = () => {
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Update Badges
    if (cartBadge) {
      cartBadge.textContent = totalQty;
      cartBadge.style.display = totalQty > 0 ? 'flex' : 'none';
    }
    if (cartCountEl) {
      cartCountEl.textContent = totalQty;
    }

    // Update Shipping Progress
    if (shippingNoticeText && shippingProgressFill) {
      const threshold = 150;
      if (subtotal >= threshold) {
        shippingNoticeText.textContent = "You qualify for FREE shipping!";
        shippingProgressFill.style.width = '100%';
      } else {
        const remaining = threshold - subtotal;
        shippingNoticeText.textContent = `Spend $${remaining.toFixed(2)} more for FREE shipping`;
        shippingProgressFill.style.width = `${(subtotal / threshold) * 100}%`;
      }
    }

    // Update Subtotal
    if (cartSubtotalEl) {
      cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    }

    // Render Items
    if (totalQty === 0) {
      if (cartEmptyState) cartEmptyState.style.display = 'flex';
      if (cartDrawerFooter) cartDrawerFooter.style.display = 'none';
      if (cartItemsContainer) {
        const oldItems = cartItemsContainer.querySelectorAll('.cart-item');
        oldItems.forEach(el => el.remove());
      }
    } else {
      if (cartEmptyState) cartEmptyState.style.display = 'none';
      if (cartDrawerFooter) cartDrawerFooter.style.display = 'block';

      if (cartItemsContainer) {
        const oldItems = cartItemsContainer.querySelectorAll('.cart-item');
        oldItems.forEach(el => el.remove());

        cart.forEach(item => {
          const itemEl = document.createElement('div');
          itemEl.className = 'cart-item';
          itemEl.innerHTML = `
            <div class="drawer-item-img-wrapper">
              <img src="${item.product.image}" alt="${item.product.name}">
            </div>
            <div class="drawer-item-info">
              <span class="drawer-item-category">${item.product.category}</span>
              <span class="drawer-item-name">${item.product.name}</span>
              <span class="drawer-item-price">$${item.product.price}</span>
              <div class="drawer-item-actions">
                <div class="quantity-selector">
                  <button class="qty-btn qty-minus" data-id="${item.product.id}">-</button>
                  <span class="qty-num">${item.quantity}</span>
                  <button class="qty-btn qty-plus" data-id="${item.product.id}">+</button>
                </div>
                <button class="item-remove-btn cart-remove" data-id="${item.product.id}">Remove</button>
              </div>
            </div>
          `;
          cartItemsContainer.appendChild(itemEl);
        });

        // Hook up Quantity change and Remove listeners
        cartItemsContainer.querySelectorAll('.qty-minus').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const cartItem = cart.find(item => item.product.id === id);
            if (cartItem) {
              cartItem.quantity--;
              if (cartItem.quantity <= 0) {
                cart = cart.filter(item => item.product.id !== id);
              }
              renderCart();
            }
          });
        });

        cartItemsContainer.querySelectorAll('.qty-plus').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const cartItem = cart.find(item => item.product.id === id);
            if (cartItem) {
              cartItem.quantity++;
              renderCart();
            }
          });
        });

        cartItemsContainer.querySelectorAll('.cart-remove').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            cart = cart.filter(item => item.product.id !== id);
            renderCart();
          });
        });
      }
    }
  };

  const renderWishlist = () => {
    const totalCount = wishlist.length;

    // Update Badge
    if (wishlistBadge) {
      wishlistBadge.textContent = totalCount;
      wishlistBadge.style.display = totalCount > 0 ? 'flex' : 'none';
    }
    if (wishlistCountEl) {
      wishlistCountEl.textContent = totalCount;
    }

    // Render Items
    if (totalCount === 0) {
      if (wishlistEmptyState) wishlistEmptyState.style.display = 'flex';
      if (wishlistItemsContainer) {
        const oldItems = wishlistItemsContainer.querySelectorAll('.wishlist-item');
        oldItems.forEach(el => el.remove());
      }
    } else {
      if (wishlistEmptyState) wishlistEmptyState.style.display = 'none';

      if (wishlistItemsContainer) {
        const oldItems = wishlistItemsContainer.querySelectorAll('.wishlist-item');
        oldItems.forEach(el => el.remove());

        wishlist.forEach(prod => {
          const itemEl = document.createElement('div');
          itemEl.className = 'wishlist-item';
          itemEl.innerHTML = `
            <div class="drawer-item-img-wrapper">
              <img src="${prod.image}" alt="${prod.name}">
            </div>
            <div class="drawer-item-info">
              <span class="drawer-item-category">${prod.category}</span>
              <span class="drawer-item-name">${prod.name}</span>
              <span class="drawer-item-price">$${prod.price}</span>
              <div class="drawer-item-actions">
                <button class="item-remove-btn wishlist-remove" data-id="${prod.id}">Remove</button>
                <button class="wishlist-to-cart-btn" data-id="${prod.id}">Move to Cart</button>
              </div>
            </div>
          `;
          wishlistItemsContainer.appendChild(itemEl);
        });

        // Hook up Action listeners
        wishlistItemsContainer.querySelectorAll('.wishlist-remove').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            wishlist = wishlist.filter(prod => prod.id !== id);
            
            // Deactivate the active heart button on the grid if it exists
            const heartBtn = document.querySelector(`.product-card[data-id="${id}"] .wishlist-btn`);
            if (heartBtn) heartBtn.classList.remove('active');
            
            renderWishlist();
          });
        });

        wishlistItemsContainer.querySelectorAll('.wishlist-to-cart-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const prod = wishlist.find(p => p.id === id);
            if (prod) {
              // Remove from wishlist
              wishlist = wishlist.filter(p => p.id !== id);
              const heartBtn = document.querySelector(`.product-card[data-id="${id}"] .wishlist-btn`);
              if (heartBtn) heartBtn.classList.remove('active');
              renderWishlist();

              // Add to cart
              const cartItem = cart.find(item => item.product.id === id);
              if (cartItem) {
                cartItem.quantity++;
              } else {
                cart.push({ product: prod, quantity: 1 });
              }
              renderCart();
              openCartDrawer();
            }
          });
        });
      }
    }
  };

  // Add Item Click Event Handlers
  const quickAddBtns = document.querySelectorAll('.quick-add-btn');
  quickAddBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-card');
      if (!card) return;
      const id = card.getAttribute('data-id');
      const prod = productsDB[id];
      if (!prod) return;

      // Add state
      const cartItem = cart.find(item => item.product.id === id);
      if (cartItem) {
        cartItem.quantity++;
      } else {
        cart.push({ product: prod, quantity: 1 });
      }

      renderCart();
      openCartDrawer();

      // Animate badge
      if (cartBadge) {
        cartBadge.style.transform = 'scale(1.4)';
        setTimeout(() => cartBadge.style.transform = 'scale(1)', 300);
      }

      // Temporary button text feedback
      const originalText = btn.textContent;
      btn.textContent = 'ADDED!';
      btn.style.backgroundColor = '#e8ff3c';
      btn.style.color = '#000000';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }, 1000);
    });
  });

  const wishlistBtns = document.querySelectorAll('.wishlist-btn');
  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-card');
      if (!card) return;
      const id = card.getAttribute('data-id');
      const prod = productsDB[id];
      if (!prod) return;

      btn.classList.toggle('active');

      if (btn.classList.contains('active')) {
        // Add to state
        if (!wishlist.some(p => p.id === id)) {
          wishlist.push(prod);
        }
        // Trigger subtle animation on the icon
        const svg = btn.querySelector('svg');
        if (svg) {
          svg.style.transform = 'scale(1.3)';
          setTimeout(() => svg.style.transform = 'scale(1)', 200);
        }
      } else {
        // Remove from state
        wishlist = wishlist.filter(p => p.id !== id);
      }

      renderWishlist();

      // Animate badge
      if (wishlistBadge) {
        wishlistBadge.style.transform = 'scale(1.4)';
        setTimeout(() => wishlistBadge.style.transform = 'scale(1)', 300);
      }
    });
  });

  // Initial Drawers Render Setup
  renderCart();
  renderWishlist();

  // --- SEARCH OVERLAY ---
  const searchToggle = document.getElementById('search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const searchInput = document.getElementById('search-input');

  if (searchToggle && searchOverlay && searchCloseBtn) {
    searchToggle.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // prevent scrolling
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 100);
      }
    });

    const closeSearch = () => {
      searchOverlay.classList.remove('active');
      document.body.style.overflow = '';
      if (searchInput) searchInput.value = '';
    };

    searchCloseBtn.addEventListener('click', closeSearch);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        closeSearch();
      }
    });
  }

  // --- MOBILE MENU DRAWER ---
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('mobile-nav-active');

      // Animate the hamburger icon
      const spans = mobileMenuToggle.querySelectorAll('span');
      if (mobileMenuToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
      }
    });

    // Close drawer when clicking nav links
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('mobile-nav-active');
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
      });
    });
  }

  // --- NAV LINK SMOOTH SCROLLING ---
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active state
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const targetText = link.textContent.trim().toLowerCase();
      let targetSectionId = '';
      
      if (targetText === 'new') targetSectionId = 'editorial';
      else if (targetText === 'vests') targetSectionId = 'best-sellers';
      else if (targetText === 'men') targetSectionId = 'membership';
      else if (targetText === 'women') targetSectionId = 'editorial';
      else if (targetText === 'activities') targetSectionId = 'activities';
      else if (targetText === 'explore') targetSectionId = 'trending';
      
      const targetSection = document.getElementById(targetSectionId);
      if (targetSection) {
        // Scroll with 70px nav offset
        const offsetPosition = targetSection.getBoundingClientRect().top + window.scrollY - 70;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- VIEWPORT ENTRANCE TRANSITIONS ---
  const revealSections = document.querySelectorAll('section');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
  });

  revealSections.forEach(section => {
    section.classList.add('reveal-section');
    revealObserver.observe(section);
  });
});
