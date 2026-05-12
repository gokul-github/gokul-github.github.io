$(document).ready(function(){
  
  init_document_ready();

});

// - - - - - - - - - - - - - - - - - - - - - - - - - 
/* - - - - - - - - - - - - - - - - - - - - - - - - -
 * Anything that should be run as soon as DOM is 
 * loaded.
 * - - - - - - - - - - - - - - - - - - - - - - - - -
 */
 
function init_document_ready() {

  init_theme_toggle();
  create_colorSwatch();
  init_profile_reveals();

}

// - - - - - - - - - - - - - - - - - - - - - - - - -
// for each li.color, grab the hex color value in the item and set is at the background-color 

function create_colorSwatch() {

  $( "li.color" ).each(function() {
    
    var color = $( this ).text();
    $( this ).css( "background-color" , color );
    
    //if the single swatch color is too dark, use a lighter font color to display the hex color value
    
    var c = color.substring(1);      // strip #
    var rgb = parseInt(c, 16);   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff;  // extract red
    var g = (rgb >>  8) & 0xff;  // extract green
    var b = (rgb >>  0) & 0xff;  // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    if (luma < 85) {
      $( this ).css( "color" , "#f0f0f0" );
    }
    
  });

}

// - - - - - - - - - - - - - - - - - - - - - - - - -

function init_theme_toggle() {

  var toggle = document.querySelector(".theme-toggle");

  if (!toggle) {
    return;
  }

  var storageKey = "gokul-profile-theme";
  var savedTheme = null;

  try {
    savedTheme = window.localStorage.getItem(storageKey);
  } catch (error) {
    savedTheme = null;
  }

  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var activeTheme = savedTheme || (prefersDark ? "dark" : "light");

  function applyTheme(theme) {
    var isDark = theme === "dark";
    document.documentElement.setAttribute("data-theme", theme);
    toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    toggle.querySelector(".theme-toggle-text").textContent = isDark ? "Light" : "Dark";
  }

  applyTheme(activeTheme);

  toggle.addEventListener("click", function() {
    activeTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(activeTheme);

    try {
      window.localStorage.setItem(storageKey, activeTheme);
    } catch (error) {
      return;
    }
  });

}

// - - - - - - - - - - - - - - - - - - - - - - - - -

function init_profile_reveals() {

  var revealTargets = document.querySelectorAll(
    ".hero-copy, .hero-panel, .signal-strip, .tech-stack-strip, .section-band, .delivery-map, .expertise-grid, .skills-section, .compact-band, .contact-cta, .contact-card"
  );

  if (!revealTargets.length) {
    return;
  }

  document.body.classList.add("reveal-ready");

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach(function(target) {
      target.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.15
  });

  revealTargets.forEach(function(target) {
    observer.observe(target);
  });

}

// - - - - - - - - - - - - - - - - - - - - - - - - -


