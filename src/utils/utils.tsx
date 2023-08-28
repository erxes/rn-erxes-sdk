export function getAttachmentUrl(value: string, subDomain: string) {
  const baseUrl = `https://${subDomain}/gateway`;
  if (value && !value.includes('https')) {
    return baseUrl + '/read-file?key=' + value;
  }
  return value;
}

export const strip_html = (string: any, withoutCut?: boolean) => {
  if (typeof string === 'undefined' || string === null) {
    return;
  } else {
    const regex = /(&nbsp;|<([^>]+)>)/gi;
    let result = string.replace(regex, '');
    result = result.replace(/&#[0-9][0-9][0-9][0-9];/gi, ' ');
    if (withoutCut) {
      return result;
    }
    const cut = result.slice(0, 70);
    return cut;
  }
};

// check if valid url
export const isValidURL = (u: string) => {
  try {
    return Boolean(new URL(u));
  } catch (e) {
    return false;
  }
};
