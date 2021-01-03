import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const deleteTransaction = await transactionsRepository.find({
      where: {
        id,
      },
    });

    console.log(id, deleteTransaction);

    if (!deleteTransaction) {
      throw new AppError('Transação não encontrada', 404);
    }
    await transactionsRepository.remove(deleteTransaction);
  }
}

export default DeleteTransactionService;
