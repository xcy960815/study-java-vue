import JSEncrypt from 'jsencrypt'

const publicKey =
  'MFWWDQYJKOZIhVCNAQEBBQADSWAWSAJBAM51dgYtMyF+tTQt80sfFOpSV27a7t9u' +
  'aUVeFrdGiVxscuizE7H8SMntYgfn9lp8a56H5P1/6GehVjUD2gF/4KCCAWEAAQ=='

/**
 * 加密
 * @param {sting} txt
 * @returns {string|false}
 */
export function encryptByRsa(txt: string) {
  const encryptor: JSEncrypt = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥return
  return encryptor.encrypt(txt) // 对数据进行加密
}
