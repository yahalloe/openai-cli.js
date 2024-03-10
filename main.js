import { config } from 'dotenv';
import OpenAI from 'openai';
import chalk from 'chalk';

import {
    enterMessage, 
    getMaxTokens,
    getSystemMessage,
    getModel, 
} from './utils.js'

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
    


    while (true) {
        const system_message = await getSystemMessage();
        const userMessage = await enterMessage(); // Use await to get user input

        if (userMessage === 'exit') {
            console.log("Exiting program");
            break;
        }

        const completion = await client.chat.completions.create({
            model: selectedModel,
            messages: [
                { "role": "system", "content": system_message },
                { "role": "user", "content": userMessage },
            ],
            temperature: temperature,
            max_tokens: max_tokens,
        });

        console.log(`\n${chalk.redBright('Assistant: ')}${completion.choices[0].message.content}\n`);
    }
}

main();
