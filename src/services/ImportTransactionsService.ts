/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const csvFilePath = path.join(uploadConfig.directory, filename);
    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);
    const lines = new Array<[string, 'outcome' | 'income', number, string]>();

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const createTransaction = new CreateTransactionService();
    const transactions = [];
    for (const line of lines) {
      const [title, type, value, category] = line;

      const transaction = await createTransaction.execute({
        title,
        type,
        value: Number(value),
        category,
      });

      transactions.push(transaction);
    }

    return transactions as Array<Transaction>;
  }
}

export default ImportTransactionsService;
