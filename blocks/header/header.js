import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function setupHeaderListeners(block) {
  const menuToggle = block.querySelector('#menu-toggle');
  const menuIcon = block.querySelector('#menu-toggle img');
  const menuContent = block.querySelector('#menu-content');
  const menuItemsList = block.querySelector('#menu-content > ul');

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    menuContent.setAttribute('aria-hidden', String(isExpanded));

    menuIcon.classList.toggle('rotate-90', !isExpanded);

    menuContent.classList.toggle('pointer-events-none', isExpanded);
    menuContent.classList.toggle('hidden', isExpanded);
    menuContent.classList.toggle('md:block', isExpanded);

    menuItemsList.classList.toggle('md:animate-nav-out', isExpanded);
    menuItemsList.classList.toggle('md:animate-nav-in', !isExpanded);
  });
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // prepare the first link
  block.textContent = '';
  const firstLink = fragment.querySelector('div:first-child a');
  const firstLinkText = firstLink?.textContent.trim() || '';
  const firstLinkHref = firstLink?.getAttribute('href') || '#';

  const currentPath = window.location.pathname;

  // prepare all other links and texts, they come from the second div
  const menuLinks = [...fragment.querySelectorAll('div:nth-child(2) ul li a')].map((a) => {
    const linkPath = new URL(a.getAttribute('href'), window.location.origin).pathname;
    return {
      text: a.textContent.trim(),
      href: a.getAttribute('href') || '#',
      active: currentPath.endsWith(linkPath),
    };
  });

  block.classList.add('shadow-md');
  block.innerHTML = `
    <header class="flex gap-5 flex-col md:flex-row items-center justify-between p-4 bg-white container mx-auto">
      <a href="${firstLinkHref}" class="text-lg font-bold" aria-label="${firstLinkText}">${firstLinkText}</a>
      
      <div class="flex flex-col md:flex-row md:items-center gap-4 md:space-x-4 md:ml-auto w-full md:w-auto overflow-hidden"> 
        <button id="menu-toggle" class="px-3 py-2 mr-0 border rounded-lg text-gray-700 border-gray-300 hover:bg-gray-200 cursor-pointer transition-all duration-200 md:order-last inline-flex items-center z-10" aria-expanded="false" aria-controls="menu-content">
            <img src="../../icons/menu.svg" alt="Menu Icon" class="w-4 h-4 mr-2 transition-transform duration-300" />
            <span>Menü</span>
        </button>
        <nav id="menu-content" class="top-full w-full md:w-auto bg-white p-2 hidden pointer-events-none overflow-hidden" aria-hidden="true">
          <ul class="flex flex-col md:flex-row md:space-x-4 transition-transform duration-300">
            ${menuLinks.map((link) => `
            <li>
                <a href="${link.href}" class="block px-4 py-2 md:p-0 hover:text-blue-500 cursor-pointer relative group ${link.active ? 'font-bold' : ''}" aria-label="${link.text}">
                    ${link.text}
                    <span class="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                </a>
            </li>`).join('')}
          </ul>
        </nav>
      </div>
    </header>
  `;

  setupHeaderListeners(block);
}
