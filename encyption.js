import crypto from 'crypto'
import config from './config.js'

const {secret_key, secret_iv, encryption_method} = config

if(!secret_key || !secret_iv || !encryption_method){
    throw new Error('Datos erroneos')
}

const key =crypto
    .createHash('sha512')
    .update(secret_key)
    .digest('hex')
    .substring(0,32)

const encryptionIV = crypto
    .createHash('sha512')
    .update(secret_iv)
    .digest('hex')
    .substring(0,16)

export function encryptData(data){
    const cipher = crypto.createCipheriv(encryption_method,key, encryptionIV)
    return Buffer.from(
        cipher.update(data,'utf8','hex')+cipher.final('hex')
    ).toString('base64')
}

export function decryptData(encryptData){
    const buff = Buffer.from(encryptData, 'base64')
    const decipher = crypto.createDecipheriv(encryption_method, key, encryptionIV)
    return(
        decipher.update(buff.toString('utf8'), 'hex','utf8')+
        decipher.final('utf8')
    )
}