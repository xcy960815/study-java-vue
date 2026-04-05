const BLOCKED_TAGS = new Set([
  'script',
  'iframe',
  'object',
  'embed',
  'style',
  'meta',
  'base',
  'link',
  'form',
  'input',
  'textarea',
  'select',
  'option',
])

const URL_ATTRS = new Set(['href', 'src', 'xlink:href', 'formaction', 'poster'])

const SAFE_DATA_URL_PATTERN =
  /^data:image\/(?:png|gif|jpeg|jpg|webp|avif);base64,[a-z0-9+/=]+$/i

export const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const isSafeUrl = (value: string): boolean => {
  const normalizedValue = value.trim().replace(/[\u0000-\u001F\u007F\s]+/g, '')

  if (!normalizedValue) {
    return true
  }

  if (
    normalizedValue.startsWith('#') ||
    normalizedValue.startsWith('/') ||
    normalizedValue.startsWith('./') ||
    normalizedValue.startsWith('../')
  ) {
    return true
  }

  if (SAFE_DATA_URL_PATTERN.test(normalizedValue)) {
    return true
  }

  try {
    const baseUrl =
      typeof window !== 'undefined' ? window.location.origin : 'https://study-java-vue.local'
    const parsedUrl = new URL(normalizedValue, baseUrl)

    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsedUrl.protocol)
  } catch {
    return false
  }
}

const sanitizeElement = (element: Element): void => {
  const tagName = element.tagName.toLowerCase()

  if (BLOCKED_TAGS.has(tagName)) {
    element.remove()
    return
  }

  for (const attribute of [...element.attributes]) {
    const name = attribute.name.toLowerCase()

    if (name.startsWith('on') || name === 'style' || name === 'srcset') {
      element.removeAttribute(attribute.name)
      continue
    }

    if (URL_ATTRS.has(name) && !isSafeUrl(attribute.value)) {
      element.removeAttribute(attribute.name)
    }
  }

  if (tagName === 'a' && element.hasAttribute('href')) {
    element.setAttribute('rel', 'noopener noreferrer nofollow')
  }

  for (const child of [...element.children]) {
    sanitizeElement(child)
  }
}

export const sanitizeHtml = (html: string): string => {
  if (!html) {
    return ''
  }

  if (typeof DOMParser === 'undefined') {
    return escapeHtml(html)
  }

  const parser = new DOMParser()
  const documentFragment = parser.parseFromString(html, 'text/html')

  for (const element of [...documentFragment.body.children]) {
    sanitizeElement(element)
  }

  return documentFragment.body.innerHTML
}
