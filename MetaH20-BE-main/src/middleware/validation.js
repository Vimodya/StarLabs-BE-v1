import Joi from 'joi';

export const validateTransaction = (req, res, next) => {
  const schema = Joi.object({
    publicKey: Joi.string().required().min(32).max(44),
    transactionHash: Joi.string().required().min(32),
    paymentCurrency: Joi.string().valid('SOL', 'USDT').required(),
    amountPaid: Joi.number().positive().required(),
    tokensReceived: Joi.number().positive().required(),
    exchangeRate: Joi.number().positive().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};
