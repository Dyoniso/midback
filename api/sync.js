const tables = require('../app').tables
const db = require('./database')
const Logger = require('./logger')
const logger = new Logger('app')
const fs = require('fs')
const fm = require('./fileManager')

function createFileSystem() {
    let filesPath = './public/files/'

    if (!fs.existsSync(filesPath)) fs.mkdirSync(filesPath)
    if (!fs.existsSync(filesPath + fm.dirName.image)) fs.mkdirSync(filesPath + fm.dirName.image)
    if (!fs.existsSync(filesPath + fm.dirName.thumb)) fs.mkdirSync(filesPath + fm.dirName.thumb)
    if (!fs.existsSync(filesPath + fm.dirName.video)) fs.mkdirSync(filesPath + fm.dirName.video)
    if (!fs.existsSync(filesPath + fm.dirName.audio)) fs.mkdirSync(filesPath + fm.dirName.audio)
    logger.info('Dir sync completed!')
}

function createImagesTables() {
    try {
        db.query(`
            CREATE TABLE ${tables.IMAGES} (
                id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                uid varchar(100) NOT NULL,
                size integer DEFAULT 0,
                height integer DEFAULT 0,
                width integer DEFAULT 0,
                vip boolean DEFAULT false,
                filename varchar(300) DEFAULT(''),
                mimetype varchar(300) DEFAULT(''),
                sequence varchar(300) DEFAULT(''),
                date timestamp DEFAULT current_timestamp
            );  
        `)
        logger.info('Table: images, successful created!')
    } catch (err) {
        logger.fatal('Fatal error after create file table')
    }
}

async function createVideosTable() {
    try {
        db.query(`
            CREATE TABLE ${tables.VIDEOS} (
                id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                uid varchar(100) NOT NULL,
                size integer DEFAULT 0,
                vip boolean DEFAULT false,
                filename varchar(300) DEFAULT(''),
                mimetype varchar(300) DEFAULT(''),
                sequence varchar(300) DEFAULT(''),
                thumb_name varchar(32) DEFAULT(''),
                date timestamp DEFAULT current_timestamp
            );  
        `)
        logger.info('Table: videos, successful created!')
    } catch (err) {
        logger.fatal('Fatal error after create file table')
    }
}

async function createVipTable() {
    try {
        db.query(`
            CREATE TABLE ${tables.VIP} (
                id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                uid varchar(100) NOT NULL,
                key varchar(100) NOT NULL,
                activate_uids text DEFAULT('[]'),
                expires varchar(300) DEFAULT(''),
                date timestamp DEFAULT current_timestamp
            );  
        `)
        logger.info('Table: vip, successful created!')

    } catch (err) {
        logger.fatal('Fatal error after create vip table')
    }
}

async function createAudiosTable() {
    try {
        db.query(`
            CREATE TABLE ${tables.AUDIOS} (
                id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                uid varchar(100) NOT NULL,
                size integer DEFAULT 0,
                vip boolean DEFAULT false,
                filename varchar(300) DEFAULT(''),
                mimetype varchar(300) DEFAULT(''),
                sequence varchar(300) DEFAULT(''),
                date timestamp DEFAULT current_timestamp
            );  
        `)
        logger.info('Table: audios, successful created!')
    } catch (err) {
        logger.fatal('Fatal error after create file table')
    }
}

async function createGoalTable() {
    try {
        db.query(`
            CREATE TABLE ${tables.GOAL} (
                id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                amount_limit int DEFAULT 30,
                amount int DEFAULT 0,
                award TEXT DEFAULT '',
                begin timestamp DEFAULT current_timestamp
            );  
        `)
        logger.info('Table: goal, successful created!')
    } catch (err) {
        logger.fatal('Fatal error after create file table')
    }
}

async function createUidsTable() {
    try {
        db.query(`
            CREATE TABLE ${tables.UIDS} (
                id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                uid varchar(200) NOT NULL,
                date timestamp DEFAULT current_timestamp
            );  
        `)
        logger.info('Table: uids, successful created!')
    } catch (err) {
        logger.fatal('Fatal error after create file table')
    }
}


async function checkTableExists(table) {
    try {
        let q = await db.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE  table_schema = 'public'
                AND    table_name   = '${table}'
            );
        `)
        return (q[0] && q[0].exists === true)

    } catch (err) { 
        logger.error('Error after check table')
    }
    return false
}

;(async() => {
    createFileSystem()
    if (await checkTableExists(tables.IMAGES) === false) createImagesTables()
    if (await checkTableExists(tables.VIDEOS) === false) createVideosTable()
    if (await checkTableExists(tables.AUDIOS) === false) createAudiosTable()
    if (await checkTableExists(tables.VIP) === false) createVipTable()
    if (await checkTableExists(tables.GOAL) === false)  createGoalTable()
    if (await checkTableExists(tables.UIDS) === false)  createUidsTable()
})()