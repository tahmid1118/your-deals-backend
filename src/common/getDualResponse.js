

const fs = require('fs');
const path = require('path');

/**
 * Gets messages in both English and Bengali for dual response
 * @param {string} msgKey - The message key to retrieve from response-message.json
 * @returns {Object} Object containing both English and Bengali messages
 * @description This function returns both English and Bengali translations for a given message key
 */
const getDualResponse = (msgKey) => {
    // Path to the JSON file containing translations
    const translationsPath = path.join(__dirname, '../common/response-message.json');

    let translations;
    try {
        const fileContent = fs.readFileSync(translationsPath, 'utf-8');
        translations = JSON.parse(fileContent);
    } catch (error) {
        throw new Error('Unable to load translations file.');
    }

    // Get messages from both languages
    const enMessages = translations['en'] || {};
    const bnMessages = translations['bn'] || {};

    const enMessage = enMessages[msgKey] || 'Message not found';
    const bnMessage = bnMessages[msgKey] || 'বার্তা পাওয়া যায়নি';

    return {
        en: enMessage,
        bn: bnMessage
    };
};

module.exports = {
    getDualResponse
};
