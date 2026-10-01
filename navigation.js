document.querySelectorAll('.course-menu').forEach(menu => {
  document.addEventListener('click', event => {
    if (!menu.contains(event.target)) menu.open = false;
  });
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  menu.addEventListener('focusout', event => {
    if (!menu.contains(event.relatedTarget)) menu.open = false;
  });
});
