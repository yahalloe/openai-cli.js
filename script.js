import { config } from 'dotenv';
import OpenAI from 'openai';
import inquirer from 'inquirer';
import chalk from 'chalk';

config();

const enterMessage = async () => {
    const answer = await inquirer.prompt({
        name: 'enterMessage',
        type: 'input',
        message: `\n${chalk.blueBright('You:')} `,
        default() {
            return 'Enter message';
        },
    });

    return answer.enterMessage;
};

const getModel = async () => {
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
};

const client = new OpenAI({
    apiKey: process.env.API_KEY,
});

async function main() {
    const selectedModel = await getModel();
    const temperature = 0.3;
    const max_tokens = 300;
    const system_message = "You are a helpful assistant.";

    while (true) {
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
