import inquirer from 'inquirer';
import fs from 'fs'; // read file
import chalk from 'chalk';

let filePath = "readCode.txt";
let defaultSystemMessage = 'You are a helpful assistant that answers concisely in the given max token to you.'
let defaultAnimeSystemMessage = 'You are a helpful and cute waifu assistant that answers concisely in the given max token to you.'
let defaultMaxTokens = 80


/**
 * @returns {string} - whether a code or user input from the command like.
 */
export const enterMessage = async () => {

    const question = await inquirer.prompt({
        name: 'askIfReadCode',
        type: 'list',
        message: 'read code?',
        choices: [
            'no',
            'yes',
            'exit program',
        ]
    });

    if (question.askIfReadCode === 'yes') {
            try {
                const code = fs.readFileSync(filePath, 'utf-8');
                return code;
            } catch (error) {
                console.error(`Error reading file: ${error.message}`);
                process.exit(1);
            }
        
    } else if (question.askIfReadCode === 'no' ){

    const answer = await inquirer.prompt({
        name: 'enterMessage',
        type: 'input',
        message: `\n${chalk.blueBright('You:')} `,
        default() {
            return 'Enter message';
        },
    });

    return answer.enterMessage;

    } else {
        return 'exit'
    }
};


/**
 * @returns {number} - we need to cast and return a number because 
 * inquirer returns a string and api wants number
 */
export const getMaxTokens = async () => {
    const answer = await inquirer.prompt ({
        name: 'askIfChangeMaxTokens',
        type: 'list',
        message: 'change the Max tokens? \n default: ' + defaultMaxTokens, 
        choices: [
            'no',
            'yes',
        ], 
    });

    if(answer.askIfChangeMaxTokens === 'no') {
        return defaultMaxTokens
    } else {
        const answer = await inquirer.prompt({
            name: 'getMaxTokens',
            type: 'input',
            message: 'Enter max tokens: ',
        })

        return parseInt(answer.getMaxTokens)
    }
}


/**
 * @returns {string} - returns the user message, whether custom
 * or the default ones.
 */
export const getSystemMessage = async () => {
    const answer = await inquirer.prompt ({
        name: 'askIfChangeSystemMessage',
        type: 'list',
        message: 'change the system model message? (to better fine tune the answer to your wants)\n default: ' + defaultSystemMessage, 
        choices: [
            'no',
            'waifu',
            'yes',
        ], 
    });

    if (answer.askIfChangeSystemMessage === 'no') {
        return defaultSystemMessage
        
    } else if (answer.askIfChangeSystemMessage === 'yes') {
        const answer = await inquirer.prompt({
            name: 'getSytemMessage',
            type: 'input',
            message: 'Enter system role message/context: ',
        })

        defaultSystemMessage = answer.getSytemMessage
        return answer.getSytemMessage
    
    } else {

        return defaultAnimeSystemMessage;
    
    }
}

/**
 * @returns {string} - just the model type in string.
 * all are in turbo to maximize cost efficiency.
 */
export const getModel = async () => {
    const answer = await inquirer.prompt({
        name: 'getModel',
        type: 'list',
        message: 'Select the model to be used: ',
        choices: [
            'Chatgpt-4',
            'chatgpt-3.5',
        ],
    });

    if (answer.getModel === 'chatgpt-3.5') {
        return 'gpt-3.5-turbo-0125'; // Corrected to return the selected model
    } else {
        return 'gpt-4-turbo-preview';
    }
}
