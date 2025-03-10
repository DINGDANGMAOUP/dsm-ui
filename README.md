# DSM-UI

这是一个使用Next.js构建的企业级应用前端，包含认证和权限控制。

## 项目架构

项目采用以下架构：

1. **Next.js客户端**：用户界面和客户端逻辑
2. **Next.js API路由**：作为中间层，转发请求到SpringBoot后端
3. **SpringBoot后端**：提供API服务

在开发环境中，使用MSW（Mock Service Worker）拦截对SpringBoot后端的请求，并返回模拟数据，以便在没有实际后端的情况下进行开发和测试。

## 认证和权限

项目实现了JWT认证，包含以下功能：

- 用户登录和登出
- 令牌刷新机制
- 基于角色和权限的访问控制

用户角色包括：

- 管理员（ADMIN）：拥有所有权限
- 经理（MANAGER）：拥有读取和写入权限
- 用户（USER）：仅拥有读取权限

权限包括：

- 读取（READ）
- 写入（WRITE）
- 删除（DELETE）
- 管理（ADMIN）

## 开发环境配置

### 环境变量

创建一个`.env.local`文件，包含以下环境变量：

```
# SpringBoot API地址
SPRING_BOOT_API_URL=http://localhost:8080/api
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

在开发环境中，MSW会自动拦截对SpringBoot后端的请求，并返回模拟数据。

## 测试账号

在开发环境中，可以使用以下测试账号：

- 管理员：username: admin, password: password
- 经理：username: manager, password: password
- 普通用户：username: user, password: password

## 生产环境部署

在生产环境中，需要配置实际的SpringBoot后端地址：

```
SPRING_BOOT_API_URL=https://your-springboot-api.com/api
```

构建生产版本：

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

启动生产服务器：

```bash
npm run start
# 或
yarn start
# 或
pnpm start
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Code Style and Linting

This project uses the following tools for code quality and consistency:

- [ESLint](https://eslint.org/) - For JavaScript/TypeScript linting
- [Prettier](https://prettier.io/) - For code formatting
- [Stylelint](https://stylelint.io/) - For CSS/SCSS linting
- [EditorConfig](https://editorconfig.org/) - For consistent editor settings

### Available Scripts

```bash
# Lint JavaScript/TypeScript files
pnpm lint

# Fix ESLint issues
pnpm lint:fix

# Format code with Prettier
pnpm format

# Check if files are formatted with Prettier
pnpm format:check

# Lint CSS/SCSS files
pnpm stylelint

# Fix Stylelint issues
pnpm stylelint:fix
```

### VS Code Integration

This project includes VS Code settings for optimal developer experience. Install the recommended extensions when prompted for the best experience.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
