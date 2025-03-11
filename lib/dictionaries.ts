import fs from "fs";
import path from "path";

// 支持的语言列表
export const locales = ["en", "zh"];
// 默认语言
export const defaultLocale = "zh";

// 翻译命名空间
export const namespaces = ["common", "home", "login", "dashboard"];

// 字典类型定义
export type Dictionary = {
  [namespace: string]: {
    [key: string]: any;
  };
};

// 缓存已加载的翻译
const dictionaryCache: Record<string, Dictionary> = {};

/**
 * 从 JSON 文件中加载翻译内容
 * @param locale 语言代码
 * @param namespace 命名空间
 * @returns 翻译内容
 */
export async function loadNamespace(locale: string, namespace: string): Promise<any> {
  try {
    // 构建文件路径
    const filePath = path.join(process.cwd(), "locales", locale, `${namespace}.json`);

    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, "utf8");

    // 解析 JSON
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Failed to load namespace ${namespace} for locale ${locale}:`, error);

    // 如果加载失败，尝试加载默认语言的翻译
    if (locale !== defaultLocale) {
      return loadNamespace(defaultLocale, namespace);
    }

    // 如果默认语言也加载失败，返回空对象
    return {};
  }
}

/**
 * 获取指定语言的所有翻译内容
 * @param locale 语言代码
 * @returns 所有翻译内容
 */
export async function getDictionary(locale: string): Promise<Dictionary> {
  // 如果请求的语言不存在，则使用默认语言
  const targetLocale = locales.includes(locale) ? locale : defaultLocale;

  // 如果已经缓存，则直接返回
  if (dictionaryCache[targetLocale]) {
    return dictionaryCache[targetLocale];
  }

  // 加载所有命名空间的翻译
  const dictionary: Dictionary = {};

  for (const namespace of namespaces) {
    dictionary[namespace] = await loadNamespace(targetLocale, namespace);
  }

  // 缓存结果
  dictionaryCache[targetLocale] = dictionary;

  return dictionary;
}
