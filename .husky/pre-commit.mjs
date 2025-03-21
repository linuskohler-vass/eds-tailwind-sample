// check if styles/base.css was modified - rebuild tailwindcss
const changeset = await run('git diff --cached --name-only --diff-filter=ACMR');
const modifiedFiles = changeset.split('\n').filter(Boolean);

const modifiedTailwind = modifiedFiles.filter((file) => file.match(/base.css/));
if (modifiedTailwind.length > 0) {
  const output = await run('npm run build:tailwind');
  console.log(output);
  await run('git add styles/styles.css');
}
