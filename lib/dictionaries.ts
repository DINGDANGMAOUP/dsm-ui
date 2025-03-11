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

// 中文翻译
const zhDictionaries = {
  common: require("../locales/zh/common.json"),
  home: require("../locales/zh/home.json"),
  login: require("../locales/zh/login.json"),
  dashboard: require("../locales/zh/dashboard.json"),
};

// 英文翻译
const enDictionaries = {
  common: require("../locales/en/common.json"),
  home: require("../locales/en/home.json"),
  login: require("../locales/en/login.json"),
  dashboard: require("../locales/en/dashboard.json"),
};

// 所有翻译
const dictionaries: Record<string, Record<string, any>> = {
  zh: zhDictionaries,
  en: enDictionaries,
};

/**
 * 获取指定语言和命名空间的翻译内容
 * @param locale 语言代码
 * @param namespace 命名空间
 * @returns 翻译内容
 */
export async function loadNamespace(locale: string, namespace: string): Promise<any> {
  try {
    console.log(`loadNamespace: 加载 ${locale} 的 ${namespace} 命名空间`);

    // 获取翻译内容
    const translations = dictionaries[locale]?.[namespace];

    if (translations) {
      console.log(`loadNamespace: 成功加载 ${locale} 的 ${namespace} 命名空间`);
      return translations;
    }

    // 如果找不到翻译，尝试使用默认语言
    if (locale !== defaultLocale) {
      console.log(
        `loadNamespace: 找不到 ${locale} 的 ${namespace} 命名空间，尝试使用默认语言 ${defaultLocale}`
      );
      return loadNamespace(defaultLocale, namespace);
    }

    // 如果默认语言也找不到，返回空对象
    console.log(`loadNamespace: 找不到 ${locale} 的 ${namespace} 命名空间，返回空对象`);
    return {};
  } catch (error) {
    console.error(`loadNamespace: 加载 ${locale} 的 ${namespace} 命名空间失败:`, error);

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
  console.log(`getDictionary: 获取 ${targetLocale} 的字典`);

  // 如果已经缓存，则直接返回
  if (dictionaryCache[targetLocale]) {
    console.log(`getDictionary: 使用缓存的 ${targetLocale} 字典`);
    return dictionaryCache[targetLocale];
  }

  // 加载所有命名空间的翻译
  const dictionary: Dictionary = {};

  for (const namespace of namespaces) {
    dictionary[namespace] = await loadNamespace(targetLocale, namespace);
  }

  // 缓存结果
  dictionaryCache[targetLocale] = dictionary;
  console.log(`getDictionary: 缓存 ${targetLocale} 字典`);

  return dictionary;
}
