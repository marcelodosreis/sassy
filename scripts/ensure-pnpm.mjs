const userAgent = process.env.npm_config_user_agent || '';
const execPath = process.env.npm_execpath || '';

const isPnpm = userAgent.startsWith('pnpm/') || execPath.includes('pnpm');

if (!isPnpm) {
  console.error('This project uses pnpm only. Run `pnpm install` instead of npm/yarn.');
  process.exit(1);
}
