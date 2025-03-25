function getBackgroundColor(infoText) {
  switch (infoText.toLowerCase()) {
    case 'info':
      return 'bg-stone-100'; // Tailwind class for info background
    case 'warning':
      return 'bg-yellow-100'; // Tailwind class for warning background
    case 'error':
      return 'bg-red-100'; // Tailwind class for error background
    default:
      return 'bg-stone-100'; // Default class for unknown types
  }
}

export default function decorate(block) {
  const [infoText, contentText] = [...block.querySelectorAll('.infobox > div > div')].map((div) => div.textContent);
  const bgColorClass = getBackgroundColor(infoText);

  block.innerHTML = `
    <div class="${bgColorClass} rounded-xl my-2 p-5 border border-stone-200 text-grey-800">${contentText}</div>
  `;
}
