function toVal(mix: string | Record<string, unknown>) {
  let k;
  let y;
  let str = "";

  if (typeof mix === "string" || typeof mix === "number") {
    str += mix;
  } else if (typeof mix === "object") {
    if (Array.isArray(mix)) {
      for (k = 0; k < mix.length; k++) {
        if (mix[k]) {
          if ((y = toVal(mix[k]))) {
            str && (str += " ");
            str += y;
          }
        }
      }
    } else {
      for (k in mix) {
        if (mix[k]) {
          str && (str += " ");
          str += k;
        }
      }
    }
  }

  return str;
}

export function clsx(
  ...params: Array<undefined | string | Record<string, unknown>>
) {
  let i = 0;
  let tmp;
  let x;
  let str = "";

  while (i < params.length) {
    if ((tmp = params[i++])) {
      if ((x = toVal(tmp))) {
        str && (str += " ");
        str += x;
      }
    }
  }

  return str;
}

export default clsx;
