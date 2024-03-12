import { config } from 'dotenv';
import OpenAI from 'openai';
import chalk from 'chalk';

import {
    enterMessage, 
    getMaxTokens,
    getSystemMessage,
    getModel, 
} from './utils.js'

/**
 * 23.10.03
 * 
 * @todo: retain chat context FINISHED
 * but the history also consumes the tokens limit tho
 * 
 * @todo: fine tune the inquirer prompt types for
 * better user experience. FINISHED
 * I think my implementaion of inquirer.js is decent, so no need
 * to use the native api's that much.
 */

config();

const client = new OpenAI({
    apiKey: process.env.API_KEY,
});

async function main() {
    console.clear()
    const selectedModel = await getModel();
    const temperature = 0.3;
    console.clear()
    const max_tokens = await getMaxTokens();
    console.clear()
    
    let conversationHistory = [];

    while (true) {
        const system_message = await getSystemMessage();
        const userMessage = await enterMessage(); 

        if (userMessage === 'exit') {
            console.log("Exiting program");
            break;
        }

        // Add user message to the conversation history
        conversationHistory.push({ "role": "user", "content": userMessage });


        const completion = await client.chat.completions.create({
            model: selectedModel,
            messages: [
                { "role": "system", "content": system_message },
                ...conversationHistory,  // Include conversation history
                { "role": "user", "content": userMessage },
            ],
            temperature: temperature,
            max_tokens: max_tokens,
        });

        // Add assistant response to the conversation history
        conversationHistory.push({ "role": "assistant", "content": completion.choices[0].message.content });
        console.log(`\n${chalk.redBright('Assistant: ')}${completion.choices[0].message.content}\n`);
    }
}

main();
