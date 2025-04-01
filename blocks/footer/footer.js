import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';

  // extract footer sections
  const sections = [...fragment.querySelectorAll(':scope > div')].map((div) => {
    const title = div.querySelector('p')?.textContent.trim() || '';
    const links = [...div.querySelectorAll('ul li a')].map((a) => ({
      text: a.textContent.trim(),
      href: a.getAttribute('href') || '#',
    }));
    return { title, links };
  });

  // setup footer DOM
  block.innerHTML = `
    <footer class="bg-gray-100 p-6 text-gray-800">
      <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        ${sections.filter((section) => section.links.length > 0).map((section) => `
          <section>
            <h2 class="text-lg font-semibold mb-2">${section.title}</h2>
            <ul>
              ${section.links.map((link) => `
                <li><a href="${link.href}" class="text-blue-600 hover:underline">${link.text}</a></li>
              `).join('')}
            </ul>
          </section>
        `).join('')}
      </div>
      <div class="container mx-auto grid grid-cols-1 gap-6">
        ${sections.filter((section) => section.links.length === 0).map((section) => `
          <section class="text-center mt-6 text-sm">
            <p>${section.title}</p>
          </section>
        `).join('')}
      </div>
    </footer>
  `;
}
