import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function setupHeaderListeners(block) {
  const menuToggle = block.querySelector('#menu-toggle');
  const menuContent = block.querySelector('#menu-content');

  // Ensure menu is hidden initially
  menuContent.style.display = 'none';

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

    menuContent.style.display = isExpanded ? 'none' : 'block';

    // Update ARIA attributes
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    menuContent.setAttribute('aria-hidden', String(isExpanded));
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

  // decorate nav DOM
  block.textContent = '';
  const firstLink = fragment.querySelector('div:first-child a');
  const firstLinkText = firstLink?.textContent.trim() || '';
  const firstLinkHref = firstLink?.getAttribute('href') || '#';

  // Extract all links and texts from the second div
  const menuLinks = [...fragment.querySelectorAll('div:nth-child(2) ul li a')].map((a) => ({
    text: a.textContent.trim(),
    href: a.getAttribute('href') || '#',
  }));

  block.innerHTML = `
    <header class="flex items-center justify-between p-4 bg-white shadow-md">
      <a href="${firstLinkHref}" class="text-lg font-bold" aria-label="${firstLinkText}">${firstLinkText}</a>
      
      <div class="flex flex-col md:flex-row md:items-center gap-4 md:space-x-4 ml-auto"> 
        <button id="menu-toggle" class="px-3 py-2 border rounded-lg text-gray-700 border-gray-300 hover:bg-gray-200 cursor-pointer transition-all duration-200 md:order-last" aria-expanded="false" aria-controls="menu-content">Menu</button>
        <nav id="menu-content" class="top-full w-full md:w-auto bg-white p-2" aria-hidden="true">
          <ul class="flex flex-col md:flex-row md:space-x-4">
            ${menuLinks.map((link) => `
            <li>
                <a href="${link.href}" class="block px-4 py-2 md:p-0 hover:text-blue-500 cursor-pointer relative group" aria-label="${link.text}">
                    ${link.text}
                    <span class="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                </a>
            </li>`).join('')}
          </ul>
        </nav>
      </div>
      
      <button class="text-gray-700" aria-label="Search">
        <span class="icon icon-search"></span>
      </button>
    </header>
  `;

  setupHeaderListeners(block);
}
