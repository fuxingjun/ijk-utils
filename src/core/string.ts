/**
 * @description: 下划线转换驼峰
 * @param {string} name
 * @return {*}
 */
export function toHump(name: string): string {
  return name.replace(/_(\w)/g, function (_all, letter) {
    return letter.toUpperCase();
  });
}

/**
 * @description: 驼峰转换下划线
 * @param {string} name
 * @return {*}
 */
export function toLine(name: string): string {
  return name.replace(/([A-Z])/g, "_$1").toLowerCase();
}

/**
 * 将对象的key转为下划线
 * @param source
 * @returns {*}
 */
export function objectKey2Line(source: Record<string, any>): Record<string, any> {
  const reg = /([A-Z])/g;
  const type = Object.prototype.toString.call(source);
  if (type === "[object Object]") {
    Reflect.ownKeys(source).forEach(key => {
      if (typeof key !== "string") return;
      if (reg.test(key)) {
        const lineKey = toLine(key);
        source[lineKey] = source[key];
        Reflect.deleteProperty(source, key);
        objectKey2Line(source[lineKey]);
      } else {
        objectKey2Line(source[key]);
      }
    });
  } else if (type === '[object Array]') {
    source.forEach((item: Record<string, any>) => {
      objectKey2Line(item);
    });
  }
  return source;
}

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
export const getTextWidth = (function () {
  let canvas: HTMLCanvasElement;
  return function getTextWidth(
    text: string,
    font: string = 'bold 12px system-ui, —apple-system, Segoe UI, Roboto, Emoji, Helvetica, Arial, sans-serif'
  ): number {
    // re-use canvas object for better performance
    !canvas && (canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d')!;
    context.font = font;
    const metrics = context.measureText(getMaxText(text));
    return metrics.width;
  };
})();

/**
 * 如果字符串中有\r\n,返回最长的一部分
 * @param {*} text 
 * @returns 
 */
function getMaxText(text: string) {
  if (text.indexOf("\n") > -1) {
    const textList = text.split("\n");
    const max = textList.reduce((total, current, index) => {
      if (current.length > total.length) {
        total.length = current.length;
        total.index = index;
      }
      return total;
    }, { index: 0, length: 0 });
    return textList[max.index];
  }
  return text;
}

export function copyText(content: string, success?: Function) {
  success = success || function () {
  };

  // 是否降级使用
  const isFallback = !navigator.clipboard;

  let eleTextarea = document.querySelector('#tempTextarea') as HTMLTextAreaElement;
  if (!eleTextarea && isFallback) {
    eleTextarea = document.createElement('textarea');
    eleTextarea!.style.width = "0";
    eleTextarea.style.position = 'fixed';
    eleTextarea.style.left = '-999px';
    eleTextarea.style.top = '10px';
    eleTextarea.setAttribute('readonly', 'readonly');
    document.body.appendChild(eleTextarea);
  }

  function funCopy(text: string, callback?: Function) {
    callback = (callback || function () {
    }) as Function;

    if (!isFallback) {
      navigator.clipboard.writeText(text).then(function () {
        callback!();
        // 成功回调
        success!(text);
      }, function () {
        // 禁止写入剪切板后使用兜底方法
        copyText(text);
        callback?.();
        // 成功回调
        success!(text);
      });

      return;
    }

    eleTextarea!.value = text;
    eleTextarea!.select();
    document.execCommand('copy', true);

    callback();

    // 成功回调
    success!(text);
  }

  funCopy(content);
}

